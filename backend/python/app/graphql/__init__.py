import os

from flask import current_app
from flask_graphql import GraphQLView

from ..models import db
from ..services.implementations.entity_service import EntityService
from ..services.implementations.story_service import StoryService
from ..services.implementations.user_service import UserService
from .schema import schema
from .service import services


def init_app(app):
    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view(
            "graphql", schema=schema, graphiql=True, context={"session": db.session}
        ),
    )

    services["entity"] = EntityService(current_app.logger)
    services["story"] = StoryService(current_app.logger)
    services["user"] = UserService(current_app.logger)
