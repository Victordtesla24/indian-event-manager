# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.banner import Banner  # noqa
from app.models.event import Event  # noqa
from app.models.marketing import MarketingCampaign  # noqa
from app.models.sponsor import Sponsor  # noqa
from app.models.user import User, AdminAuditLog  # noqa
