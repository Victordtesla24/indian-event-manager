from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase, Mapped
from sqlalchemy import Integer
from sqlalchemy.orm import mapped_column


class CustomBase:
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


class Base(DeclarativeBase, CustomBase):
    """Base class for all database models."""
