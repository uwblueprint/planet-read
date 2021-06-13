from flask import current_app

from ...models import db
from ...models.story import Story
from ...models.story_content import StoryContent
from ...models.story_translation import StoryTranslation
from ..interfaces.story_service import IStoryService

# from backend.python.app.models import story_translation


class StoryService(IStoryService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def get_stories(self):
        # Entity is a SQLAlchemy model, we can use convenient methods provided
        # by SQLAlchemy like query.all() to query the data
        return [result.to_dict() for result in Story.query.all()]

    def get_story(self, id):
        # get queries by the primary key, which is id for the Story table
        story = Story.query.get(id)
        if story is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")
        return story.to_dict()

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

    def assign_user_as_reviewer(self, user, story_translation_obj):
        if (
            story_translation_obj.language in user.approved_languages
            and user.approved_languages[story_translation_obj.language] >= story_translation_obj.level 
            and story_translation_obj.stage == "TRANSLATE"
            and not story_translation_obj.reviewer_id
        ):
            story_translation = StoryTranslation.query.get(
                story_translation_obj.story_translation_id
            )
            story_translation.reviewer_id = user.id
            story_translation.stage = "REVIEW"
            db.session.commit()
        else:
            self.logger.error("User can't be assigned as a reviewer")
            raise Exception("User can't be assigned as a reviewer")
