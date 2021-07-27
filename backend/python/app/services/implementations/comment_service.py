from datetime import datetime

from flask import current_app
from sqlalchemy import func

from ...models import db
from ...models.comment import Comment
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

        return new_comment

    def update_comment(self, updated_comment):
        try:
            comment = Comment.query.filter_by(id=updated_comment.id).first()
            if not comment:
                raise Exception(
                    "Comment with id={id} not found".format(id=updated_comment.id)
                )
            updated_comment.time = datetime.utcnow()
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
            comments = []
            for comment_data in updated_comments:
                updated_comment = comment_data.__dict__
                updated_comment["time"] = datetime.utcnow()
                comments.append(updated_comment)

            db.session.bulk_update_mappings(Comment, comments)
            db.session.commit()

        except Exception as error:
            reason = getattr(error, "message", None)
            self.logger.error(
                "Failed to update comment. Reason = {reason}".format(
                    reason=(reason if reason else str(error))
                )
            )
            raise error

        return comments
