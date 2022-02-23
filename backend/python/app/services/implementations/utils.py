from ...models import db


def handle_exceptions(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            db.session.execute("SELECT 1;")
        except:
            db.session.rollback()

        try:
            return f(*args, **kwargs)
        except Exception as error:
            self = args[0]
            self.logger.error(error)
            db.session.rollback()
            raise error

    return wrapper
