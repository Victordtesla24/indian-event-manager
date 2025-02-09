from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SPONSOR = "sponsor"


class AdminLevel(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    MODERATOR = "MODERATOR"


class AdminPermission(str, Enum):
    MANAGE_USERS = "MANAGE_USERS"
    MANAGE_EVENTS = "MANAGE_EVENTS"
    MANAGE_SPONSORS = "MANAGE_SPONSORS"
    MANAGE_CONTENT = "MANAGE_CONTENT"
    VIEW_ANALYTICS = "VIEW_ANALYTICS"
    MANAGE_SETTINGS = "MANAGE_SETTINGS"
    MANAGE_MARKETING = "MANAGE_MARKETING"
