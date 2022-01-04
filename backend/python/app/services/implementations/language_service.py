from flask import current_app

from ...models import db
from ...models.language import Language
from ..interfaces.language_service import ILanguageService


class LanguageService(ILanguageService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    def get_languages(self):
        try:
            languages = Language.query.all()
            return [language.language for language in languages]
        except Exception as error:
            self.logger.error(error)
            raise error

    def add_language(self, language, is_rtl):
        try:
            new_language = Language(language=language, is_rtl=is_rtl)
            db.session.add(new_language)
            db.session.commit()
            return new_language
        except Exception as error:
            self.logger.error(str(error))
            raise error
