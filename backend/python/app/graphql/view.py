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

        # The following mutations MUST request refreshToken
        refresh_token_mutations = ["Refresh", "Login", "SignUp"]
        if (
            "operationName" in data.keys()
            and data["operationName"] in refresh_token_mutations
        ):
            # get refreshToken from response
            response_json = json.loads(response.response[0])["data"]
            mutation_name = data["operationName"].lower()
            refresh_token = response_json[mutation_name]["refreshToken"]

            # set response cookie
            response.set_cookie(
                "refreshToken",
                value=refresh_token,
                httponly=True,
                secure=(os.getenv("FLASK_CONFIG") == "production"),
            )

        return response
