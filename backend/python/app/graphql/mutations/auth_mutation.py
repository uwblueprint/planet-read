"""
TODO mutations:
    login(email: String!, password: String!): AuthDTO!
    refresh: String!
    logout(userId: ID!): ID
    resetPassword(email: String!): Boolean!
"""

import os

import graphene
from flask import Blueprint, current_app, jsonify, request

from ...services.implementations.auth_service import AuthService
from ...services.implementations.email_service import EmailService
from ..service import services

email_service = EmailService(
    current_app.logger,
    {
        "refresh_token": os.getenv("EMAIL_REFRESH_TOKEN"),
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_id": os.getenv("EMAIL_CLIENT_ID"),
        "client_secret": os.getenv("EMAIL_CLIENT_SECRET"),
    },
    "planetread@uwblueprint.org",  # must replace
    "Planet Read",  # must replace)
)
auth_service = AuthService(current_app.logger, services["user"], email_service)


class ResetPassword(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, email):
        try:
            auth_service.reset_password(email)
            return ResetPassword(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
