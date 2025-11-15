from sqlalchemy import Column, String, Integer, Numeric, DateTime, Text, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Property(Base):
    __tablename__ = "properties"
    __table_args__ = (
        CheckConstraint(
            "source = ANY(ARRAY['graana'::text, 'lamudi'::text, 'zameen'::text])",
            name="properties_source_check"
        ),
        Index("ux_properties_source_sourceid", "source", "source_id", unique=True),
        Index("idx_properties_updated_at", "updated_at", postgresql_ops={"updated_at": "DESC"}),
        {"schema": "public"}
    )

    our_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid()
    )
    source = Column(Text, nullable=False)
    source_id = Column(Text, nullable=False)
    source_human_id = Column(Text, nullable=True)
    title = Column(Text, nullable=True)
    prop_type = Column(Text, nullable=True)
    prop_subtype = Column(Text, nullable=True)
    area_size = Column(Numeric, nullable=True)
    area_unit = Column(Text, nullable=True)
    beds = Column(Integer, nullable=True)
    baths = Column(Integer, nullable=True)
    area_name = Column(Text, nullable=True)
    link = Column(Text, nullable=True)
    images = Column(JSONB, nullable=True)
    poc_name = Column(Text, nullable=True)
    poc_number = Column(Text, nullable=True)
    latitude = Column(Numeric, nullable=True)
    longitude = Column(Numeric, nullable=True)
    current_price = Column(Numeric, nullable=True)
    currency = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    last_price_change_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Property(our_id={self.our_id}, title={self.title}, source={self.source})>"

