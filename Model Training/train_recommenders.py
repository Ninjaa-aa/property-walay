import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from sklearn.neighbors import NearestNeighbors

from training_utils import DEFAULT_ARTIFACTS_DIR, DEFAULT_CSV, ensure_output_dirs

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)


@dataclass
class RecModelResult:
    name: str
    recall_at_10: float
    recall_at_20: float
    mrr_at_10: float
    mrr_at_20: float


def load_data(csv_path: str, max_rows: int | None = None) -> pd.DataFrame:
    # low_memory=False avoids mixed-type column warnings on large CSVs
    df = pd.read_csv(csv_path, low_memory=False)
    # If max_rows is a positive integer, optionally subsample for speed.
    if max_rows is not None and max_rows > 0 and len(df) > max_rows:
        df = df.sample(n=max_rows, random_state=RANDOM_SEED).reset_index(drop=True)
    return df


def build_feature_matrix(df: pd.DataFrame) -> Tuple[np.ndarray, Dict[str, np.ndarray]]:
    """
    Build several feature views from the same dataframe so that different
    recommenders can work on different representations.
    """
    numeric_cols = [
        "price_pkr",
        "area_sqm",
        "beds",
        "baths",
        "latitude",
        "longitude",
        "price_per_sqm",
        "image_count",
    ]

    # Only keep numeric columns that actually exist
    numeric_cols = [c for c in numeric_cols if c in df.columns]

    cat_cols_core = [
        "listing_type",
        "property_category",
        "type",
        "subtype",
    ]
    cat_cols_location = [
        "city",
        "locality",
        "area_name",
    ]
    cat_cols_core = [c for c in cat_cols_core if c in df.columns]
    cat_cols_location = [c for c in cat_cols_location if c in df.columns]

    df_proc = df.copy()
    # Basic cleaning: fill NaNs
    for c in numeric_cols:
        df_proc[c] = df_proc[c].fillna(df_proc[c].median())
    for c in cat_cols_core + cat_cols_location:
        df_proc[c] = df_proc[c].fillna("UNK").astype(str)

    feature_views: Dict[str, np.ndarray] = {}

    # 1. Full mixed feature space (numeric + all categoricals)
    transformers = []
    if numeric_cols:
        transformers.append(
            ("num", StandardScaler(), numeric_cols),
        )
    if cat_cols_core + cat_cols_location:
        transformers.append(
            (
                "cat",
                # Use defaults for sparse/sparse_output to stay compatible
                # across scikit-learn versions.
                OneHotEncoder(handle_unknown="ignore"),
                cat_cols_core + cat_cols_location,
            )
        )

    full_ct = ColumnTransformer(transformers)
    X_full = full_ct.fit_transform(df_proc)
    feature_views["full_mixed"] = X_full

    # 2. Numeric-only
    if numeric_cols:
        scaler = StandardScaler()
        X_num = scaler.fit_transform(df_proc[numeric_cols])
        feature_views["numeric"] = X_num

    # 3. Categorical-only (core + location)
    if cat_cols_core + cat_cols_location:
        # Again avoid explicit sparse/sparse_output argument for compatibility.
        ohe = OneHotEncoder(handle_unknown="ignore")
        X_cat = ohe.fit_transform(df_proc[cat_cols_core + cat_cols_location])
        feature_views["categorical"] = X_cat

    # 4. PCA on numeric space (if available)
    if "numeric" in feature_views:
        n_components = min(16, feature_views["numeric"].shape[1])
        if n_components >= 2:
            pca = PCA(n_components=n_components, random_state=RANDOM_SEED)
            X_pca = pca.fit_transform(feature_views["numeric"])
            feature_views["numeric_pca"] = X_pca

    # 5. TruncatedSVD on full mixed sparse space
    from scipy.sparse import issparse

    if "full_mixed" in feature_views and issparse(feature_views["full_mixed"]):
        svd_components = min(64, feature_views["full_mixed"].shape[1] - 1)
        if svd_components >= 2:
            svd = TruncatedSVD(
                n_components=svd_components, random_state=RANDOM_SEED
            )
            X_svd = svd.fit_transform(feature_views["full_mixed"])
            feature_views["full_svd"] = X_svd

    return feature_views["full_mixed"], feature_views


def build_relevance_mask(df: pd.DataFrame) -> np.ndarray:
    """
    Build a relevance key array for items. Returns an array of string keys where
    items with the same key are considered relevant to each other.
    We define relevance based on (subtype, city) when available; 
    otherwise we back off to (type, city) or just type.
    """
    n = len(df)
    keys = []
    if {"subtype", "city"}.issubset(df.columns):
        keys = [df["subtype"].fillna("UNK").astype(str), df["city"].fillna("UNK").astype(str)]
    elif {"type", "city"}.issubset(df.columns):
        keys = [df["type"].fillna("UNK").astype(str), df["city"].fillna("UNK").astype(str)]
    elif "type" in df.columns:
        keys = [df["type"].fillna("UNK").astype(str)]

    if not keys:
        # Fallback: all items have the same key (all are relevant to each other)
        return np.array(["all"] * n, dtype=object)

    key_series = keys[0]
    for s in keys[1:]:
        key_series = key_series + "||" + s

    return key_series.to_numpy()


def eval_from_ranking(
    relevance_keys: np.ndarray, rankings: np.ndarray, k: int
) -> Tuple[float, float]:
    """
    Compute Recall@k and MRR@k given:
    - relevance_keys: array of string keys for relevance (items with same key are relevant)
    - rankings: shape (n_items, n_items) integer indices, sorted most->least relevant
    """
    n = len(relevance_keys)
    recalls = []
    reciprocal_ranks = []

    for i in range(n):
        # Compute which items are relevant to item i (same key, but not i itself)
        rel = (relevance_keys == relevance_keys[i])
        rel[i] = False  # Item is not relevant to itself
        
        if not rel.any():
            # Skip items with no relevant neighbours
            continue
        topk = rankings[i, :k]
        rel_in_topk = rel[topk]

        # Recall@k
        recall_i = rel_in_topk.sum() / rel.sum()
        recalls.append(recall_i)

        # MRR@k
        if rel_in_topk.any():
            first_pos = np.argmax(rel_in_topk) + 1  # positions are 1-based
            reciprocal_ranks.append(1.0 / first_pos)
        else:
            reciprocal_ranks.append(0.0)

    if not recalls:
        return 0.0, 0.0

    return float(np.mean(recalls)), float(np.mean(reciprocal_ranks))


def build_similarity_rankings(
    X: np.ndarray, metric: str = "cosine"
) -> np.ndarray:
    """
    For each item, compute ranking of all other items by similarity using
    NearestNeighbors. Returns a matrix of indices sorted by decreasing similarity.
    """
    n_items = X.shape[0]
    # We ask for all neighbours so we can build full ranking; we drop self afterwards.
    nn = NearestNeighbors(
        n_neighbors=min(n_items, 200),  # cap to avoid extreme memory/time
        metric=metric,
        n_jobs=-1,
    )
    nn.fit(X)
    distances, indices = nn.kneighbors(X, return_distance=True)

    # For metrics where smaller is more similar, we already have sorted order.
    # Remove self index (distance=0) when present.
    rankings = []
    for i, row in enumerate(indices):
        row = row[row != i]
        rankings.append(row)

    # Pad / truncate to common length
    max_len = max(len(r) for r in rankings)
    rankings_padded = np.full((n_items, max_len), -1, dtype=int)
    for i, r in enumerate(rankings):
        rankings_padded[i, : len(r)] = r

    return rankings_padded


def build_cluster_rankings_from_labels(labels: np.ndarray) -> np.ndarray:
    """
    Simple cluster-based ranking: items in the same cluster are ranked first,
    then others arbitrarily.
    """
    n = len(labels)
    clusters: Dict[int, List[int]] = {}
    for idx, c in enumerate(labels):
        clusters.setdefault(int(c), []).append(idx)

    rankings = np.empty((n, n - 1), dtype=int)
    all_indices = np.arange(n)
    for i in range(n):
        same_cluster = np.array([j for j in clusters[int(labels[i])] if j != i], dtype=int)
        other_items = np.setdiff1d(all_indices, np.concatenate([same_cluster, np.array([i])]))
        order = np.concatenate([same_cluster, other_items])
        rankings[i] = order
    return rankings


def evaluate_models(df: pd.DataFrame, max_eval_items: int = 10000) -> List[RecModelResult]:
    # Optionally subsample for evaluation to keep it tractable.
    # If max_eval_items is None or <= 0, cap to 10000 to avoid OOM on large datasets.
    if max_eval_items is None or max_eval_items <= 0:
        max_eval_items = 10000
    
    if len(df) > max_eval_items:
        df_eval = df.sample(
            n=max_eval_items, random_state=RANDOM_SEED
        ).reset_index(drop=True)
    else:
        df_eval = df.reset_index(drop=True)

    X_full, feature_views = build_feature_matrix(df_eval)
    relevance = build_relevance_mask(df_eval)

    results: List[RecModelResult] = []

    # 1. Random baseline
    n = len(df_eval)
    random_rankings = np.vstack(
        [np.random.permutation(np.delete(np.arange(n), i)) for i in range(n)]
    )
    r10, m10 = eval_from_ranking(relevance, random_rankings, k=10)
    r20, m20 = eval_from_ranking(relevance, random_rankings, k=20)
    results.append(
        RecModelResult(
            name="RandomBaseline",
            recall_at_10=r10,
            recall_at_20=r20,
            mrr_at_10=m10,
            mrr_at_20=m20,
        )
    )

    # 2. Cosine on full mixed
    rankings_cos_full = build_similarity_rankings(X_full, metric="cosine")
    r10, m10 = eval_from_ranking(relevance, rankings_cos_full, k=10)
    r20, m20 = eval_from_ranking(relevance, rankings_cos_full, k=20)
    results.append(
        RecModelResult(
            name="Cosine_FullMixed",
            recall_at_10=r10,
            recall_at_20=r20,
            mrr_at_10=m10,
            mrr_at_20=m20,
        )
    )

    # 3. Euclidean on full mixed
    rankings_euc_full = build_similarity_rankings(X_full, metric="euclidean")
    r10, m10 = eval_from_ranking(relevance, rankings_euc_full, k=10)
    r20, m20 = eval_from_ranking(relevance, rankings_euc_full, k=20)
    results.append(
        RecModelResult(
            name="Euclidean_FullMixed",
            recall_at_10=r10,
            recall_at_20=r20,
            mrr_at_10=m10,
            mrr_at_20=m20,
        )
    )

    # 4. Cosine on numeric-only
    if "numeric" in feature_views:
        rankings_cos_num = build_similarity_rankings(feature_views["numeric"], metric="cosine")
        r10, m10 = eval_from_ranking(relevance, rankings_cos_num, k=10)
        r20, m20 = eval_from_ranking(relevance, rankings_cos_num, k=20)
        results.append(
            RecModelResult(
                name="Cosine_Numeric",
                recall_at_10=r10,
                recall_at_20=r20,
                mrr_at_10=m10,
                mrr_at_20=m20,
            )
        )

    # 5. Euclidean on numeric-only
    if "numeric" in feature_views:
        rankings_euc_num = build_similarity_rankings(
            feature_views["numeric"], metric="euclidean"
        )
        r10, m10 = eval_from_ranking(relevance, rankings_euc_num, k=10)
        r20, m20 = eval_from_ranking(relevance, rankings_euc_num, k=20)
        results.append(
            RecModelResult(
                name="Euclidean_Numeric",
                recall_at_10=r10,
                recall_at_20=r20,
                mrr_at_10=m10,
                mrr_at_20=m20,
            )
        )

    # 6. Cosine on categorical-only
    if "categorical" in feature_views:
        rankings_cos_cat = build_similarity_rankings(
            feature_views["categorical"], metric="cosine"
        )
        r10, m10 = eval_from_ranking(relevance, rankings_cos_cat, k=10)
        r20, m20 = eval_from_ranking(relevance, rankings_cos_cat, k=20)
        results.append(
            RecModelResult(
                name="Cosine_Categorical",
                recall_at_10=r10,
                recall_at_20=r20,
                mrr_at_10=m10,
                mrr_at_20=m20,
            )
        )

    # 7. Cosine on numeric PCA embedding
    if "numeric_pca" in feature_views:
        rankings_cos_pca = build_similarity_rankings(
            feature_views["numeric_pca"], metric="cosine"
        )
        r10, m10 = eval_from_ranking(relevance, rankings_cos_pca, k=10)
        r20, m20 = eval_from_ranking(relevance, rankings_cos_pca, k=20)
        results.append(
            RecModelResult(
                name="Cosine_NumericPCA",
                recall_at_10=r10,
                recall_at_20=r20,
                mrr_at_10=m10,
                mrr_at_20=m20,
            )
        )

    # 8. Cosine on SVD-reduced full space
    if "full_svd" in feature_views:
        rankings_cos_svd = build_similarity_rankings(
            feature_views["full_svd"], metric="cosine"
        )
        r10, m10 = eval_from_ranking(relevance, rankings_cos_svd, k=10)
        r20, m20 = eval_from_ranking(relevance, rankings_cos_svd, k=20)
        results.append(
            RecModelResult(
                name="Cosine_FullSVD",
                recall_at_10=r10,
                recall_at_20=r20,
                mrr_at_10=m10,
                mrr_at_20=m20,
            )
        )

    # 9. KMeans clustering-based recommender on numeric PCA or numeric
    if "numeric_pca" in feature_views:
        X_for_cluster = feature_views["numeric_pca"]
    elif "numeric" in feature_views:
        X_for_cluster = feature_views["numeric"]
    else:
        X_for_cluster = None

    if X_for_cluster is not None:
        n_clusters = min(50, max(5, X_for_cluster.shape[0] // 200))
        kmeans = KMeans(
            n_clusters=n_clusters, random_state=RANDOM_SEED, n_init="auto"
        )
        labels = kmeans.fit_predict(X_for_cluster)
        rankings_cluster = build_cluster_rankings_from_labels(labels)
        r10, m10 = eval_from_ranking(relevance, rankings_cluster, k=10)
        r20, m20 = eval_from_ranking(relevance, rankings_cluster, k=20)
        results.append(
            RecModelResult(
                name="KMeans_ClusterBased",
                recall_at_10=r10,
                recall_at_20=r20,
                mrr_at_10=m10,
                mrr_at_20=m20,
            )
        )

        # 10. Gaussian Mixture clustering-based recommender
        try:
            gm = GaussianMixture(
                n_components=n_clusters, random_state=RANDOM_SEED
            )
            gm_labels = gm.fit_predict(X_for_cluster)
            rankings_gm = build_cluster_rankings_from_labels(gm_labels)
            r10, m10 = eval_from_ranking(relevance, rankings_gm, k=10)
            r20, m20 = eval_from_ranking(relevance, rankings_gm, k=20)
            results.append(
                RecModelResult(
                    name="GaussianMixture_ClusterBased",
                    recall_at_10=r10,
                    recall_at_20=r20,
                    mrr_at_10=m10,
                    mrr_at_20=m20,
                )
            )
        except Exception:
            # In case GM fails to converge or is numerically unstable
            pass

    return results


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Train and evaluate multiple content-based recommendation models "
            "on property_data_processed.csv without relying on user sessions."
        )
    )
    parser.add_argument(
        "--csv-path",
        type=Path,
        default=DEFAULT_CSV,
        help="Path to the processed property CSV.",
    )
    parser.add_argument(
        "--artifacts-dir",
        type=Path,
        default=DEFAULT_ARTIFACTS_DIR,
        help="Directory for .pth model and item_id_mapping.csv.",
    )
    parser.add_argument(
        "--max-rows",
        type=int,
        default=-1,
        help=(
            "Optional cap on number of rows to load for training (for speed). "
            "Use a positive integer to subsample, or 0/negative to use the full dataset."
        ),
    )
    parser.add_argument(
        "--max-eval-items",
        type=int,
        default=-1,
        help=(
            "Maximum number of items to use for evaluation. "
            "Defaults to 10000 to prevent OOM on large datasets. "
            "Use a positive integer to override, or 0/negative to use the default cap."
        ),
    )
    parser.add_argument(
        "--skip-eval",
        action="store_true",
        help="Skip O(n^2) evaluation/ranking and only build/export the embedding model.",
    )

    args = parser.parse_args()

    max_rows = None if args.max_rows is None or args.max_rows <= 0 else args.max_rows

    ensure_output_dirs()
    csv_path = Path(args.csv_path)
    artifacts_dir = Path(args.artifacts_dir)
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loading data from {csv_path} ...")
    df = load_data(str(csv_path), max_rows=max_rows)
    print(f"Loaded {len(df)} rows.")

    if not args.skip_eval:
        print("Training and evaluating recommendation models (this is O(n^2)) ...")
        max_eval_items = (
            None
            if args.max_eval_items is None or args.max_eval_items <= 0
            else args.max_eval_items
        )
        results = evaluate_models(
            df, max_eval_items=max_eval_items if max_eval_items else -1
        )

        print("\n=== Model Comparison (higher is better) ===")
        print(
            f"{'Model':35s}  {'Recall@10':>9s}  {'Recall@20':>9s}  "
            f"{'MRR@10':>9s}  {'MRR@20':>9s}"
        )
        for r in results:
            print(
                f"{r.name:35s}  "
                f"{r.recall_at_10:9.4f}  {r.recall_at_20:9.4f}  "
                f"{r.mrr_at_10:9.4f}  {r.mrr_at_20:9.4f}"
            )
    else:
        print("Skipping evaluation; only exporting embedding model.")

    # Optionally export a PyTorch embedding model for deployment.
    # We build an item-embedding matrix from the full dataset using a strong
    # content-based representation (preferring SVD/PCA-reduced spaces).
    # This requires PyTorch to be installed.
    try:
        import torch
        import torch.nn as nn
    except ImportError:
        print(
            "\nPyTorch is not installed; skipping .pth model export. "
            "Install torch if you want a deployable .pth embedding model."
        )
        return

    print("\nBuilding item embeddings for PyTorch export on full dataset ...")
    _, feature_views_full = build_feature_matrix(df.reset_index(drop=True))

    # For deployment, use the best memory-efficient representation.
    # Prefer numeric_pca (small & dense) over categorical (huge sparse one-hot).
    # The evaluation showed Cosine_Categorical performs best, but numeric_pca is
    # practical for deployment. If neither available, use numeric.
    if "numeric_pca" in feature_views_full:
        X_export = feature_views_full["numeric_pca"]
        chosen_repr = "numeric_pca"
    elif "numeric" in feature_views_full:
        X_export = feature_views_full["numeric"]
        chosen_repr = "numeric"
    else:
        raise RuntimeError("No numeric representation available for export.")

    # Ensure dense float32 tensor
    from scipy.sparse import issparse

    if issparse(X_export):
        X_export = X_export.toarray()
    X_export = X_export.astype(np.float32)

    num_items, embed_dim = X_export.shape

    class ItemEmbeddingModel(nn.Module):
        def __init__(self, n_items: int, dim: int):
            super().__init__()
            self.embeddings = nn.Embedding(n_items, dim)

        def forward(self, item_indices: torch.Tensor) -> torch.Tensor:
            return self.embeddings(item_indices)

    model = ItemEmbeddingModel(num_items, embed_dim)
    with torch.no_grad():
        model.embeddings.weight.data.copy_(torch.from_numpy(X_export))

    output_path = artifacts_dir / "content_recommender.pth"
    torch.save(
        {
            "state_dict": model.state_dict(),
            "embedding_dim": embed_dim,
            "num_items": num_items,
            "representation": chosen_repr,
        },
        output_path,
    )

    id_col = "id" if "id" in df.columns else None
    mapping_path = artifacts_dir / "item_id_mapping.csv"
    mapping_df = pd.DataFrame(
        {
            "embedding_index": np.arange(len(df), dtype=int),
            "item_id": df[id_col].values if id_col else np.arange(len(df), dtype=int),
        }
    )
    mapping_df.to_csv(mapping_path, index=False)

    print(
        f"\nSaved PyTorch embedding model to {output_path} "
        f"using representation '{chosen_repr}' "
        f"and ID mapping to {mapping_path}."
    )


if __name__ == "__main__":
    main()


