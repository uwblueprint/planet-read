from flask import current_app

from ...models import db
from ...models.comment import Comment
from ..interfaces.comment_service import ICommentService


class CommentService(ICommentService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def create_comment(self, comment):
        try:
            new_comment = Comment(**comment)
            comment_index = 0

            comments = Comment.query.filter_by(
                story_translation_content_id=comment["story_translation_content_id"]
            )

            if comments.first() is not None:
                comment_index = (
                    comments.order_by(Comment.comment_index)[-1].comment_index + 1
                )

            new_comment.comment_index = comment_index
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_comment)
        db.session.commit()

        return new_comment
