"""
..services.implementations can only be leveraged once the 
flask app has started. Create dummy services here that will be
updated with live app loggers during __init__.py
"""
from ..services.implementations.comment_service import CommentService
from ..services.implementations.language_service import LanguageService
from ..services.implementations.story_service import StoryService
from ..services.implementations.user_service import UserService

services = {
    "comment": CommentService(),
    "language": LanguageService(),
    "story": StoryService(),
    "user": UserService(),
}
