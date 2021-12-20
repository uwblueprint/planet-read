from datetime import datetime

from flask import current_app
from sqlalchemy import func

from ...models import db
from ...models.comment import Comment
from ...models.comment_all import CommentAll
from ...models.story_translation import StoryTranslation
from ...models.story_translation_content import StoryTranslationContent
from ...models.story_translation_content_status import StoryTranslationContentStatus
from ..interfaces.comment_service import ICommentService


class CommentService(ICommentService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def create_comment(self, comment, user_id):
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

            stc = StoryTranslationContent.query.filter_by(
                id=new_comment.story_translation_content_id
            ).first()

            new_comment.line_index = stc.line_index

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
