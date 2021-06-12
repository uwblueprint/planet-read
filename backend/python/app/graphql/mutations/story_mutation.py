import graphene

from ..service import services
from ..types.story_type import (
    NewStoryTranslationRequestDTO,
    NewStoryTranslationResponseDTO,
    StoryRequestDTO,
    StoryResponseDTO,
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
        story_translation_data = NewStoryTranslationRequestDTO(required=True)

    story = graphene.Field(lambda: NewStoryTranslationResponseDTO)

    def mutate(root, info, story_translation_data):
        try:
            new_story_translation = services["story"].create_translation(
                story_translation_data
            )
            return CreateStoryTranslation(story=new_story_translation)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
