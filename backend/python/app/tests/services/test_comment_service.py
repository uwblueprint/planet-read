import pytest

from ...models.comment import Comment
from ...models.comment_all import CommentAll
from ..helpers.comment_helpers import CreateCommentDTO, UpdateCommentRequestDTO
from ..helpers.db_helpers import db_session_add_commit_obj
from ..helpers.story_translation_helpers import (
    create_story_translation,
    create_story_translation_contents,
)


def test_create_comment(app, db, services):
    # Create Story and Story Translation
    (
        translator,
        reviewer,
        story_obj,
        story_translation_obj,
    ) = create_story_translation(db)
    story_translation_contents = create_story_translation_contents(
        db, story_translation_obj
    )

    # Single comment
    comment = CreateCommentDTO(
        story_translation_content_id=story_translation_contents[0]["id"],
        content="literally 1984",
    )
    resp = services["comment"].create_comment(comment.__dict__, translator.id)
    comment_obj = CommentAll.query.get(resp.id)

    assert resp == comment_obj
    assert comment_obj.comment_index == 0

    # Multiple comments
    comment_2 = CreateCommentDTO(
        story_translation_content_id=story_translation_contents[0]["id"],
        content="Orwellian State-Mandated Unit Tests",
    )
    resp_2 = services["comment"].create_comment(comment_2.__dict__, reviewer.id)
    comment_obj_2 = CommentAll.query.get(resp_2.id)

    assert resp_2 == comment_obj_2
    assert comment_obj_2.comment_index == 1


def test_update_comment(app, db, services):
    # Create Story and Story Translation
    (
        translator,
        reviewer,
        story_obj,
        story_translation_obj,
    ) = create_story_translation(db)
    story_translation_contents = create_story_translation_contents(
        db, story_translation_obj
    )

    comment = CreateCommentDTO(
        story_translation_content_id=story_translation_contents[0]["id"],
        content="Orwellian State-Mandated Unit Tests",
    )
    resp = services["comment"].create_comment(comment.__dict__, translator.id)
    comment_obj = CommentAll.query.get(resp.id)

    assert comment_obj.content == "Orwellian State-Mandated Unit Tests"

    comment_2 = UpdateCommentRequestDTO(resp)
    comment_2.content = "Big Brother is watching you"

    resp_2 = services["comment"].update_comment(comment_2, translator.id)
    comment_obj_2 = CommentAll.query.get(resp_2.id)

    assert comment_obj_2.content == "Big Brother is watching you"


def test_update_comment_resolve(app, db, services):
    # Create Story and Story Translation
    (
        translator,
        reviewer,
        story_obj,
        story_translation_obj,
    ) = create_story_translation(db)
    story_translation_contents = create_story_translation_contents(
        db, story_translation_obj
    )

    comment = CreateCommentDTO(
        story_translation_content_id=story_translation_contents[0]["id"],
        content="Orwellian State-Mandated Unit Tests",
    )
    resp = services["comment"].create_comment(comment.__dict__, translator.id)
    comment_obj = CommentAll.query.get(resp.id)

    # Multiple comments
    comment_2 = CreateCommentDTO(
        story_translation_content_id=story_translation_contents[0]["id"],
        content="Orwellian State-Mandated Unit Tests",
    )
    resp_2 = services["comment"].create_comment(comment_2.__dict__, reviewer.id)
    comment_obj_2 = CommentAll.query.get(resp_2.id)

    assert comment_obj.resolved == False
    assert comment_obj_2.resolved == False

    resolved_comment = UpdateCommentRequestDTO(resp)
    resolved_comment.resolved = True

    resp_resolved = services["comment"].update_comment(resolved_comment, translator.id)

    comment_obj_resolved = CommentAll.query.get(resp_resolved.id)
    comment_obj_2_resolved = CommentAll.query.get(resp_2.id)

    assert comment_obj_2_resolved.resolved and comment_obj_resolved.resolved


def test_update_comment_invalid_id(app, db, services):
    # Create Story and Story Translation
    (
        translator,
        reviewer,
        story_obj,
        story_translation_obj,
    ) = create_story_translation(db)
    story_translation_contents = create_story_translation_contents(
        db, story_translation_obj
    )

    comment = CreateCommentDTO(
        story_translation_content_id=story_translation_contents[0]["id"],
        content="Orwellian State-Mandated Unit Tests",
    )
    resp = services["comment"].create_comment(comment.__dict__, translator.id)
    comment_obj = CommentAll.query.get(resp.id)

    assert comment_obj.content == "Orwellian State-Mandated Unit Tests"

    comment_2 = UpdateCommentRequestDTO(resp)
    comment_2.content = "Big Brother is watching you"
    comment_2.id = comment_2.id + 1

    with pytest.raises(Exception) as e:
        _ = services["comment"].update_comment(comment_2, translator.id)
    assert "Comment with id=" in str(e.value)
