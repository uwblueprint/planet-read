from flask import current_app

from ...models import db
from ...models.story import Story
from ...models.story_content import StoryContent
from ..interfaces.story_service import IStoryService


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
