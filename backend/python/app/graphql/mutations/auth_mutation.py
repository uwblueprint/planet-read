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

from ...resources.create_user_dto import CreateUserDTO
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

class Refresh(graphene.Mutation):

    ok = graphene.Boolean()
    access_token = graphene.String()

    def mutate(root, info):
        print("Refresh mutation")
        print(request.__dict__)
        print(request.cookies.get("refreshToken"))
        try:
            token = auth_service.renew_token(request.cookies.get("refreshToken"))
            access_token = token.access_token
            info.context.set_refresh_token = jsonify(
                {
                    "refresh_token": token.refresh_token,
                    "httponly": True,
                    "secure": (os.getenv("FLASK_CONFIG") == "production"),                    
                }
            )
            return Refresh(access_token, ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


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

    def mutate(root, info, first_name, last_name, email, password):
        try:
            services["user"].create_user(
                CreateUserDTO(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    role="User",
                    password=password,
                )
            )
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
