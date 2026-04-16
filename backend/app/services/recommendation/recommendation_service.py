"""
Content-based recommendation service.

Reads every row of public.property_embeddings on first use, builds an
L2-normalized numpy matrix, and serves cosine top-k queries.

Two kinds of queries are supported:

1. recommend_similar(our_id, k)
   - Items most similar to a single item (used for "Similar properties"
     on property detail pages).

2. recommend_from_viewed(viewed_ids, k)
   - Mean-pool the embeddings of the user's recently viewed properties,
     re-normalize the resulting "taste" vector, then rank.  Items that
     were already viewed are excluded from the output.
"""

from __future__ import annotations

import logging
import threading
from dataclasses import dataclass
from typing import Iterable, Optional

import numpy as np
from sqlalchemy import text
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


@dataclass
class RecommendationIndex:
    ids: np.ndarray  # shape (N,), dtype=object (uuid strings)
    id_to_row: dict[str, int]
    embeddings: np.ndarray  # shape (N, D), float32, L2-normalized

    @property
    def size(self) -> int:
        return int(self.ids.shape[0])


_index: Optional[RecommendationIndex] = None
_lock = threading.Lock()


def _parse_vector_literal(lit: str) -> np.ndarray:
    """
    Parse a pgvector text literal like "[0.1, -0.2, 0.3]" into float32 numpy.
    """
    if not lit:
        return np.zeros(0, dtype=np.float32)
    s = lit.strip()
    if s.startswith("[") and s.endswith("]"):
        s = s[1:-1]
    if not s:
        return np.zeros(0, dtype=np.float32)
    return np.fromstring(s, dtype=np.float32, sep=",")


def _build_index(db: Session) -> RecommendationIndex:
    """Load all embeddings from Supabase and build the in-memory index."""
    logger.info("Building recommendation index ...")

    # Cast embedding to text so we can parse it with numpy without requiring
    # the pgvector SQLAlchemy adapter.
    rows = db.execute(
        text(
            "SELECT our_id::text AS our_id, embedding::text AS embedding "
            "FROM public.property_embeddings"
        )
    ).all()

    if not rows:
        logger.warning("public.property_embeddings is empty; recommendations disabled.")
        return RecommendationIndex(
            ids=np.empty(0, dtype=object),
            id_to_row={},
            embeddings=np.empty((0, 0), dtype=np.float32),
        )

    ids: list[str] = []
    vectors: list[np.ndarray] = []
    for row in rows:
        vec = _parse_vector_literal(row.embedding)
        if vec.size == 0:
            continue
        ids.append(str(row.our_id))
        vectors.append(vec)

    mat = np.stack(vectors, axis=0).astype(np.float32, copy=False)
    norms = np.linalg.norm(mat, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    mat = mat / norms

    ids_arr = np.array(ids, dtype=object)
    id_to_row = {uid: i for i, uid in enumerate(ids)}

    logger.info(
        "Recommendation index ready: %d items x %d dims",
        mat.shape[0],
        mat.shape[1],
    )
    return RecommendationIndex(ids=ids_arr, id_to_row=id_to_row, embeddings=mat)


def get_index(db: Session) -> RecommendationIndex:
    """Return the singleton index, building it on first call."""
    global _index
    if _index is not None:
        return _index
    with _lock:
        if _index is not None:
            return _index
        _index = _build_index(db)
        return _index


def reset_index() -> None:
    """Test / admin hook: force the next call to rebuild the index."""
    global _index
    with _lock:
        _index = None


def _top_k(scores: np.ndarray, k: int, excluded: set[int]) -> list[int]:
    """Return the indices of the `k` largest scores, skipping excluded rows."""
    if excluded:
        scores = scores.copy()
        for i in excluded:
            scores[i] = -np.inf

    # argpartition is O(n); cap k at n
    n = scores.shape[0]
    k = min(k, n)
    if k <= 0:
        return []
    part = np.argpartition(-scores, kth=k - 1)[:k]
    ordered = part[np.argsort(-scores[part])]
    return [int(i) for i in ordered if np.isfinite(scores[i])]


def recommend_similar(db: Session, our_id: str, k: int = 10) -> list[str]:
    index = get_index(db)
    if index.size == 0:
        return []
    row = index.id_to_row.get(our_id)
    if row is None:
        return []
    query = index.embeddings[row]
    scores = index.embeddings @ query  # (N,)
    top_rows = _top_k(scores, k=k, excluded={row})
    return [str(index.ids[i]) for i in top_rows]


def recommend_from_viewed(
    db: Session, viewed_ids: Iterable[str], k: int = 10
) -> list[str]:
    index = get_index(db)
    if index.size == 0:
        return []

    viewed = [vid for vid in viewed_ids if vid in index.id_to_row]
    if not viewed:
        return []

    viewed_rows = [index.id_to_row[v] for v in viewed]
    taste = index.embeddings[viewed_rows].mean(axis=0)
    norm = float(np.linalg.norm(taste))
    if norm == 0:
        return []
    taste = taste / norm

    scores = index.embeddings @ taste
    top_rows = _top_k(scores, k=k, excluded=set(viewed_rows))
    return [str(index.ids[i]) for i in top_rows]
