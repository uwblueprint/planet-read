import json

from flask_graphql import GraphQLView


class ResponseCookieGraphQLView(GraphQLView):
    """
    Sets response cookie for refresh mutation requests
    """

    def dispatch_request(self):
        response = super(ResponseCookieGraphQLView, self).dispatch_request()
        data = self.parse_body()

        # refresh mutation response is returned from dipatch
        if "operationName" in data.keys() and "refresh" in data["query"]:
            # refresh mutation must be called for both refreshToken and accessToken
            # fetch refreshToken from response
            refresh_token = json.loads(response.response[0])["data"]["refresh"][
                "refreshToken"
            ]
            # set response cookie
            # custom gqlview is the only place to modify response data
            response.set_cookie("refreshToken", refresh_token)

        return response
