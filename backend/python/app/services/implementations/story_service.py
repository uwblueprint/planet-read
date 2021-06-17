from flask import current_app

from ...models import db
from ...models.story import Story
from ...models.story_content import StoryContent
from ...models.story_translation import StoryTranslation
from ...models.story_translation_content import StoryTranslationContent
from ..interfaces.story_service import IStoryService

# from backend.python.app.models import story_translation


class StoryService(IStoryService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def get_stories(self):
        # Entity is a SQLAlchemy model, we can use convenient methods provided
        # by SQLAlchemy like query.all() to query the data
        return [
            story.to_dict(include_relationships=True) for story in Story.query.all()
        ]

    def get_story(self, id):
        # get queries by the primary key, which is id for the Story table
        story = Story.query.get(id)
        if story is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")
        return story.to_dict(include_relationships=True)

    def create_story(self, story, content):
        # create story
        try:
            new_story = Story(**story.__dict__)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_story)
        db.session.commit()

        # insert contents into story_contents
        # TODO use batch inserts here instead of iterating over the for loop?
        try:
            for i, line in enumerate(content):
                new_content = {
                    "story_id": new_story.id,
                    "line_index": i,
                    "content": line,
                }
                db.session.add(StoryContent(**new_content))
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.commit()
        db.session.refresh(new_story)

        return new_story

    def create_translation(self, entity):
        try:
            new_story_translation = StoryTranslation(**entity.__dict__)
            db.session.add(new_story_translation)
            db.session.commit()
        except Exception as error:
            self.logger.error(str(error))
            raise error
        try:
            translation_id = new_story_translation.id
            story_id = new_story_translation.story_id
            story_lines = len(StoryContent.query.filter_by(story_id=story_id).all())
            new_story_translation_content_cache = [
                StoryTranslationContent(
                    story_translation_id=translation_id,
                    line_index=line,
                    translation_content="",
                )
                for line in range(story_lines)
            ]
            db.session.bulk_save_objects(new_story_translation_content_cache)
            db.session.commit()
        except Exception as error:
            db.session.delete(new_story_translation)
            db.session.commit()
            self.logger.error(str(error))
            raise error

        return new_story_translation

    def get_story_translations(self, user_id, translator):
        try:
            return (
                db.session.query(
                    Story.id.label("story_id"),
                    Story.title.label("title"),
                    Story.description.label("description"),
                    Story.youtube_link.label("youtube_link"),
                    Story.level.label("level"),
                    StoryTranslation.id.label("story_translation_id"),
                    StoryTranslation.language.label("language"),
                    StoryTranslation.stage.label("stage"),
                    StoryTranslation.translator_id.label("translator_id"),
                    StoryTranslation.reviewer_id.label("reviewer_id"),
                )
                .join(StoryTranslation, Story.id == StoryTranslation.story_id)
                .filter(
                    StoryTranslation.translator_id == user_id
                    if translator
                    else StoryTranslation.reviewer_id == user_id
                )
            )
        except Exception as error:
            self.logger.error(str(error))
            raise error

    # TODO: change query to return Story object joined with Story Translation (as dict) on id's being the same
    def get_story_translation(self, id):
        try:
            return (
                db.session.query(
                    Story.id.label("story_id"),
                    Story.title.label("title"),
                    Story.description.label("description"),
                    Story.youtube_link.label("youtube_link"),
                    Story.level.label("level"),
                    StoryTranslation.id.label("story_translation_id"),
                    StoryTranslation.language.label("language"),
                    StoryTranslation.stage.label("stage"),
                    StoryTranslation.translator_id.label("translator_id"),
                    StoryTranslation.reviewer_id.label("reviewer_id"),
                )
                .join(StoryTranslation, Story.id == StoryTranslation.story_id)
                .filter(StoryTranslation.id == id)
                .one()
            )
        except Exception as error:
            self.logger.error(str(error))
            raise error

    def assign_user_as_reviewer(self, user, story_translation):
        if (
            story_translation.language in user.approved_languages
            and user.approved_languages[story_translation.language]
            >= story_translation.level
            and story_translation.stage == "TRANSLATE"
            and not story_translation.reviewer_id
        ):
            story_translation = StoryTranslation.query.get(
                story_translation.story_translation_id
            )
            story_translation.reviewer_id = user.id
            story_translation.stage = "REVIEW"
            db.session.commit()
        else:
            self.logger.error("User can't be assigned as a reviewer")
            raise Exception("User can't be assigned as a reviewer")
