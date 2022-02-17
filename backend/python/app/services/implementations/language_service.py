from flask import current_app
from sqlalchemy import exc

from ...models import db
from ...models.language import Language
from ..interfaces.language_service import ILanguageService


def handle_exceptions(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            res = f(*args, **kwargs)
            db.session.commit()
            return res
        except exc.SQLAlchemyError as error:
            db.session.rollback()
            raise error
        except Exception as error:
            self = args[0]
            self.logger.error(error)
            raise error
        finally:
            db.session.close()

    return wrapper


class LanguageService(ILanguageService):
    def __init__(self, logger=current_app.logger):
        self.logger = logger

    @handle_exceptions
    def get_languages(self):
        try:
            languages = Language.query.order_by(Language.language.asc()).all()
            return [language.language for language in languages]
        except Exception as error:
            self.logger.error(error)
            raise error

    @handle_exceptions
    def add_language(self, language, is_rtl):
        try:
            new_language = Language(language=language, is_rtl=is_rtl)
            db.session.add(new_language)
            db.session.commit()
            return new_language
        except Exception as error:
            self.logger.error(str(error))
            raise error

    @handle_exceptions
    def get_is_rtl(self, language):
        try:
            to_check = Language.query.filter_by(language=language).first()

            if not to_check:
                raise Exception(
                    "Language {language} not found".format(language=language)
                )
            else:
                return {"is_rtl": to_check.is_rtl}
        except Exception as error:
            self.logger.error(str(error))
            raise error
