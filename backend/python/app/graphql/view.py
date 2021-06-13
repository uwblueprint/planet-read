import json
import os

from flask_graphql import GraphQLView
from graphene.types import mutation


class ResponseCookieGraphQLView(GraphQLView):
    """
    Sets response cookie for refresh mutation requests
    """

    def dispatch_request(self):
        response = super(ResponseCookieGraphQLView, self).dispatch_request()
        data = self.parse_body()
        # refresh or  login mutation response is returned from dipatch
        if "operationName" in data.keys() and (
            "refresh" in data["query"] or "login" in data["query"]
        ):
            # mutation must be called for both refreshToken and accessToken
            # get refreshToken from response
            response_json = json.loads(response.response[0])["data"]
            mutation_name = "refresh" if "refresh" in response_json.keys() else "login"
            refresh_token = response_json[mutation_name]["refreshToken"]

            # set response cookie
            response.set_cookie(
                "refreshToken",
                value=refresh_token,
                httponly=True,
                secure=(os.getenv("FLASK_CONFIG") == "production"),
            )

        return response
