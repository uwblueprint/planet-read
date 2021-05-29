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


class CreateUserDTO(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Argument(RoleEnum, required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
