"""
TODO mutations:
    login(email: String!, password: String!): AuthDTO!
    refresh: String!
    logout(userId: ID!): ID
    resetPassword(email: String!): Boolean!
"""

import os
from operator import attrgetter

import graphene
from flask import Blueprint, current_app, jsonify, request

from ...services.implementations.auth_service import AuthService
from ...services.implementations.email_service import EmailService
from ..service import services
from ..types.user_type import RoleEnum

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


class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    access_token = graphene.String(required=True)
    id = graphene.Int()
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Field(RoleEnum, required=True)
    email = graphene.String(required=True)

    def mutate(root, info, email, password):
        try:
            auth_dto = auth_service.generate_token(email=email, password=password)
            access_token, id, first_name, last_name, email, role = attrgetter(
                "access_token", "id", "first_name", "last_name", "email", "role"
            )(auth_dto)
            return Login(access_token, id, first_name, last_name, role, email)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class SignUp(graphene.Mutation): 
    class Arguments: 
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    access_token = graphene.String(required=True)
    id = graphene.Int()
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Field(RoleEnum, required=True)
    email = graphene.String(required=True)

    def mutate(root, info, email, password):
        try:
            auth_dto = auth_service.generate_token(email=email, password=password)

            access_token = auth_dto.access_token
            id = auth_dto.id
            first_name = auth_dto.first_name
            last_name = auth_dto.last_name
            email = auth_dto.email
            role = auth_dto.role
            
            return SignUp(access_token, id, first_name, last_name, role, email)

        except Exception as e: 
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
