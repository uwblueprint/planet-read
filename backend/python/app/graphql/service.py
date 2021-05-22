'''
..services.implementations can only be leveraged once the 
flask app has started. Create dummy services here that will be
updated with live app loggers during __init__.py
'''
from ..services.implementations.entity_service import EntityService
from ..services.implementations.user_service import UserService

services = {
    "entity": EntityService(),
    "user": UserService(),
}