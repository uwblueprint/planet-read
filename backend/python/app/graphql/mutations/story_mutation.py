import graphene

from ..service import services
from ..types.story_type import (
    CreateStoryTranslationRequestDTO,
    CreateStoryTranslationResponseDTO,
    StoryRequestDTO,
    StoryResponseDTO,
    StoryTranslationContentRequestDTO,
    StoryTranslationContentResponseDTO,
)


class CreateStory(graphene.Mutation):
    class Arguments:
        story_data = StoryRequestDTO(required=True)
        contents = graphene.List(graphene.String, required=True)

    ok = graphene.Boolean()
    story = graphene.Field(lambda: StoryResponseDTO)

    def mutate(root, info, story_data=None, contents=None):
        story_response = services["story"].create_story(story_data, contents)
        ok = True
        return CreateStory(story=story_response, ok=ok)


class CreateStoryTranslation(graphene.Mutation):
    class Arguments:
        story_translation_data = CreateStoryTranslationRequestDTO(required=True)

    story = graphene.Field(lambda: CreateStoryTranslationResponseDTO)

    def mutate(root, info, story_translation_data):
        try:
            new_story_translation = services["story"].create_translation(
                story_translation_data
            )
            return CreateStoryTranslation(story=new_story_translation)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class AssignUserAsReviewer(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        story_translation_id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, user_id, story_translation_id):
        try:
            user = services["user"].get_user_by_id(user_id)
            # TODO: move fetching story_translation to assign_user_as_reviewer
            story_translation = services["story"].get_story_translation(
                story_translation_id
            )
            services["story"].assign_user_as_reviewer(user, story_translation)
            return AssignUserAsReviewer(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateStoryTranslationContentById(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        story_translation_content_data = StoryTranslationContentRequestDTO(
            required=True
        )

    story = graphene.Field(lambda: StoryTranslationContentResponseDTO)

    def mutate(root, info, story_translation_content_data, user_id):
        try:
            new_story_translation = services["story"].update_story_translation_content(
                story_translation_content_data, user_id
            )
            return UpdateStoryTranslationContentById(new_story_translation)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateStoryTranslationContents(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        story_translation_contents = graphene.List(StoryTranslationContentRequestDTO)

    story = graphene.Field(lambda: graphene.List(StoryTranslationContentResponseDTO))

    def mutate(root, info, story_translation_contents, user_id):
        try:
            new_story_translation_contents = services[
                "story"
            ].update_story_translation_contents(story_translation_contents, user_id)
            return UpdateStoryTranslationContents(new_story_translation_contents)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
