from datetime import datetime

from flask import current_app
from sqlalchemy import func

from ...models import db
from ...models.comment import Comment
from ...models.story_translation_content_status import StoryTranslationContentStatus
from ..interfaces.comment_service import ICommentService


class CommentService(ICommentService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def create_comment(self, comment):
        try:
            new_comment = Comment(**comment)
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
        story_translation_content.status = StoryTranslationContentStatus.ACTION_REQUIRED
        db.session.commit()

        return new_comment

    def get_comments_by_story_translation(self, story_translation_id):
        try:
            comments = (
                Comment.query.join(Comment.story_translation_content, aliased=True)
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
