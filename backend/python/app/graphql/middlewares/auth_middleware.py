# class RefreshTokenMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         response = self.get_response(request)

#         val = getattr(request, "set_refresh_token", None)
#         if val:
#             response.set_cookie("refreshToken", val)

#         return response

class CookieMiddleware(object):

    def resolve(self, next, root, args, context, info):
        """
        Set cookies based on the name/type of the GraphQL operation
        """

        # set cookie here and pass to dispatch method later to set in response
        