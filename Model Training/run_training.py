#!/usr/bin/env python3
"""
Run the full model training pipeline: process scraper JSON, then train/export embeddings.
No environment variables — pass paths via CLI flags only.
"""

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main() -> None:
    parser = argparse.ArgumentParser(description="PropertyWalay recommender training pipeline")
    parser.add_argument(
        "--scrapers-dir",
        type=Path,
        default=ROOT.parent / "Scrappers",
        help="Scrappers root (default: ../Scrappers)",
    )
    parser.add_argument(
        "--skip-process",
        action="store_true",
        help="Skip data processing (use existing output/property_data_processed.csv)",
    )
    parser.add_argument(
        "--skip-train",
        action="store_true",
        help="Only process data; do not train/export model",
    )
    parser.add_argument(
        "--skip-eval",
        action="store_true",
        help="Skip O(n^2) model evaluation during training",
    )
    parser.add_argument(
        "--max-rows",
        type=int,
        default=-1,
        help="Cap rows loaded for training (positive int). Default: full dataset.",
    )
    args = parser.parse_args()

    csv_path = ROOT / "output" / "property_data_processed.csv"

    if not args.skip_process:
        print("=" * 80)
        print("STEP 1: PROCESS SCRAPER DATA")
        print("=" * 80)
        subprocess.check_call(
            [
                sys.executable,
                str(ROOT / "process_data.py"),
                "--scrapers-dir",
                str(args.scrapers_dir),
            ]
        )

    if args.skip_train:
        return

    if not csv_path.exists():
        print(f"Missing {csv_path}. Run without --skip-process first.")
        sys.exit(1)

    print("\n" + "=" * 80)
    print("STEP 2: TRAIN RECOMMENDER & EXPORT ARTIFACTS")
    print("=" * 80)
    cmd = [
        sys.executable,
        str(ROOT / "train_recommenders.py"),
        "--csv-path",
        str(csv_path),
    ]
    if args.skip_eval:
        cmd.append("--skip-eval")
    if args.max_rows > 0:
        cmd.extend(["--max-rows", str(args.max_rows)])

    subprocess.check_call(cmd)
    print("\n>> Training pipeline finished.")


if __name__ == "__main__":
    main()
