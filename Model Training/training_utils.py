"""Shared paths for the model training pipeline (no environment variables)."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent
DEFAULT_SCRAPERS_DIR = ROOT.parent / "Scrappers"
DEFAULT_OUTPUT_DIR = ROOT / "output"
DEFAULT_ARTIFACTS_DIR = DEFAULT_OUTPUT_DIR / "artifacts"
DEFAULT_CSV = DEFAULT_OUTPUT_DIR / "property_data_processed.csv"

SOURCES = ("Graana", "Lamudi", "Zameen")


def source_data_dirs(scrapers_dir: Path) -> dict[str, Path]:
    return {name: scrapers_dir / name / "Data" for name in SOURCES}


def ensure_output_dirs() -> None:
    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    DEFAULT_ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
