"""
PPT Visual Templates
Defines dataclass-based templates that control the visual appearance
of generated property presentations.  Each template specifies colors,
fonts, and per-slide layout parameters so the generator can render the
same data with completely different aesthetics.
"""

from dataclasses import dataclass, field
from pptx.dml.color import RGBColor


@dataclass(frozen=True)
class PPTTemplate:
    """All visual parameters needed to render a property PPT."""

    # Identity
    name: str

    # ── Palette ──────────────────────────────────────────────────
    slide_bg: RGBColor        # Full-slide background
    accent: RGBColor          # Headings, dividers, metric numbers
    body_text: RGBColor       # Primary body text
    muted_text: RGBColor      # Secondary / label text
    card_bg: RGBColor         # Metric-card / section-card fill
    white: RGBColor = field(default_factory=lambda: RGBColor(255, 255, 255))

    # ── Fonts ────────────────────────────────────────────────────
    font_name: str = "Arial"
    fallback_font: str = "Arial"

    # ── Title-slide layout ───────────────────────────────────────
    #   hero_* describes the hero-image rectangle (inches)
    #   text_panel_* describes the text-panel rectangle
    title_hero_left: float = 0.0
    title_hero_top: float = 0.0
    title_hero_width: float = 8.67   # ~65 % of 13.333
    title_hero_height: float = 7.5
    title_panel_left: float = 8.67
    title_panel_top: float = 0.0
    title_panel_width: float = 4.663
    title_panel_height: float = 7.5
    title_panel_color: RGBColor = None  # defaults to slide_bg if None
    title_text_left: float = 9.0
    title_text_top: float = 0.8
    title_text_width: float = 4.0

    # Title-slide text sizing & absolute Y positions for sub-elements
    title_font_size: int = 22          # pt — kept small enough for long titles
    title_text_height: float = 3.5     # inches — must fit wrapped title comfortably
    title_loc_top: float = 4.5         # absolute Y for the 📍 location row
    title_price_top: float = 5.3       # absolute Y for the price badge

    # ── Metric-card styling (overview slide) ─────────────────────
    card_border_color: RGBColor = None   # None → no border
    card_border_width_pt: float = 0.0    # In points
    card_left_border: bool = False       # Blue left-border style
    card_top_border: bool = False        # Teal top-border style
    card_number_color: RGBColor = None   # Defaults to accent
    card_label_color: RGBColor = None    # Defaults to muted_text

    # ── Section-heading style ────────────────────────────────────
    heading_uppercase: bool = False

    # ── Location slide accent ────────────────────────────────────
    #   Optional accent line at the top of the title slide
    title_accent_line: bool = False
    title_accent_line_height_pt: float = 4.0

    def __post_init__(self):
        # Wire up defaults that depend on other fields.
        # frozen=True means we must use object.__setattr__.
        if self.title_panel_color is None:
            object.__setattr__(self, "title_panel_color", self.slide_bg)
        if self.card_number_color is None:
            object.__setattr__(self, "card_number_color", self.accent)
        if self.card_label_color is None:
            object.__setattr__(self, "card_label_color", self.muted_text)


# ── Template 1 — Dark Luxury ────────────────────────────────────
DARK_LUXURY = PPTTemplate(
    name="Dark Luxury",
    slide_bg=RGBColor(0x0D, 0x0D, 0x0D),
    accent=RGBColor(0xD4, 0xAF, 0x37),
    body_text=RGBColor(0xEE, 0xEE, 0xEE),
    muted_text=RGBColor(0x99, 0x99, 0x99),
    card_bg=RGBColor(0x1A, 0x1A, 0x1A),
    font_name="Montserrat",
    fallback_font="Arial",
    # Title slide: hero left 65 %, text panel right 35 %
    title_hero_left=0.0,
    title_hero_top=0.0,
    title_hero_width=8.67,
    title_hero_height=7.5,
    title_panel_left=8.67,
    title_panel_top=0.0,
    title_panel_width=4.663,
    title_panel_height=7.5,
    title_panel_color=RGBColor(0x0D, 0x0D, 0x0D),
    title_text_left=9.0,
    title_text_top=0.8,
    title_text_width=4.0,
    title_font_size=22,
    title_text_height=3.5,
    title_loc_top=4.5,
    title_price_top=5.3,
    # Cards
    card_border_color=RGBColor(0xD4, 0xAF, 0x37),
    card_border_width_pt=1.0,
    # Headings
    heading_uppercase=True,
)

# ── Template 2 — Clean Minimal ──────────────────────────────────
CLEAN_MINIMAL = PPTTemplate(
    name="Clean Minimal",
    slide_bg=RGBColor(0xFF, 0xFF, 0xFF),
    accent=RGBColor(0x18, 0x5F, 0xA5),
    body_text=RGBColor(0x1A, 0x1A, 0x1A),
    muted_text=RGBColor(0x66, 0x66, 0x66),
    card_bg=RGBColor(0xE6, 0xF1, 0xFB),
    font_name="Inter",
    fallback_font="Calibri",
    # Title slide: hero top 55 %, white panel bottom 45 %
    title_hero_left=0.0,
    title_hero_top=0.0,
    title_hero_width=13.333,
    title_hero_height=4.125,   # 55 % of 7.5
    title_panel_left=0.0,
    title_panel_top=4.125,
    title_panel_width=13.333,
    title_panel_height=3.375,  # 45 %
    title_panel_color=RGBColor(0xFF, 0xFF, 0xFF),
    title_text_left=0.5,
    title_text_top=4.35,
    title_text_width=12.0,   # wide — uses the full bottom panel so title wraps less
    title_font_size=20,
    title_text_height=1.4,
    title_loc_top=5.95,
    title_price_top=6.55,
    # Cards
    card_left_border=True,
    card_border_color=RGBColor(0x18, 0x5F, 0xA5),
    card_border_width_pt=3.0,
    # Headings
    heading_uppercase=False,
)

# ── Template 3 — Modern Gradient ────────────────────────────────
MODERN_GRADIENT = PPTTemplate(
    name="Modern Gradient",
    slide_bg=RGBColor(0x0A, 0x1A, 0x3A),
    accent=RGBColor(0x1D, 0x9E, 0x75),
    body_text=RGBColor(0xF0, 0xF0, 0xF0),
    muted_text=RGBColor(0x8A, 0xAB, 0xB0),
    card_bg=RGBColor(0x0F, 0x21, 0x40),
    font_name="Poppins",
    fallback_font="Trebuchet MS",
    # Title slide: hero right 60 %, navy panel left 40 %
    title_hero_left=5.333,         # 40 % offset
    title_hero_top=0.0,
    title_hero_width=7.999,        # 60 %
    title_hero_height=7.5,
    title_panel_left=0.0,
    title_panel_top=0.0,
    title_panel_width=5.333,
    title_panel_height=7.5,
    title_panel_color=RGBColor(0x0A, 0x1A, 0x3A),
    title_text_left=0.5,
    title_text_top=1.0,
    title_text_width=4.5,
    title_font_size=18,       # small — narrow 5.3" panel wraps fast at large sizes
    title_text_height=3.8,
    title_loc_top=5.0,
    title_price_top=5.8,
    # Cards
    card_top_border=True,
    card_border_color=RGBColor(0x1D, 0x9E, 0x75),
    card_border_width_pt=3.0,
    # Accent line on title slide
    title_accent_line=True,
    title_accent_line_height_pt=4.0,
    # Headings
    heading_uppercase=False,
)

# ── All templates ────────────────────────────────────────────────
TEMPLATES: list[PPTTemplate] = [DARK_LUXURY, CLEAN_MINIMAL, MODERN_GRADIENT]
