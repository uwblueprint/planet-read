from flask import current_app

from ...models import db
from ...models.story import Story
from ..interfaces.story_service import IStoryService

# from sqlalchemy.sql.operators import notin_op


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

    def create_story(self, entity):
        # TODO: Require all story content when creating story
        # and insert into story_contents
        try:
            new_story = Story(**entity.__dict__)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_story)
        db.session.commit()

        return new_story
    
    def get_stories_available_for_translation(self, user):
        all_stories = []
        approved_languages = user.approved_languages
        for lang in approved_languages:
            level = approved_languages[lang]
            stories = (
                Story.query.filter(Story.level <= level)
                .filter(~Story.translated_languages.any(lang))
                .all()
            )

            for story in stories:
                if (not story in all_stories):
                    all_stories.append(story)
        
        return all_stories
