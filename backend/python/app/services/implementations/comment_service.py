from datetime import datetime

from flask import current_app
from sqlalchemy import func

from ...models import db
from ...models.comment import Comment
from ...models.comment_all import CommentAll
from ...models.story_translation import StoryTranslation
from ...models.story_translation_content import StoryTranslationContent
from ..interfaces.comment_service import ICommentService
from .story_service import StoryService
from .utils import handle_exceptions

story_service = StoryService(current_app.logger)


class CommentService(ICommentService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    @handle_exceptions
    def create_comment(self, comment, user_id, is_admin=False):
        try:
            new_comment = CommentAll(**comment)
            new_comment.user_id = user_id

            story_translation = (
                StoryTranslation.query.join(
                    StoryTranslationContent,
                    StoryTranslation.id == StoryTranslationContent.story_translation_id,
                )
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
        if story_translation_stage == "PUBLISH" and (
            is_translator or is_reviewer or is_admin
        ):
            raise Exception(
                "Comments cannot be left after the story has been published."
            )
        elif is_translator or is_reviewer or is_admin:
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

            stc = StoryTranslationContent.query.filter_by(
                id=new_comment.story_translation_content_id
            ).first()

            new_comment.line_index = stc.line_index

            story_service._update_story_translation_last_activity(
                story_translation, is_translator
            )

            return new_comment
        else:
            raise Exception("You are not authorized to leave comments on this story.")

    @handle_exceptions
    def get_comments_by_story_translation(self, story_translation_id, resolved=None):
        try:
            comments_data = (
                db.session.query(Comment, StoryTranslationContent.line_index)
                .join(
                    StoryTranslationContent,
                    Comment.story_translation_content_id == StoryTranslationContent.id,
                )
                .filter(
                    StoryTranslationContent.story_translation_id
                    == story_translation_id,
                    Comment.resolved == resolved if resolved is not None else True,
                )
                .order_by(StoryTranslationContent.line_index)
                .all()
            )

            comments = []

            for comment_data in comments_data:
                comment, line_index = comment_data

                comments.append(
                    {
                        **comment.to_dict(include_relationships=True),
                        "line_index": line_index,
                    }
                )

        except Exception as error:
            self.logger.error(str(error))
            raise error

        return comments

    @handle_exceptions
    def update_comment(self, updated_comment, user_id):
        try:
            comment = Comment.query.filter_by(id=updated_comment.id).first()
            if not comment:
                raise Exception(
                    "Comment with id={id} not found".format(id=updated_comment.id)
                )
            for key, value in updated_comment.__dict__.items():
                setattr(comment, key, value)

            if updated_comment.resolved == True:
                thread_comments = Comment.query.filter_by(
                    story_translation_content_id=comment.story_translation_content_id
                ).all()
                for com in thread_comments:
                    com.resolved = True
            db.session.commit()

            story_translation = (
                StoryTranslation.query.join(
                    StoryTranslationContent,
                    StoryTranslation.id == StoryTranslationContent.story_translation_id,
                )
                .filter(
                    StoryTranslationContent.id == comment.story_translation_content_id
                )
                .first()
            )
            is_translator = user_id == story_translation.translator_id
            story_service._update_story_translation_last_activity(
                story_translation, is_translator
            )
        except Exception as error:
            reason = getattr(error, "message", None)
            self.logger.error(
                "Failed to update comment. Reason = {reason}".format(
                    reason=(reason if reason else str(error))
                )
            )
            raise error

        return comment
