import graphene

from .mutations.auth_mutation import Login, ResetPassword, SignUp
from .mutations.entity_mutation import CreateEntity
from .mutations.story_mutation import CreateStory
from .mutations.user_mutation import CreateUser, UpdateUser
from .queries.entity_query import resolve_entities
from .queries.story_query import (
    resolve_stories,
    resolve_story_by_id,
    resolve_story_translations_by_user,
)
from .queries.user_query import resolve_user_by_email, resolve_user_by_id, resolve_users
from .types.entity_type import EntityResponseDTO
from .types.story_type import StoryResponseDTO, StoryTranslationResponseDTO
from .types.user_type import UserDTO


class Mutation(graphene.ObjectType):
    create_entity = CreateEntity.Field()
    create_story = CreateStory.Field()
    create_user = CreateUser.Field()
    reset_password = ResetPassword.Field()
    update_user = UpdateUser.Field()
    login = Login.Field()
    signup = SignUp.Field()


class Query(graphene.ObjectType):
    entities = graphene.Field(graphene.List(EntityResponseDTO))
    stories = graphene.Field(graphene.List(StoryResponseDTO))
    story_by_id = graphene.Field(StoryResponseDTO, id=graphene.Int())
    story_translations_by_user = graphene.Field(
        graphene.List(StoryTranslationResponseDTO),
        user_id=graphene.Int(),
        translator=graphene.Boolean(),
    )
    users = graphene.Field(graphene.List(UserDTO))
    user_by_id = graphene.Field(UserDTO, id=graphene.Int())
    user_by_email = graphene.Field(UserDTO, email=graphene.String())

    def resolve_entities(root, info, **kwargs):
        return resolve_entities(root, info, **kwargs)

    def resolve_stories(root, info, **kwargs):
        return resolve_stories(root, info, **kwargs)

    def resolve_story_by_id(root, info, id):
        return resolve_story_by_id(root, info, id)

    def resolve_users(root, info, **kwargs):
        return resolve_users(root, info, **kwargs)

    def resolve_user_by_id(root, info, id):
        return resolve_user_by_id(root, info, id)

    def resolve_user_by_email(root, info, email):
        return resolve_user_by_email(root, info, email)

    def resolve_story_translations_by_user(root, info, user_id, translator):
        return resolve_story_translations_by_user(root, info, user_id, translator)


schema = graphene.Schema(query=Query, mutation=Mutation)
