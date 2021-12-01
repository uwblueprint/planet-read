from ...models.story import Story


class StoryTranslationRequestDTO:
    def __init__(
        self,
        story_id,
        language,
        stage,
        translator_id,
        reviewer_id,
    ):
        self.story_id = story_id
        self.language = language
        self.stage = stage
        self.translator_id = translator_id
        self.reviewer_id = reviewer_id
