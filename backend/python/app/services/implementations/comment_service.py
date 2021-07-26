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

            # is there no auto-increment functionality?
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
