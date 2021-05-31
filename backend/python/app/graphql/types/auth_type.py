import graphene

from .user_type import UserDTO


class LoginRequestDTO(graphene.InputObjectType):
    email = graphene.String(required=True)
    password = graphene.String(required=True)


class AuthDTO(graphene.ObjectType):
    access_token = graphene.String(required=True)
    user = graphene.Field(UserDTO, required=True)
