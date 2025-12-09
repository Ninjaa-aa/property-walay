"""
Shared PPT theme constants for colors and fonts.
"""

from pptx.dml.color import RGBColor

# Brand colors
PRIMARY_COLOR = RGBColor(16, 185, 129)  # #10B981 - Green
SECONDARY_COLOR = RGBColor(59, 130, 246)  # #3B82F6 - Blue
ACCENT_COLOR = RGBColor(245, 158, 11)  # #F59E0B - Amber

# Base palette (dark theme)
TEXT_COLOR = RGBColor(255, 255, 255)  # White on dark
LIGHT_TEXT = RGBColor(156, 163, 175)  # Muted gray
WHITE = RGBColor(255, 255, 255)
DARK_BG = RGBColor(17, 24, 39)  # Primary dark background
CARD_BG = RGBColor(31, 41, 55)  # Card background on dark

# Fonts
TITLE_FONT = "Segoe UI"
BODY_FONT = "Segoe UI"

