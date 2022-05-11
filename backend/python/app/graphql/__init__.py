import os

from flask import current_app

from ..models import db
from ..services.implementations.auth_service import AuthService
from ..services.implementations.comment_service import CommentService
from ..services.implementations.email_service import EmailService
from ..services.implementations.file_service import FileService
from ..services.implementations.story_service import StoryService
from ..services.implementations.user_service import UserService
from .schema import schema
from .service import services
from .view import ResponseCookieGraphQLView


def init_app(app):
    app.add_url_rule(
        "/graphql",
        view_func=ResponseCookieGraphQLView.as_view(
            "graphql",
            schema=schema,
            graphiql=os.getenv("FLASK_CONFIG") == "development",
            context={"session": db.session},
        ),
    )

    services["comment"] = CommentService(current_app.logger)
    services["file"] = FileService(current_app.logger)
    services["story"] = StoryService(current_app.logger)
    services["user"] = UserService(current_app.logger)

    email_service = EmailService(
        current_app.logger,
        {
            "refresh_token": os.getenv("EMAIL_REFRESH_TOKEN"),
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_id": os.getenv("EMAIL_CLIENT_ID"),
            "client_secret": os.getenv("EMAIL_CLIENT_SECRET"),
        },
        os.getenv("EMAIL_USER"),
        "Add My Language",
    )
    services["auth"] = AuthService(current_app.logger, services["user"], email_service)
