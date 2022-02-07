import graphene
from graphene_file_upload.scalars import Upload

from ...middlewares.auth import (
    get_user_id_from_request,
    require_authorization_as_story_user_by_role,
    require_authorization_by_role_gql,
)
from ..service import services
from ..types.story_type import (
    CreateStoryTranslationRequestDTO,
    CreateStoryTranslationResponseDTO,
    StoryRequestDTO,
    StoryResponseDTO,
    StoryTranslationContentRequestDTO,
    StoryTranslationContentResponseDTO,
    StoryTranslationTestResponseDTO,
    StoryTranslationUpdateStatusResponseDTO,
    UpdateStoryTranslationStageRequestDTO,
)


class CreateStory(graphene.Mutation):
    class Arguments:
        story_data = StoryRequestDTO(required=True)
        contents = graphene.List(graphene.String, required=True)

    ok = graphene.Boolean()
    story = graphene.Field(lambda: StoryResponseDTO)

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, story_data=None, contents=None):
        story_response = services["story"].create_story(story_data, contents)
        ok = True
        return CreateStory(story=story_response, ok=ok)


class CreateStoryTranslation(graphene.Mutation):
    class Arguments:
        story_translation_data = CreateStoryTranslationRequestDTO(required=True)

    story = graphene.Field(lambda: CreateStoryTranslationResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, story_translation_data):
        try:
            new_story_translation = services["story"].create_translation(
                story_translation_data
            )
            return CreateStoryTranslation(story=new_story_translation)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class CreateStoryTranslationTest(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        level = graphene.Int(required=True)
        language = graphene.String(required=True)
        wants_reviewer = graphene.Boolean(required=True)

    story = graphene.Field(lambda: CreateStoryTranslationResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, user_id, level, language, wants_reviewer):
        try:
            new_story_translation = services["story"].create_translation_test(
                user_id, level, language, wants_reviewer
            )
            return CreateStoryTranslation(story=new_story_translation)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class AssignUserAsReviewer(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        story_translation_id = graphene.ID(required=True)

    story = graphene.Field(lambda: CreateStoryTranslationResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, user_id, story_translation_id):
        try:
            user = services["user"].get_user_by_id(user_id)

            new_story_translation = services["story"].assign_user_as_reviewer(
                user, story_translation_id
            )
            return AssignUserAsReviewer(story=new_story_translation)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class RemoveReviewerFromStoryTranslation(graphene.Mutation):
    class Arguments:
        story_translation_id = graphene.ID(required=True)

    ok = graphene.Boolean()

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, story_translation_id):
        try:
            story_translation = services["story"].get_story_translation(
                story_translation_id
            )
            services["story"].remove_reviewer_from_story_translation(story_translation)
            return RemoveReviewerFromStoryTranslation(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateStoryTranslationContents(graphene.Mutation):
    class Arguments:
        story_translation_contents = graphene.List(StoryTranslationContentRequestDTO)

    story = graphene.Field(lambda: graphene.List(StoryTranslationContentResponseDTO))

    @require_authorization_as_story_user_by_role(as_translator=True)
    def mutate(root, info, story_translation_contents):
        try:
            new_story_translation_contents = services[
                "story"
            ].update_story_translation_contents(story_translation_contents)
            return UpdateStoryTranslationContents(new_story_translation_contents)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateStoryTranslationContentStatus(graphene.Mutation):
    class Arguments:
        story_translation_content_id = graphene.Int(required=True)
        status = graphene.String(required=True)

    story = graphene.Field(lambda: StoryTranslationUpdateStatusResponseDTO)

    @require_authorization_as_story_user_by_role(as_translator=False)
    def mutate(root, info, story_translation_content_id, status):
        try:
            new_story = services["story"].update_story_translation_content_status(
                story_translation_content_id, status
            )
            return UpdateStoryTranslationContentStatus(new_story)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class ApproveAllStoryTranslationContent(graphene.Mutation):
    class Arguments:
        story_translation_id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @require_authorization_as_story_user_by_role(as_translator=False)
    def mutate(root, info, story_translation_id):
        try:
            services["story"].approve_all_story_translation_content(
                story_translation_id
            )

            return ApproveAllStoryTranslationContent(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class FinishGradingStoryTranslation(graphene.Mutation):
    class Arguments:
        test_result = graphene.JSONString(required=True)
        test_feedback = graphene.String(required=False)
        story_translation_test_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    story_translation = graphene.Field(lambda: StoryTranslationTestResponseDTO)

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, test_result, test_feedback, story_translation_test_id):
        try:
            reviewer_id = int(get_user_id_from_request())
            result = services["story"].finish_grading_story_translation(
                reviewer_id, test_result, test_feedback, story_translation_test_id
            )
            return FinishGradingStoryTranslation(ok=True, story_translation=result)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateStory(graphene.Mutation):
    class Arguments:
        story_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        level = graphene.Int(required=True)
        description = graphene.String(required=True)
        youtube_link = graphene.String(required=True)

    ok = graphene.Boolean()

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, story_id, title, level, description, youtube_link):
        try:
            services["story"].update_story(
                story_id, title, level, description, youtube_link
            )
            return UpdateStory(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateStoryTranslationStage(graphene.Mutation):
    class Arguments:
        story_translation_data = UpdateStoryTranslationStageRequestDTO(required=True)

    ok = graphene.Boolean()

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, story_translation_data):
        try:
            user_id = get_user_id_from_request()
            services["story"].update_story_translation_stage(
                story_translation_data, user_id
            )
            return UpdateStoryTranslationStage(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class SoftDeleteStoryTranslation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, id):
        try:
            services["story"].soft_delete_story_translation(id)
            return SoftDeleteStoryTranslation(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class RemoveUserFromStoryTranslation(graphene.Mutation):
    class Arguments:
        story_translation_id = graphene.Int(required=True)
        user_id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, story_translation_id, user_id):
        try:
            services["story"].remove_user_from_story_translation(
                story_translation_id, user_id
            )
            return RemoveUserFromStoryTranslation(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class SoftDeleteStory(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, id):
        try:
            services["story"].soft_delete_story(id)
            return SoftDeleteStory(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class ImportStory(graphene.Mutation):
    class Arguments:
        story_details = StoryRequestDTO(required=True)
        story_file = Upload(required=True)

    story = graphene.Field(lambda: StoryResponseDTO)

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, story_details, story_file):
        try:
            if not services["file"].validate_file(story_file.filename, "docx"):
                raise Exception("File must be .docx")
            resp = services["file"].create_file(story_file)
            new_story = services["story"].import_story(story_details, resp)
            services["file"].delete_file(resp["path"])
            return ImportStory(story=new_story)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class ProcessStory(graphene.Mutation):
    class Arguments:
        story_file = Upload(required=True)

    story_contents = graphene.Field(lambda: graphene.List(graphene.String))

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, story_file):
        try:
            if not services["file"].validate_file(story_file.filename, "docx"):
                raise Exception("File must be .docx")
            resp = services["file"].create_file(story_file)
            new_story_contents = services["story"].process_story(resp["path"])
            services["file"].delete_file(resp["path"])
            return ProcessStory(story_contents=new_story_contents)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
