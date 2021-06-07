import os

from flask import current_app
from flask_graphql import GraphQLView

from ..models import db
from ..services.implementations.entity_service import EntityService
from ..services.implementations.user_service import UserService
from .schema import schema
from .service import services
from .middlewares.auth_middleware import CookieMiddleware

class MyCustomGraphQLView(GraphQLView):  

    def dispatch(self, request, *args, **kwargs):
        response = super(MyCustomGraphQLView, self).dispatch(request, *args, **kwargs)
        # Set response cookies defined in middleware
        if response.status_code == 200:
            try:
                response_cookies = getattr(request, CookieMiddleware.MIDDLEWARE_COOKIES)
            except:
                pass
            else:
                for cookie in response_cookies:
                    response.set_cookie(cookie.get('key'), cookie.get('value'), **cookie.get('kwargs'))
        return response