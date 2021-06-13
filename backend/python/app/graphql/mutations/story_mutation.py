import graphene

from ..service import services
from ..types.story_type import StoryRequestDTO, StoryResponseDTO


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


class AssignUserAsReviewer(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        story_translation_id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, user_id, story_translation_id):
        try:
            user = services["user"].get_user_by_id(user_id)
            story_translation = services["story"].get_story_translation(
                story_translation_id
            )
            services["story"].assign_user_as_reviewer(user, story_translation)
            return AssignUserAsReviewer(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
