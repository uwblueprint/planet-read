from datetime import datetime

from flask import current_app
from sqlalchemy import func

from ...middlewares.auth import get_user_id_from_request
from ...models import db
from ...models.comment import Comment
from ...models.story_translation import StoryTranslation
from ...models.story_translation_content import StoryTranslationContent
from ...models.story_translation_content_status import StoryTranslationContentStatus
from ..interfaces.comment_service import ICommentService


class CommentService(ICommentService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def create_comment(self, comment):
        try:
            # TODO: remove cast to int once get_user_id_from_request is updated
            user_id = int(get_user_id_from_request())
            new_comment = Comment(**comment)
            new_comment.user_id = user_id

            story_translation = (
                db.session.query(StoryTranslation)
                .join(StoryTranslationContent)
                .filter(
                    StoryTranslationContent.id
                    == new_comment.story_translation_content_id
                )
                .first()
            )

            story_translation_stage = story_translation.stage
            story_translation_translator_id = story_translation.translator_id
            story_translation_reviewer_id = story_translation.reviewer_id

            is_translator = user_id == story_translation_translator_id
            is_reviewer = user_id == story_translation_reviewer_id
        except Exception as error:
            self.logger.error(str(error))
            raise error

        if (story_translation_stage == "TRANSLATE" and is_translator) or (
            story_translation_stage == "REVIEW" and is_reviewer
        ):
            try:
                new_comment.time = datetime.utcnow()
                new_comment.resolved = False
                comment_index = 0

                max = (
                    db.session.query(func.max(Comment.comment_index))
                    .filter(
                        Comment.story_translation_content_id
                        == comment["story_translation_content_id"]
                    )
                    .scalar()
                )

                if max is not None:
                    comment_index = max + 1

                new_comment.comment_index = comment_index

            except Exception as error:
                self.logger.error(str(error))
                raise error

            db.session.add(new_comment)
            db.session.commit()

            story_translation_content = new_comment.story_translation_content
            story_translation_content.status = (
                StoryTranslationContentStatus.ACTION_REQUIRED
            )
            db.session.commit()

            return new_comment
        elif story_translation_stage == "TRANSLATE" and is_reviewer:
            raise Exception(
                "Comments cannot be left by reviewers while the story is being translated."
            )
        elif story_translation_stage == "REVIEW" and is_translator:
            raise Exception(
                "Comments cannot be left by translators while the story is being reviewed."
            )
        elif story_translation_stage == "PUBLISH" and (is_translator or is_reviewer):
            raise Exception(
                "Comments cannot be left after the story has been published."
            )
        else:
            raise Exception("You are not authorized to leave comments on this story.")

    def get_comments_by_story_translation(self, story_translation_id, resolved=None):
        try:
            comment_query_base = (
                Comment.query
                if resolved is None
                else Comment.query.filter_by(resolved=resolved)
            )
            comments = (
                comment_query_base.join(Comment.story_translation_content, aliased=True)
                .filter_by(story_translation_id=story_translation_id)
                .all()
            )
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return comments

    def update_comment(self, updated_comment):
        try:
            comment = Comment.query.filter_by(id=updated_comment.id).first()
            if not comment:
                raise Exception(
                    "Comment with id={id} not found".format(id=updated_comment.id)
                )
            for key, value in updated_comment.__dict__.items():
                setattr(comment, key, value)
            db.session.commit()
        except Exception as error:
            reason = getattr(error, "message", None)
            self.logger.error(
                "Failed to update comment. Reason = {reason}".format(
                    reason=(reason if reason else str(error))
                )
            )
            raise error

        return comment

    def update_comments(self, updated_comments):
        try:
            db.session.bulk_update_mappings(Comment, updated_comments)
            db.session.commit()

        except Exception as error:
            reason = getattr(error, "message", None)
            self.logger.error(
                "Failed to update comment. Reason = {reason}".format(
                    reason=(reason if reason else str(error))
                )
            )
            raise error

        # TODO: return updated comments as list of CommentResponseDTO's
        return updated_comments
