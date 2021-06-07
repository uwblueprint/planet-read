import graphene


class RoleEnum(graphene.Enum):
    User = "User"
    Admin = "Admin"


class UserDTO(graphene.ObjectType):
    id = graphene.Int()
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Field(RoleEnum, required=True)
    email = graphene.String(required=True)
    resume = graphene.Int()
    profile_pic = graphene.Int()
    approved_languages = graphene.JSONString()


class CreateUserDTO(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Argument(RoleEnum, required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    resume = graphene.Int(required=False, default=None)
    profile_pic = graphene.Int(required=False, default=None)
    approved_languages = graphene.JSONString(required=False, default=None)


class UpdateUserDTO(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Argument(RoleEnum, required=True)
    email = graphene.String(required=True)
    resume = graphene.Int(required=False, default=None)
    profile_pic = graphene.Int(required=False, default=None)
    approved_languages = graphene.JSONString(required=False, default=None)
