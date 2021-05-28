from ..models import db
from .schema import schema
from ..services.implementations.entity_service import EntityService
from .service import services

from flask_graphql import GraphQLView
from flask import current_app

def init_app(app):
    app.add_url_rule(
        "/graphql", view_func=GraphQLView.as_view(
            "graphql", schema=schema, graphiql=True,
            context= {"session": db.session})
    )

    services["entity"] = EntityService(current_app.logger)
