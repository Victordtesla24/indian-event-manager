from typing import Any
from sqlalchemy.orm import DeclarativeBase, declared_attr # type: ignore
from sqlalchemy.orm import Mapped, mapped_column # type: ignore


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models using SQLAlchemy 2.0 style declarations
    """
    id: Mapped[int] = mapped_column(primary_key=True)

    # Generate __tablename__ automatically
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    def __init__(self, **kwargs: Any):
        super().__init__()
        for key, value in kwargs.items():
            setattr(self, key, value)
