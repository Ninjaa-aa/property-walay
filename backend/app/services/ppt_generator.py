"""
PPT Generator Service
Generates professional PowerPoint presentations for properties using python-pptx
"""
import io
import time
import logging
from typing import Optional, List, Any
from datetime import datetime
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RgbColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from PIL import Image
import httpx

logger = logging.getLogger(__name__)

# Template path (relative to this file)
TEMPLATE_DIR = Path(__file__).parent.parent / "templates"


class PropertyPPTGenerator:
    """
    Generates professional PowerPoint presentations for properties.
    Uses template-based approach for consistent branding.
    """
    
    # Slide dimensions (16:9 widescreen)
    SLIDE_WIDTH = Inches(13.333)
    SLIDE_HEIGHT = Inches(7.5)
    
    # Brand colors
    PRIMARY_COLOR = RgbColor(16, 185, 129)  # #10B981 - Green
    SECONDARY_COLOR = RgbColor(59, 130, 246)  # #3B82F6 - Blue
    ACCENT_COLOR = RgbColor(245, 158, 11)  # #F59E0B - Amber
    TEXT_COLOR = RgbColor(17, 24, 39)  # #111827 - Dark
    LIGHT_TEXT = RgbColor(107, 114, 128)  # #6B7280 - Gray
    WHITE = RgbColor(255, 255, 255)
    
    # Fonts
    TITLE_FONT = "Segoe UI"
    BODY_FONT = "Segoe UI"
    
    def __init__(self):
        """Initialize the PPT generator"""
        self.prs: Optional[Presentation] = None
        
    def generate(self, property_data: dict, images: List[bytes] = None) -> io.BytesIO:
        """
        Generate a complete PPT presentation for a property.
        
        Args:
            property_data: Dictionary containing property details
            images: List of image bytes (already optimized)
            
        Returns:
            BytesIO object containing the PPTX file
        """
        start_time = time.time()
        
        # Create new presentation (16:9 widescreen)
        self.prs = Presentation()
        self.prs.slide_width = self.SLIDE_WIDTH
        self.prs.slide_height = self.SLIDE_HEIGHT
        
        # Generate slides
        self._create_title_slide(property_data, images[0] if images else None)
        self._create_overview_slide(property_data)
        self._create_details_slide(property_data)
        
        if images and len(images) > 1:
            self._create_gallery_slide(images[1:5])  # Max 4 gallery images
            
        if property_data.get("latitude") and property_data.get("longitude"):
            self._create_location_slide(property_data)
            
        self._create_contact_slide(property_data)
        
        # Save to BytesIO
        output = io.BytesIO()
        self.prs.save(output)
        output.seek(0)
        
        duration_ms = int((time.time() - start_time) * 1000)
        logger.info(f"PPT generated in {duration_ms}ms for property {property_data.get('our_id')}")
        
        return output
    
    def _add_shape_with_text(
        self,
        slide,
        left: float,
        top: float,
        width: float,
        height: float,
        text: str,
        font_size: int = 14,
        font_color: RgbColor = None,
        bold: bool = False,
        alignment: PP_ALIGN = PP_ALIGN.LEFT,
        fill_color: RgbColor = None,
    ):
        """Helper to add a text box with styling"""
        shape = slide.shapes.add_textbox(
            Inches(left), Inches(top), Inches(width), Inches(height)
        )
        tf = shape.text_frame
        tf.word_wrap = True
        tf.auto_size = None
        
        p = tf.paragraphs[0]
        p.text = text
        p.font.size = Pt(font_size)
        p.font.name = self.BODY_FONT
        p.font.bold = bold
        p.font.color.rgb = font_color or self.TEXT_COLOR
        p.alignment = alignment
        
        if fill_color:
            shape.fill.solid()
            shape.fill.fore_color.rgb = fill_color
            
        return shape
    
    def _add_rounded_rectangle(
        self,
        slide,
        left: float,
        top: float,
        width: float,
        height: float,
        fill_color: RgbColor,
        text: str = None,
        font_size: int = 12,
        font_color: RgbColor = None,
    ):
        """Add a rounded rectangle shape"""
        shape = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(left), Inches(top), Inches(width), Inches(height)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
        shape.line.fill.background()  # No border
        
        if text:
            tf = shape.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = text
            p.font.size = Pt(font_size)
            p.font.name = self.BODY_FONT
            p.font.color.rgb = font_color or self.WHITE
            p.alignment = PP_ALIGN.CENTER
            tf.anchor = MSO_ANCHOR.MIDDLE
            
        return shape
    
    def _create_title_slide(self, property_data: dict, hero_image: bytes = None):
        """Create the title/cover slide"""
        slide_layout = self.prs.slide_layouts[6]  # Blank layout
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Background gradient (simulated with shape)
        bg_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, 0, 0, self.SLIDE_WIDTH, self.SLIDE_HEIGHT
        )
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = RgbColor(17, 24, 39)  # Dark background
        bg_shape.line.fill.background()
        
        # Hero image (if available)
        if hero_image:
            try:
                img_stream = io.BytesIO(hero_image)
                # Add image on the right side
                slide.shapes.add_picture(
                    img_stream, Inches(6.5), Inches(0.5),
                    width=Inches(6.5), height=Inches(6.5)
                )
            except Exception as e:
                logger.warning(f"Failed to add hero image: {e}")
        
        # Property title
        title = property_data.get("title", "Property Presentation")
        self._add_shape_with_text(
            slide, 0.5, 2, 5.5, 1.5,
            title,
            font_size=32, font_color=self.WHITE, bold=True
        )
        
        # Location
        location = property_data.get("area_name", "")
        if location:
            self._add_shape_with_text(
                slide, 0.5, 3.5, 5.5, 0.5,
                f"📍 {location}",
                font_size=18, font_color=self.PRIMARY_COLOR
            )
        
        # Price
        price = property_data.get("current_price")
        currency = property_data.get("currency", "PKR")
        if price:
            formatted_price = self._format_price(price, currency)
            self._add_rounded_rectangle(
                slide, 0.5, 4.3, 2.5, 0.6,
                self.PRIMARY_COLOR,
                formatted_price,
                font_size=20, font_color=self.WHITE
            )
        
        # PropertyWalay branding
        self._add_shape_with_text(
            slide, 0.5, 6.5, 3, 0.4,
            "PropertyWalay - AI-Powered Real Estate",
            font_size=10, font_color=self.LIGHT_TEXT
        )
        
        # Date
        self._add_shape_with_text(
            slide, 10, 6.8, 3, 0.3,
            datetime.now().strftime("%B %d, %Y"),
            font_size=10, font_color=self.LIGHT_TEXT,
            alignment=PP_ALIGN.RIGHT
        )
    
    def _create_overview_slide(self, property_data: dict):
        """Create property overview slide with key stats"""
        slide_layout = self.prs.slide_layouts[6]  # Blank
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        self._add_shape_with_text(
            slide, 0.5, 0.3, 12, 0.8,
            "Property Overview",
            font_size=28, bold=True, font_color=self.TEXT_COLOR
        )
        
        # Horizontal line
        line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(1), Inches(12.3), Inches(0.02)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = self.PRIMARY_COLOR
        line.line.fill.background()
        
        # Key stats boxes
        stats = self._get_property_stats(property_data)
        box_width = 2.8
        box_height = 1.5
        start_x = 0.5
        gap = 0.3
        
        for i, (label, value, icon) in enumerate(stats[:4]):
            x = start_x + i * (box_width + gap)
            
            # Stat box
            box = self._add_rounded_rectangle(
                slide, x, 1.5, box_width, box_height,
                RgbColor(249, 250, 251)  # Light gray background
            )
            
            # Icon and value
            self._add_shape_with_text(
                slide, x + 0.2, 1.7, box_width - 0.4, 0.5,
                f"{icon} {value}",
                font_size=20, bold=True, font_color=self.TEXT_COLOR
            )
            
            # Label
            self._add_shape_with_text(
                slide, x + 0.2, 2.3, box_width - 0.4, 0.4,
                label,
                font_size=12, font_color=self.LIGHT_TEXT
            )
        
        # Property description
        self._add_shape_with_text(
            slide, 0.5, 3.5, 12.3, 0.5,
            "Description",
            font_size=18, bold=True, font_color=self.TEXT_COLOR
        )
        
        description = self._generate_description(property_data)
        self._add_shape_with_text(
            slide, 0.5, 4.1, 12.3, 2.5,
            description,
            font_size=14, font_color=self.LIGHT_TEXT
        )
    
    def _create_details_slide(self, property_data: dict):
        """Create detailed property information slide"""
        slide_layout = self.prs.slide_layouts[6]
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        self._add_shape_with_text(
            slide, 0.5, 0.3, 12, 0.8,
            "Property Details",
            font_size=28, bold=True, font_color=self.TEXT_COLOR
        )
        
        # Horizontal line
        line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(1), Inches(12.3), Inches(0.02)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = self.PRIMARY_COLOR
        line.line.fill.background()
        
        # Two columns of details
        details_left = [
            ("Property Type", property_data.get("prop_type", "N/A")),
            ("Subtype", property_data.get("prop_subtype", "N/A")),
            ("Bedrooms", str(property_data.get("beds", "N/A"))),
            ("Bathrooms", str(property_data.get("baths", "N/A"))),
        ]
        
        area_size = property_data.get("area_size")
        area_unit = property_data.get("area_unit", "")
        area_display = f"{area_size} {area_unit}" if area_size else "N/A"
        
        price = property_data.get("current_price")
        currency = property_data.get("currency", "PKR")
        price_display = self._format_price(price, currency) if price else "N/A"
        
        details_right = [
            ("Area Size", area_display),
            ("Price", price_display),
            ("Source", property_data.get("source", "N/A").capitalize()),
            ("Property ID", property_data.get("source_human_id") or str(property_data.get("our_id", ""))[:8]),
        ]
        
        # Left column
        y = 1.5
        for label, value in details_left:
            self._add_shape_with_text(
                slide, 0.5, y, 2.5, 0.4,
                label,
                font_size=12, font_color=self.LIGHT_TEXT
            )
            self._add_shape_with_text(
                slide, 3.2, y, 3, 0.4,
                str(value),
                font_size=14, bold=True, font_color=self.TEXT_COLOR
            )
            y += 0.7
        
        # Right column
        y = 1.5
        for label, value in details_right:
            self._add_shape_with_text(
                slide, 7, y, 2.5, 0.4,
                label,
                font_size=12, font_color=self.LIGHT_TEXT
            )
            self._add_shape_with_text(
                slide, 9.7, y, 3, 0.4,
                str(value),
                font_size=14, bold=True, font_color=self.TEXT_COLOR
            )
            y += 0.7
        
        # Price per unit (if applicable)
        if price and area_size:
            price_per_unit = price / area_size
            self._add_shape_with_text(
                slide, 0.5, 5, 6, 0.5,
                f"Price per {area_unit}: {self._format_price(price_per_unit, currency)}",
                font_size=14, font_color=self.PRIMARY_COLOR
            )
    
    def _create_gallery_slide(self, images: List[bytes]):
        """Create image gallery slide"""
        slide_layout = self.prs.slide_layouts[6]
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        self._add_shape_with_text(
            slide, 0.5, 0.3, 12, 0.8,
            "Property Gallery",
            font_size=28, bold=True, font_color=self.TEXT_COLOR
        )
        
        # Grid of images (2x2)
        positions = [
            (0.5, 1.2, 6, 3),
            (6.8, 1.2, 6, 3),
            (0.5, 4.4, 6, 3),
            (6.8, 4.4, 6, 3),
        ]
        
        for i, img_bytes in enumerate(images[:4]):
            if i >= len(positions):
                break
            try:
                left, top, width, height = positions[i]
                img_stream = io.BytesIO(img_bytes)
                slide.shapes.add_picture(
                    img_stream,
                    Inches(left), Inches(top),
                    width=Inches(width), height=Inches(height)
                )
            except Exception as e:
                logger.warning(f"Failed to add gallery image {i}: {e}")
    
    def _create_location_slide(self, property_data: dict):
        """Create location slide with map placeholder"""
        slide_layout = self.prs.slide_layouts[6]
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Title
        self._add_shape_with_text(
            slide, 0.5, 0.3, 12, 0.8,
            "Location",
            font_size=28, bold=True, font_color=self.TEXT_COLOR
        )
        
        # Location details
        location = property_data.get("area_name", "Location not specified")
        self._add_shape_with_text(
            slide, 0.5, 1.2, 12, 0.5,
            f"📍 {location}",
            font_size=18, font_color=self.PRIMARY_COLOR
        )
        
        # Map placeholder
        map_placeholder = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            Inches(0.5), Inches(2), Inches(12.3), Inches(5)
        )
        map_placeholder.fill.solid()
        map_placeholder.fill.fore_color.rgb = RgbColor(229, 231, 235)  # Gray
        map_placeholder.line.color.rgb = RgbColor(209, 213, 219)
        
        # Coordinates text
        lat = property_data.get("latitude")
        lng = property_data.get("longitude")
        if lat and lng:
            self._add_shape_with_text(
                slide, 5, 4, 4, 1,
                f"Coordinates:\n{lat:.6f}, {lng:.6f}\n\nView on Google Maps",
                font_size=14, font_color=self.LIGHT_TEXT,
                alignment=PP_ALIGN.CENTER
            )
    
    def _create_contact_slide(self, property_data: dict):
        """Create contact/CTA slide"""
        slide_layout = self.prs.slide_layouts[6]
        slide = self.prs.slides.add_slide(slide_layout)
        
        # Background
        bg_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, 0, 0, self.SLIDE_WIDTH, self.SLIDE_HEIGHT
        )
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = RgbColor(17, 24, 39)
        bg_shape.line.fill.background()
        
        # Title
        self._add_shape_with_text(
            slide, 0.5, 1.5, 12.3, 1,
            "Interested in this property?",
            font_size=36, bold=True, font_color=self.WHITE,
            alignment=PP_ALIGN.CENTER
        )
        
        # Contact info
        poc_name = property_data.get("poc_name", "Contact Agent")
        poc_number = property_data.get("poc_number", "")
        
        self._add_shape_with_text(
            slide, 0.5, 3, 12.3, 0.6,
            f"Agent: {poc_name}",
            font_size=20, font_color=self.WHITE,
            alignment=PP_ALIGN.CENTER
        )
        
        if poc_number:
            self._add_shape_with_text(
                slide, 0.5, 3.7, 12.3, 0.6,
                f"📞 {poc_number}",
                font_size=18, font_color=self.PRIMARY_COLOR,
                alignment=PP_ALIGN.CENTER
            )
        
        # CTA Button
        self._add_rounded_rectangle(
            slide, 4.5, 5, 4.3, 0.8,
            self.PRIMARY_COLOR,
            "Schedule a Visit",
            font_size=18, font_color=self.WHITE
        )
        
        # Footer
        self._add_shape_with_text(
            slide, 0.5, 6.8, 12.3, 0.4,
            "Generated by PropertyWalay - Your AI-Powered Real Estate Assistant",
            font_size=10, font_color=self.LIGHT_TEXT,
            alignment=PP_ALIGN.CENTER
        )
    
    def _get_property_stats(self, property_data: dict) -> List[tuple]:
        """Get key property stats for overview"""
        stats = []
        
        # Bedrooms
        beds = property_data.get("beds")
        if beds is not None:
            stats.append(("Bedrooms", str(beds), "🛏️"))
        
        # Bathrooms
        baths = property_data.get("baths")
        if baths is not None:
            stats.append(("Bathrooms", str(baths), "🚿"))
        
        # Area
        area_size = property_data.get("area_size")
        area_unit = property_data.get("area_unit", "")
        if area_size:
            stats.append(("Area", f"{area_size} {area_unit}", "📐"))
        
        # Property Type
        prop_type = property_data.get("prop_type")
        if prop_type:
            stats.append(("Type", prop_type.capitalize(), "🏠"))
        
        # Ensure we have at least 4 stats
        while len(stats) < 4:
            stats.append(("", "-", ""))
            
        return stats[:4]
    
    def _generate_description(self, property_data: dict) -> str:
        """Generate a property description"""
        parts = []
        
        prop_type = property_data.get("prop_type", "property")
        prop_subtype = property_data.get("prop_subtype", "")
        beds = property_data.get("beds")
        baths = property_data.get("baths")
        area_size = property_data.get("area_size")
        area_unit = property_data.get("area_unit", "")
        location = property_data.get("area_name", "")
        
        # Build description
        type_str = f"{prop_subtype} {prop_type}" if prop_subtype else prop_type
        parts.append(f"This {type_str.lower()}")
        
        if beds and baths:
            parts.append(f"features {beds} bedroom(s) and {baths} bathroom(s)")
        elif beds:
            parts.append(f"features {beds} bedroom(s)")
        
        if area_size:
            parts.append(f"with a total area of {area_size} {area_unit}")
        
        if location:
            parts.append(f"located in {location}")
        
        description = " ".join(parts) + "."
        
        # Add source info
        source = property_data.get("source", "")
        if source:
            description += f" Listed on {source.capitalize()}."
        
        return description
    
    def _format_price(self, price: float, currency: str = "PKR") -> str:
        """Format price with currency"""
        if price >= 10000000:  # 1 Crore
            return f"{currency} {price / 10000000:.2f} Cr"
        elif price >= 100000:  # 1 Lac
            return f"{currency} {price / 100000:.2f} Lac"
        else:
            return f"{currency} {price:,.0f}"


class ImageOptimizer:
    """Handles image downloading and optimization for PPT"""
    
    MAX_WIDTH = 1920
    QUALITY = 85
    TIMEOUT = 10
    
    @staticmethod
    async def fetch_and_optimize(url: str) -> Optional[bytes]:
        """
        Download and optimize an image from URL.
        
        Args:
            url: Image URL to download
            
        Returns:
            Optimized image bytes or None if failed
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=ImageOptimizer.TIMEOUT)
                response.raise_for_status()
                
            # Open and optimize
            img = Image.open(io.BytesIO(response.content))
            
            # Resize if too large
            if img.width > ImageOptimizer.MAX_WIDTH:
                ratio = ImageOptimizer.MAX_WIDTH / img.width
                new_size = (ImageOptimizer.MAX_WIDTH, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Convert to RGB if needed
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background for transparency
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save optimized
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=ImageOptimizer.QUALITY, optimize=True)
            output.seek(0)
            
            return output.getvalue()
            
        except Exception as e:
            logger.warning(f"Failed to fetch/optimize image {url}: {e}")
            return None
    
    @staticmethod
    async def fetch_multiple(urls: List[str], max_images: int = 5) -> List[bytes]:
        """
        Fetch and optimize multiple images concurrently.
        
        Args:
            urls: List of image URLs
            max_images: Maximum number of images to fetch
            
        Returns:
            List of optimized image bytes
        """
        import asyncio
        
        urls = urls[:max_images]
        tasks = [ImageOptimizer.fetch_and_optimize(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out None and exceptions
        return [r for r in results if isinstance(r, bytes)]

