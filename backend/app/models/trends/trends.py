"""
SQLAlchemy models for Property Trends data.
Normalized schema for real estate market trends across Pakistan.
"""

from sqlalchemy import (
    Column,
    String,
    Integer,
    BigInteger,
    Numeric,
    DateTime,
    Text,
    Date,
    CheckConstraint,
    Index,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database.database import Base


class TrendsRegion(Base):
    """
    Geographic regions/provinces (Level 2 hierarchy).
    Examples: Punjab, Sindh, KPK, Balochistan, Gilgit Baltistan, Azad Kashmir
    """
    __tablename__ = "trends_regions"
    __table_args__ = (
        Index("idx_trends_regions_name", "name"),
        {"schema": "public"}
    )

    id = Column(Integer, primary_key=True)  # Original ID from source
    name = Column(Text, nullable=False, unique=True)
    name_urdu = Column(Text, nullable=True)
    level = Column(Integer, default=2)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    cities = relationship("TrendsCity", back_populates="region", cascade="all, delete-orphan")


class TrendsCity(Base):
    """
    Cities within regions (Level 3 hierarchy).
    Examples: Lahore, Karachi, Islamabad, Abbottabad
    """
    __tablename__ = "trends_cities"
    __table_args__ = (
        UniqueConstraint("name", "region_id", name="uq_trends_cities_name_region"),
        Index("idx_trends_cities_region", "region_id"),
        Index("idx_trends_cities_name", "name"),
        {"schema": "public"}
    )

    id = Column(Integer, primary_key=True)  # city_number from source
    name = Column(Text, nullable=False)
    name_urdu = Column(Text, nullable=True)
    region_id = Column(Integer, ForeignKey("public.trends_regions.id", ondelete="CASCADE"))
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    level = Column(Integer, default=3)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    region = relationship("TrendsRegion", back_populates="cities")
    locations = relationship("TrendsLocation", back_populates="city", cascade="all, delete-orphan")
    position_rankings = relationship("TrendsPositionRanking", back_populates="city", cascade="all, delete-orphan")


class TrendsLocation(Base):
    """
    Specific locations/neighborhoods within cities.
    Examples: DHA Defence, Gulberg, Model Town
    """
    __tablename__ = "trends_locations"
    __table_args__ = (
        Index("idx_trends_locations_city", "city_id"),
        Index("idx_trends_locations_title", "title"),
        {"schema": "public"}
    )

    id = Column(Integer, primary_key=True)  # location_id from source
    title = Column(Text, nullable=False)
    title_urdu = Column(Text, nullable=True)
    city_id = Column(Integer, ForeignKey("public.trends_cities.id", ondelete="CASCADE"))
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    city = relationship("TrendsCity", back_populates="locations")
    monthly_stats = relationship("TrendsMonthlyStats", back_populates="location", cascade="all, delete-orphan")
    position_rankings = relationship("TrendsPositionRanking", back_populates="location", cascade="all, delete-orphan")


class TrendsMonthlyStats(Base):
    """
    Monthly view counts and search percentages per location and category.
    Time-series data for trend analysis.
    """
    __tablename__ = "trends_monthly_stats"
    __table_args__ = (
        CheckConstraint("category IN ('buying', 'renting')", name="chk_monthly_stats_category"),
        UniqueConstraint("location_id", "category", "stats_date", name="uq_monthly_stats_loc_cat_date"),
        Index("idx_trends_monthly_stats_location", "location_id"),
        Index("idx_trends_monthly_stats_category", "category"),
        Index("idx_trends_monthly_stats_date", "stats_date"),
        Index("idx_trends_monthly_stats_loc_cat_date", "location_id", "category", "stats_date"),
        {"schema": "public"}
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    location_id = Column(Integer, ForeignKey("public.trends_locations.id", ondelete="CASCADE"))
    category = Column(Text, nullable=False)  # 'buying' or 'renting'
    stats_date = Column(Date, nullable=False)
    month_year = Column(Text, nullable=True)  # "Jan 2025", "Feb 2025", etc.
    view_count = Column(Integer, default=0)
    search_percentage = Column(Numeric(6, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    location = relationship("TrendsLocation", back_populates="monthly_stats")


class TrendsPositionRanking(Base):
    """
    Position rankings of locations within cities per category and month.
    Tracks ranking changes over time.
    """
    __tablename__ = "trends_position_rankings"
    __table_args__ = (
        CheckConstraint("category IN ('buying', 'renting')", name="chk_rankings_category"),
        UniqueConstraint(
            "location_id", "city_id", "category", "stats_date", "current_position",
            name="uq_rankings_loc_city_cat_date_pos"
        ),
        Index("idx_trends_rankings_location", "location_id"),
        Index("idx_trends_rankings_city", "city_id"),
        Index("idx_trends_rankings_category", "category"),
        Index("idx_trends_rankings_date", "stats_date"),
        Index("idx_trends_rankings_city_cat_date", "city_id", "category", "stats_date"),
        {"schema": "public"}
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    location_id = Column(Integer, ForeignKey("public.trends_locations.id", ondelete="CASCADE"))
    city_id = Column(Integer, ForeignKey("public.trends_cities.id", ondelete="CASCADE"))
    category = Column(Text, nullable=False)  # 'buying' or 'renting'
    stats_date = Column(Date, nullable=False)
    current_position = Column(Integer, nullable=True)
    previous_position = Column(Integer, nullable=True)
    position_change = Column(Integer, nullable=True)
    current_search_percentage = Column(Numeric(6, 2), nullable=True)
    previous_search_percentage = Column(Numeric(6, 2), nullable=True)
    search_percentage_change = Column(Numeric(6, 2), nullable=True)
    current_view_count = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    location = relationship("TrendsLocation", back_populates="position_rankings")
    city = relationship("TrendsCity", back_populates="position_rankings")


class TrendsMetadata(Base):
    """
    Metadata for trends data imports.
    Stores last import timestamp, data version, etc.
    """
    __tablename__ = "trends_metadata"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(Text, unique=True, nullable=False)
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

