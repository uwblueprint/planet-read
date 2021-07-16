import graphene
from flask import request

from ...resources.create_user_dto import CreateUserWithEmailDTO
from ..service import services
from ..types.user_type import RoleEnum


class Refresh(graphene.Mutation):

    ok = graphene.Boolean()
    access_token = graphene.String()
    refresh_token = graphene.String()  # refresh_token MUST be requested

    def mutate(root, info):
        try:
            token = services["auth"].renew_token(request.cookies.get("refreshToken"))
            access_token = token.access_token
            refresh_token = token.refresh_token
            return Refresh(
                access_token=access_token, refresh_token=refresh_token, ok=True
            )
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class ResetPassword(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, email):
        try:
            services["auth"].reset_password(email)
            return ResetPassword(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    access_token = graphene.String()
    refresh_token = graphene.String()  # refresh_token MUST be requested
    id = graphene.Int()
    first_name = graphene.String()
    last_name = graphene.String()
    role = graphene.Field(RoleEnum)
    email = graphene.String()
    approved_languages = graphene.String()

    def mutate(root, info, email, password):
        try:
            auth_dto = services["auth"].generate_token(email=email, password=password)

            access_token = auth_dto.access_token
            refresh_token = auth_dto.refresh_token
            id = auth_dto.id
            first_name = auth_dto.first_name
            last_name = auth_dto.last_name
            role = auth_dto.role
            email = auth_dto.email
            approved_languages = auth_dto.approved_languages

            return Login(
                access_token,
                refresh_token,
                id,
                first_name,
                last_name,
                role,
                email,
                approved_languages,
            )
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class LoginWithGoogle(graphene.Mutation):
    class Arguments:
        tokenId = graphene.String(required=True)

    access_token = graphene.String()
    refresh_token = graphene.String()
    id = graphene.Int()
    first_name = graphene.String()
    last_name = graphene.String()
    role = graphene.Field(RoleEnum)
    email = graphene.String()
    approved_languages = graphene.String()

    def mutate(root, info, tokenId):
        try:
            auth_dto = services["auth"].generate_oauth_token(tokenId)

            access_token = auth_dto.access_token
            refresh_token = auth_dto.refresh_token
            id = auth_dto.id
            first_name = auth_dto.first_name
            last_name = auth_dto.last_name
            role = auth_dto.role
            email = auth_dto.email
            approved_languages = auth_dto.approved_languages

            return LoginWithGoogle(
                access_token,
                refresh_token,
                id,
                first_name,
                last_name,
                role,
                email,
                approved_languages,
            )
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class Logout(graphene.Mutation):
    class Arguments:
        userId = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, userId):
        try:
            services["auth"].revoke_tokens(userId)
            return Logout(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            return Exception(error_message if error_message else str(e))


class SignUp(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    access_token = graphene.String()
    refresh_token = graphene.String()  # refresh_token MUST be requested
    id = graphene.Int()
    first_name = graphene.String()
    last_name = graphene.String()
    role = graphene.Field(RoleEnum)
    email = graphene.String()

    def mutate(root, info, first_name, last_name, email, password):
        try:
            services["user"].create_user(
                CreateUserWithEmailDTO(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    role="User",
                    password=password
                )
            )
            auth_dto = services["auth"].generate_token(email=email, password=password)

            access_token = auth_dto.access_token
            refresh_token = auth_dto.refresh_token
            id = auth_dto.id
            first_name = auth_dto.first_name
            last_name = auth_dto.last_name
            email = auth_dto.email
            role = auth_dto.role

            return SignUp(
                access_token,
                refresh_token,
                id,
                first_name,
                last_name,
                role,
                email,
            )

        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
