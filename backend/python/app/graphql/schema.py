import graphene

from .mutations.auth_mutation import (
    Login,
    LoginWithGoogle,
    Refresh,
    ResetPassword,
    SignUp,
)
from .mutations.comment_mutation import CreateComment, UpdateCommentById
from .mutations.file_mutation import CreateFile
from .mutations.language_mutation import AddLanguage
from .mutations.story_mutation import (
    ApproveAllStoryTranslationContent,
    AssignUserAsReviewer,
    CreateStory,
    CreateStoryTranslation,
    CreateStoryTranslationTest,
    FinishGradingStoryTranslation,
    ImportStory,
    ProcessStory,
    RemoveReviewerFromStoryTranslation,
    RemoveUserFromStoryTranslation,
    SoftDeleteStory,
    SoftDeleteStoryTranslation,
    UpdateStory,
    UpdateStoryTranslationContents,
    UpdateStoryTranslationContentStatus,
    UpdateStoryTranslationStage,
)
from .mutations.user_mutation import (
    CreateUser,
    SoftDeleteUser,
    UpdateMe,
    UpdateUserApprovedLanguages,
    UpdateUserByID,
)
from .queries.comment_query import resolve_comments_by_story_translation
from .queries.file_query import resolve_file_by_id
from .queries.language_query import resolve_is_rtl, resolve_languages
from .queries.story_query import (
    resolve_export_story_translation,
    resolve_stories,
    resolve_stories_available_for_translation,
    resolve_story_by_id,
    resolve_story_translation_by_id,
    resolve_story_translation_statistics,
    resolve_story_translation_tests,
    resolve_story_translations,
    resolve_story_translations_available_for_review,
    resolve_story_translations_by_user,
)
from .queries.user_query import resolve_user_by_email, resolve_user_by_id, resolve_users
from .types.comment_type import CommentResponseDTO
from .types.file_type import DownloadFileDTO, FileDTO
from .types.language_type import LanguageIsRTLDTO
from .types.story_type import (
    StoryResponseDTO,
    StoryTranslationConnection,
    StoryTranslationResponseDTO,
    StoryTranslationStatisticsResponseDTO,
    StoryTranslationTestResponseDTO,
)
from .types.user_type import UserDTO


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    create_file = CreateFile.Field()
    create_story = CreateStory.Field()
    create_user = CreateUser.Field()
    create_story_translation = CreateStoryTranslation.Field()
    create_story_translation_test = CreateStoryTranslationTest.Field()
    reset_password = ResetPassword.Field()
    update_me = UpdateMe.Field()
    update_user_by_id = UpdateUserByID.Field()
    login = Login.Field()
    login_with_google = LoginWithGoogle.Field()
    signup = SignUp.Field()
    refresh = Refresh.Field()
    assign_user_as_reviewer = AssignUserAsReviewer.Field()
    remove_reviewer_from_story_translation = RemoveReviewerFromStoryTranslation.Field()
    update_comment_by_id = UpdateCommentById.Field()
    update_story = UpdateStory.Field()
    update_story_translation_contents = UpdateStoryTranslationContents.Field()
    update_story_translation_content_status = (
        UpdateStoryTranslationContentStatus.Field()
    )
    approve_all_story_translation_content = ApproveAllStoryTranslationContent.Field()
    update_story_translation_stage = UpdateStoryTranslationStage.Field()
    soft_delete_story_translation = SoftDeleteStoryTranslation.Field()
    update_user_approved_language = UpdateUserApprovedLanguages.Field()
    soft_delete_user = SoftDeleteUser.Field()
    remove_user_from_story_translation = RemoveUserFromStoryTranslation.Field()
    finish_grading_story_translation = FinishGradingStoryTranslation.Field()
    soft_delete_story = SoftDeleteStory.Field()
    import_story = ImportStory.Field()
    process_story = ProcessStory.Field()
    add_language = AddLanguage.Field()


class Query(graphene.ObjectType):
    comments_by_story_translation = graphene.Field(
        graphene.List(CommentResponseDTO),
        story_translation_id=graphene.Int(required=True),
        resolved=graphene.Boolean(),
    )
    file_by_id = graphene.Field(DownloadFileDTO, id=graphene.Int(required=True))
    stories = graphene.Field(
        graphene.List(StoryResponseDTO),
        story_title=graphene.String(),
        start_date=graphene.String(),
        end_date=graphene.String(),
    )
    story_by_id = graphene.Field(StoryResponseDTO, id=graphene.Int(required=True))
    story_translations = graphene.relay.ConnectionField(
        StoryTranslationConnection,
        language=graphene.String(),
        level=graphene.Int(),
        stage=graphene.String(),
        story_title=graphene.String(),
        story_id=graphene.Int(),
    )
    story_translation_tests = graphene.Field(
        graphene.List(StoryTranslationTestResponseDTO),
        language=graphene.String(),
        level=graphene.Int(),
        stage=graphene.String(),
        story_title=graphene.String(),
        submitted_only=graphene.Boolean(),
    )
    story_translations_by_user = graphene.Field(
        graphene.List(StoryTranslationResponseDTO),
        user_id=graphene.Int(required=True),
        is_translator=graphene.Boolean(),
        language=graphene.String(),
        level=graphene.Int(),
    )
    story_translation_by_id = graphene.Field(
        StoryTranslationResponseDTO,
        id=graphene.Int(required=True),
    )
    users = graphene.Field(
        graphene.List(UserDTO),
        isTranslators=graphene.Boolean(required=True),
        language=graphene.String(),
        level=graphene.Int(),
        name_or_email=graphene.String(),
    )
    user_by_id = graphene.Field(UserDTO, id=graphene.Int(required=True))
    user_by_email = graphene.Field(UserDTO, email=graphene.String(required=True))
    story_translations_available_for_review = graphene.Field(
        graphene.List(StoryTranslationResponseDTO),
        language=graphene.String(required=True),
        level=graphene.Int(required=True),
        user_id=graphene.ID(),
    )
    stories_available_for_translation = graphene.Field(
        graphene.List(StoryResponseDTO),
        language=graphene.String(required=True),
        level=graphene.Int(required=True),
        user_id=graphene.ID(),
    )
    story_translation_statistics = graphene.Field(
        StoryTranslationStatisticsResponseDTO,
    )
    export_story_translation = graphene.Field(
        DownloadFileDTO, id=graphene.Int(required=True)
    )
    languages = graphene.Field(graphene.List(graphene.String))
    is_rtl = graphene.Field(LanguageIsRTLDTO, language=graphene.String(required=True))

    def resolve_comments_by_story_translation(
        root, info, story_translation_id, resolved=None
    ):
        return resolve_comments_by_story_translation(
            root, info, story_translation_id, resolved
        )

    def resolve_file_by_id(root, info, id):
        return resolve_file_by_id(root, info, id)

    def resolve_stories(
        root, info, story_title=None, start_date=None, end_date=None, **kwargs
    ):
        return resolve_stories(root, info, story_title, start_date, end_date, **kwargs)

    def resolve_story_by_id(root, info, id):
        return resolve_story_by_id(root, info, id)

    def resolve_languages(root, info):
        return resolve_languages(root, info)

    def resolve_is_rtl(root, info, language):
        return resolve_is_rtl(root, info, language)

    def resolve_users(
        root, info, isTranslators, language=None, level=None, name_or_email=None
    ):
        return resolve_users(root, info, isTranslators, language, level, name_or_email)

    def resolve_user_by_id(root, info, id):
        return resolve_user_by_id(root, info, id)

    def resolve_user_by_email(root, info, email):
        return resolve_user_by_email(root, info, email)

    def resolve_stories_available_for_translation(
        root, info, language, level, user_id=None
    ):
        return resolve_stories_available_for_translation(
            root, info, language, level, user_id
        )

    def resolve_story_translations_by_user(
        root, info, user_id, is_translator=None, language=None, level=None
    ):
        return resolve_story_translations_by_user(
            root, info, user_id, is_translator, language, level
        )

    def resolve_story_translations(
        root,
        info,
        language=None,
        level=None,
        stage=None,
        story_title=None,
        story_id=None,
        **kwargs
    ):
        return resolve_story_translations(
            root, info, language, level, stage, story_title, story_id
        )

    def resolve_story_translation_tests(
        root,
        info,
        language=None,
        level=None,
        stage=None,
        story_title=None,
        submitted_only=False,
        **kwargs
    ):
        return resolve_story_translation_tests(
            root, info, language, level, stage, story_title, submitted_only
        )

    def resolve_story_translation_by_id(root, info, id):
        return resolve_story_translation_by_id(root, info, id)

    def resolve_story_translations_available_for_review(
        root, info, language, level, user_id=None
    ):
        return resolve_story_translations_available_for_review(
            root, info, language, level, user_id
        )

    def resolve_story_translation_statistics(root, info):
        return resolve_story_translation_statistics(root, info)

    def resolve_export_story_translation(root, info, id):
        return resolve_export_story_translation(root, info, id)


schema = graphene.Schema(query=Query, mutation=Mutation)
