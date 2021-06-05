import graphene

from ..service import services
from ..types.story_type import StoryRequestDTO, StoryResponseDTO


class CreateStory(graphene.Mutation):
    class Arguments:
        story_data = StoryRequestDTO(required=True)

    ok = graphene.Boolean()
    story = graphene.Field(lambda: StoryResponseDTO)

    def mutate(root, info, story_data=None):
        story_response = services["story"].create_story(story_data)
        ok = True
        return CreateStory(story=story_response, ok=ok)