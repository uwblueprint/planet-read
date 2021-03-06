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
    approved_languages_translation = graphene.JSONString()
    approved_languages_review = graphene.JSONString()
    additional_experiences = graphene.JSONString()


class CreateUserWithEmailDTO(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Argument(RoleEnum, required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    resume = graphene.Int(required=False, default=None)
    profile_pic = graphene.Int(required=False, default=None)
    approved_languages_translation = graphene.JSONString(required=False, default=None)
    approved_languages_review = graphene.JSONString(required=False, default=None)
    additional_experiences = graphene.JSONString(required=False, default=None)
    sign_up_method = graphene.String(default="PASSWORD")


class CreateUserWithGoogleDTO(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Argument(RoleEnum, required=True)
    email = graphene.String(required=True)
    auth_id = graphene.String(required=True)
    resume = graphene.Int(required=False, default=None)
    profile_pic = graphene.Int(required=False, default=None)
    approved_languages_translation = graphene.JSONString(required=False, default=None)
    approved_languages_review = graphene.JSONString(required=False, default=None)
    additional_experiences = graphene.JSONString(required=False, default=None)


class UpdateUserDTO(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    role = graphene.Argument(RoleEnum)
    email = graphene.String(required=True)
    resume = graphene.Int(required=False, default=None)
    profile_pic = graphene.Int(required=False, default=None)
    approved_languages_translation = graphene.JSONString(required=False, default=None)
    approved_languages_review = graphene.JSONString(required=False, default=None)
    additional_experiences = graphene.JSONString(required=False, default=None)
