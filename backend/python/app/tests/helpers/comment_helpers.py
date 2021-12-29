from collections.abc import Mapping

from ...models.comment import Comment
from ...models.comment_all import CommentAll


class CreateCommentDTO:
    def __init__(self, story_translation_content_id, content):
        self.story_translation_content_id = story_translation_content_id
        self.content = content


class UpdateCommentRequestDTO(Mapping):
    def __init__(self, comment):
        self.id = comment.id
        self.resolved = comment.resolved
        self.content = comment.content
        self._dict = dict(id=comment.id, content=comment.content)

    # These functions are necessary for bulk_update_mappings to work
    def __getitem__(self, key):
        return self._dict[key]

    def __iter__(self):
        return iter(self._dict)

    def __len__(self):
        return len(self._dict)
