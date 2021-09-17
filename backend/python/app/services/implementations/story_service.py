from flask import current_app

from ...graphql.types.story_type import StageEnum, StoryTranslationContentResponseDTO
from ...models import db
from ...models.story import Story
from ...models.story_content import StoryContent
from ...models.story_translation import StoryTranslation
from ...models.story_translation_content import StoryTranslationContent
from ...models.story_translation_content_status import StoryTranslationContentStatus
from ..interfaces.story_service import IStoryService
from ...middlewares.auth import get_user_id_from_request


class StoryService(IStoryService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def get_stories(self):
        # Story is a SQLAlchemy model, we can use convenient methods provided
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

    def get_stories_available_for_translation(self, language, level):
        stories = (
            Story.query.filter(Story.level == level)
            .filter(~Story.translated_languages.contains(language))
            .all()
        )
        return [story.to_dict(include_relationships=True) for story in stories]

    def create_translation(self, translation):
        try:
            new_story_translation = StoryTranslation(**translation.__dict__)
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

    def get_story_translations(self, user_id, translator, language, level):
        try:
            stories = (
                Story.query.join(
                    StoryTranslation, Story.id == StoryTranslation.story_id
                )
                .filter(
                    StoryTranslation.translator_id == user_id
                    if translator
                    else StoryTranslation.reviewer_id == user_id
                )
                .filter(StoryTranslation.language == language if language else True)
                .filter(Story.level == level if level else True)
                .order_by(Story.id)
                .all()
            )

            story_translations = (
                StoryTranslation.query.join(
                    Story, Story.id == StoryTranslation.story_id
                )
                .filter(
                    StoryTranslation.translator_id == user_id
                    if translator
                    else StoryTranslation.reviewer_id == user_id
                )
                .filter(StoryTranslation.language == language if language else True)
                .filter(Story.level == level if level else True)
                .order_by(Story.id)
                .all()
            )

            for i in range(len(stories)):
                stories[i] = {
                    **stories[i].to_dict(),
                    **story_translations[i].to_dict(include_relationships=True),
                }

            return stories

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def get_story_translation(self, id):
        try:
            story_details = (
                db.session.query(
                    Story.id.label("story_id"),
                    Story.title.label("title"),
                    Story.description.label("description"),
                    Story.youtube_link.label("youtube_link"),
                    Story.level.label("level"),
                    StoryTranslation.id.label("id"),
                    StoryTranslation.language.label("language"),
                    StoryTranslation.stage.label("stage"),
                    StoryTranslation.translator_id.label("translator_id"),
                    StoryTranslation.reviewer_id.label("reviewer_id"),
                    StoryTranslationContent.id.label("content_id"),
                    StoryTranslationContent.line_index.label("line_index"),
                    StoryTranslationContent.status.label("status"),
                    StoryTranslationContent.translation_content.label(
                        "translation_content"
                    ),
                )
                .join(StoryTranslation, Story.id == StoryTranslation.story_id)
                .join(
                    StoryTranslationContent,
                    StoryTranslationContent.story_translation_id == StoryTranslation.id,
                )
                .filter(StoryTranslation.id == id)
                .all()
            )

            response = {**story_details[0]._asdict()}
            response.pop("content_id")
            response.pop("line_index")
            response.pop("status")
            response.pop("translation_content")
            response["translation_contents"] = []

            for story_detail in story_details:
                story_detail_dict = story_detail._asdict()
                response["translation_contents"].append(
                    {
                        "id": story_detail_dict["content_id"],
                        "line_index": story_detail_dict["line_index"],
                        "status": story_detail_dict["status"],
                        "translation_content": story_detail_dict["translation_content"],
                    }
                )

            response["num_translated_lines"] = self._get_num_translated_lines(
                response["translation_contents"]
            )

            response["num_approved_lines"] = self._get_num_approved_lines(
                response["translation_contents"]
            )

            return response

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def assign_user_as_reviewer(self, user, story_translation):
        if (
            story_translation["language"] in user.approved_languages_review
            and user.approved_languages_review[story_translation["language"]]
            >= story_translation["level"]
            and story_translation["stage"] == "TRANSLATE"
            and not story_translation["reviewer_id"]
        ):
            story_translation = StoryTranslation.query.get(story_translation["id"])
            story_translation.reviewer_id = user.id
            story_translation.stage = "REVIEW"
            db.session.commit()
        else:
            self.logger.error("User can't be assigned as a reviewer")
            raise Exception("User can't be assigned as a reviewer")

    def update_story_translation_content(self, story_translation_content):
        try:
            story_translation = StoryTranslationContent.query.filter_by(
                id=story_translation_content.id
            ).first()

            if not story_translation:
                raise Exception(
                    "story_translation_content_id {id} not found".format(
                        id=story_translation_content.id
                    )
                )

            story_translation.translation_content = (
                story_translation_content.translation_content
            )
            db.session.commit()
        except Exception as error:
            reason = getattr(error, "message", None)
            self.logger.error(
                "Failed to update story translation content. Reason = {reason}".format(
                    reason=(reason if reason else str(error))
                )
            )
            raise error

        return StoryTranslationContentResponseDTO(
            story_translation_content.id,
            story_translation.line_index,
            story_translation_content.translation_content,
        )

    def update_story_translation_contents(self, story_translation_contents):
        try:
            # TODO: return lineIndex too
            db.session.bulk_update_mappings(
                StoryTranslationContent, story_translation_contents
            )
            db.session.commit()
            return story_translation_contents
        except Exception as error:
            reason = getattr(error, "message", None)
            self.logger.error(
                "Failed to update story translation content. Reason = {reason}".format(
                    reason=(reason if reason else str(error))
                )
            )
            raise error

    def update_story_translation_stage(self, story_translation_data):
        story_translation = StoryTranslation.query.filter_by(id=story_translation_data["id"]).first()
        new_stage = story_translation_data["stage"]
        user_id = get_user_id_from_request();

        if (new_stage == StageEnum.TRANSLATE and story_translation.reviewer_id == user_id
            or new_stage == StageEnum.REVIEW and story_translation.translator_id == user_id
        ):
            story_translation.stage = new_stage 
            db.session.commit()
        else:
            error = "User is not authorized to update translation stage to: {stage}".format(stage=new_stage)
            self.logger.error(error)
            raise Exception(error)

    def get_story_translations_available_for_review(self, language, level):
        try:
            stories = (
                Story.query.join(
                    StoryTranslation, Story.id == StoryTranslation.story_id
                )
                .filter(Story.level == level)
                .filter(StoryTranslation.language == language)
                .filter(StoryTranslation.reviewer_id == None)
                .order_by(Story.id)
                .all()
            )

            story_translations = (
                StoryTranslation.query.join(
                    Story, Story.id == StoryTranslation.story_id
                )
                .filter(Story.level == level)
                .filter(StoryTranslation.language == language)
                .filter(StoryTranslation.reviewer_id == None)
                .order_by(Story.id)
                .all()
            )

            for i in range(len(stories)):
                stories[i] = {
                    **stories[i].to_dict(),
                    **story_translations[i].to_dict(include_relationships=True),
                }

            return stories

        except Exception as error:
            self.logger.error(str(error))
            raise error

    def _get_num_translated_lines(self, translation_contents):
        return len(translation_contents) - [
            _["translation_content"].strip() for _ in translation_contents
        ].count("")

    def _get_num_approved_lines(self, translation_contents):
        count = 0
        for translation_content in translation_contents:
            if translation_content["status"] == StoryTranslationContentStatus.APPROVED:
                count += 1

        return count
