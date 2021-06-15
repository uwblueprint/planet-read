import graphene

from .mutations.auth_mutation import Login, Logout, Refresh, ResetPassword, SignUp
from .mutations.entity_mutation import CreateEntity
from .mutations.file_mutation import CreateFile
from .mutations.story_mutation import (
    CreateStory,
    CreateStoryTranslation,
    UpdateStoryTranslationContentById,
)
from .mutations.user_mutation import CreateUser, UpdateUser
from .queries.entity_query import resolve_entities
from .queries.file_query import resolve_file_by_id
from .queries.story_query import (
    resolve_stories,
    resolve_stories_available_for_translation,
    resolve_story_by_id,
    resolve_story_translations_by_user,
)
from .queries.user_query import resolve_user_by_email, resolve_user_by_id, resolve_users
from .types.entity_type import EntityResponseDTO
from .types.file_type import FileDTO
from .types.story_type import StoryResponseDTO, StoryTranslationResponseDTO
from .types.user_type import UserDTO


class Mutation(graphene.ObjectType):
    create_entity = CreateEntity.Field()
    create_file = CreateFile.Field()
    create_story = CreateStory.Field()
    create_user = CreateUser.Field()
    create_story_translation = CreateStoryTranslation.Field()
    reset_password = ResetPassword.Field()
    update_user = UpdateUser.Field()
    login = Login.Field()
    logout = Logout.Field()
    signup = SignUp.Field()
    refresh = Refresh.Field()
    create_story_translation = CreateStoryTranslation.Field()
    update_story_translation_content_by_id = UpdateStoryTranslationContentById.Field()


class Query(graphene.ObjectType):
    entities = graphene.Field(graphene.List(EntityResponseDTO))
    file_by_id = graphene.Field(FileDTO, id=graphene.Int())
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
    stories_available_for_translation = graphene.Field(
        graphene.List(StoryResponseDTO),
        language=graphene.String(),
        level=graphene.Int(),
    )

    def resolve_entities(root, info, **kwargs):
        return resolve_entities(root, info, **kwargs)

    def resolve_file_by_id(root, info, id):
        return resolve_file_by_id(root, info, id)

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

    def resolve_stories_available_for_translation(root, info, language, level):
        return resolve_stories_available_for_translation(root, info, language, level)

    def resolve_story_translations_by_user(root, info, user_id, translator):
        return resolve_story_translations_by_user(root, info, user_id, translator)


schema = graphene.Schema(query=Query, mutation=Mutation)
