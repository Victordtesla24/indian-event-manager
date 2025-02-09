from enum import Enum


class AdminPermission(str, Enum):
    MANAGE_USERS = "MANAGE_USERS"
    MANAGE_EVENTS = "MANAGE_EVENTS"
    MANAGE_SPONSORS = "MANAGE_SPONSORS"
    MANAGE_CONTENT = "MANAGE_CONTENT"
    VIEW_ANALYTICS = "VIEW_ANALYTICS"
    MANAGE_SETTINGS = "MANAGE_SETTINGS"
    MANAGE_MARKETING = "MANAGE_MARKETING"
