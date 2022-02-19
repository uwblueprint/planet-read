from sqlalchemy import exc
from ...models import db


def handle_exceptions(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except exc.SQLAlchemyError as error:
            db.session.rollback()
            raise error
        except Exception as error:
            self = args[0]
            self.logger.error(error)
            raise error

    return wrapper
