import firebase_admin.auth
from flask import current_app
from flask.globals import current_app

from ...models import db
from ...models.comment import Comment
from ...models.language_enum import LanguageEnum
from ...models.story_translation import StoryTranslation
from ...models.user import User
from ...models.user_all import UserAll
from ...resources.user_dto import UserDTO
from ..interfaces.user_service import IUserService


class UserService(IUserService):
    """
    UserService implementation with user management methods
    """

    def __init__(self, logger=current_app.logger):
        """
        Create an instance of UserService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def get_user_by_id(self, user_id):
        try:
            user = User.query.get(user_id)

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id))

            firebase_user = firebase_admin.auth.get_user(user.auth_id)
            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
            user_dict["email"] = firebase_user.email

            return UserDTO(**user_dict)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_by_email(self, email):
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            user = User.query.filter_by(auth_id=firebase_user.uid).first()

            if not user:
                raise KeyError(
                    "user with auth_id {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
            user_dict["email"] = firebase_user.email

            return UserDTO(**user_dict)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_role_by_auth_id(self, auth_id):
        try:
            user = self.get_user_by_auth_id(auth_id)
            return user.role
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user role. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_id_by_auth_id(self, auth_id):
        try:
            user = self.get_user_by_auth_id(auth_id)
            return str(user.id)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_auth_id_by_user_id(self, user_id):
        try:
            user = User.query.get(user_id)

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            return user.auth_id
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "failed to get auth_id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_users(self, isTranslators, language=None, level=None, name_or_email=None):
        user_dtos = []
        appr_langs = None
        if isTranslators:
            appr_langs = User.approved_languages_translation
        else:
            appr_langs = User.approved_languages_review

        query = User.query.filter_by(role="User").filter(appr_langs.isnot(None))

        if language:
            query = query.filter(appr_langs.contains(language))
            if level:
                query = query.filter(appr_langs[language] == level)

        if name_or_email:
            name_or_email = "%" + name_or_email + "%"
            query = query.filter(
                User.first_name.like(name_or_email)
                | (User.last_name.like(name_or_email))
                | (User.email.like(name_or_email))
            )

        user_list = [result for result in query]
        for user in user_list:
            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
            try:
                firebase_user = firebase_admin.auth.get_user(user.auth_id)
                user_dict["email"] = firebase_user.email
                user_dtos.append(UserDTO(**user_dict))
            except Exception as e:
                self.logger.error(
                    "User with auth_id {auth_id} could not be fetched from Firebase".format(
                        auth_id=user.auth_id
                    )
                )
                raise e

        if (level is not None) and (not language):
            if isTranslators:
                return filter(
                    lambda user_dto: level
                    in user_dto.approved_languages_translation.values(),
                    user_dtos,
                )
            else:
                return filter(
                    lambda user_dto: level
                    in user_dto.approved_languages_review.values(),
                    user_dtos,
                )

        return user_dtos

    def create_user(self, user):
        new_user = None
        firebase_user = None
        mysql_user = None
        auth_id = None
        try:
            if user.sign_up_method == "PASSWORD":
                firebase_user = firebase_admin.auth.create_user(
                    email=user.email, password=user.password
                )
                auth_id = firebase_user.uid
            elif user.sign_up_method == "GOOGLE":
                if not user.on_firebase:
                    firebase_user = firebase_admin.auth.create_user(uid=user.auth_id)
                auth_id = user.auth_id

            mysql_user = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "auth_id": auth_id,
                "role": user.role,
                "resume": user.resume,
                "profile_pic": user.profile_pic,
                "approved_languages_translation": user.approved_languages_translation,
                "approved_languages_review": user.approved_languages_review,
                "additional_experiences": user.additional_experiences,
            }

            try:
                new_user = UserAll(**mysql_user)
                db.session.add(new_user)
                db.session.commit()
            except Exception as postgres_error:
                # rollback user creation in Firebase
                try:
                    if not (user.sign_up_method == "GOOGLE" and user.on_firebase):
                        firebase_admin.auth.delete_user(firebase_user.uid)
                except Exception as firebase_error:
                    reason = getattr(firebase_error, "message", None)
                    error_message = [
                        "Failed to rollback Firebase user creation after PostgreSQL user creation failed.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(firebase_error))
                        ),
                        "Orphaned auth_id (Firebase uid) = {auth_id}".format(
                            auth_id=firebase_user.uid
                        ),
                    ]
                    self.logger.error(" ".join(error_message))
                raise postgres_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        new_user_dict = UserService.__user_to_dict_and_remove_auth_id(new_user)
        new_user_dict["email"] = user.email
        return UserDTO(**new_user_dict)

    def update_me(self, user_id, user, resume=None):
        # TODO: start a new story test for given language when user wants to increase their level
        try:
            old_user = User.query.get(user_id)

            if not old_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            if resume:
                User.query.filter_by(id=user_id).update(
                    {
                        User.first_name: user.first_name,
                        User.last_name: user.last_name,
                        User.email: user.email,
                        User.resume: resume["id"],
                        User.profile_pic: user.profile_pic,
                        User.additional_experiences: user.additional_experiences,
                    }
                )
            else:
                User.query.filter_by(id=user_id).update(
                    {
                        User.first_name: user.first_name,
                        User.last_name: user.last_name,
                        User.email: user.email,
                        User.profile_pic: user.profile_pic,
                        User.additional_experiences: user.additional_experiences,
                    }
                )

            db.session.commit()

            try:
                firebase_admin.auth.update_user(old_user.auth_id, email=user.email)
            except Exception as firebase_error:
                try:
                    old_user_dict = {
                        User.first_name: old_user.first_name,
                        User.last_name: old_user.last_name,
                        User.role: old_user.role,
                    }
                    User.query.filter_by(id=user_id).update(**old_user_dict)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user update after Firebase user update failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(postgres_error))
                        ),
                        "Postgres user id with possibly inconsistent data = {user_id}".format(
                            user_id=user_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to update user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        return UserService.get_user_by_id(self, user_id)

    def update_user_by_id(self, user_id, user):
        try:
            old_user = User.query.get(user_id)

            if not old_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            User.query.filter_by(id=user_id).update(
                {
                    User.first_name: user.first_name,
                    User.last_name: user.last_name,
                    User.role: user.role,
                    User.resume: user.resume,
                    User.profile_pic: user.profile_pic,
                    User.approved_languages_translation: user.approved_languages_translation,
                    User.approved_languages_review: user.approved_languages_review,
                    User.additional_experiences: user.additional_experiences,
                    User.email: user.email,
                }
            )

            db.session.commit()

            try:
                firebase_admin.auth.update_user(old_user.auth_id, email=user.email)
            except Exception as firebase_error:
                try:
                    old_user_dict = {
                        User.first_name: old_user.first_name,
                        User.last_name: old_user.last_name,
                        User.role: old_user.role,
                    }
                    User.query.filter_by(id=user_id).update(**old_user_dict)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user update after Firebase user update failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(postgres_error))
                        ),
                        "Postgres user id with possibly inconsistent data = {user_id}".format(
                            user_id=user_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to update user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        return UserDTO(user_id, **user)

    def soft_delete_user(self, user_id):
        try:
            user = User.query.get(user_id)

            if not user:
                raise Exception(f"user_id {user_id} not found")

            story_translations_translations = StoryTranslation.query.filter(
                StoryTranslation.translator_id == user_id
            )
            for story_translation in story_translations_translations:
                story_translation.translator_id = None

            story_translations_reviewer = StoryTranslation.query.filter(
                StoryTranslation.reviewer_id == user_id
            )
            for story_translation in story_translations_reviewer:
                story_translation.reviewer_id = None

            comments = Comment.query.filter(Comment.user_id == user_id)

            for comment in comments:
                comment.is_deleted = True

            user.is_deleted = True
            db.session.commit()
        except Exception as error:
            self.logger.error(error)
            raise error

    def delete_user_by_id(self, user_id):
        try:
            deleted_user = User.query.get(user_id)

            if not deleted_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            delete_count = User.query.filter_by(id=user_id).delete(
                synchronize_session="fetch"
            )

            if delete_count < 1:
                raise Exception(
                    "user_id {user_id} was not deleted".format(user_id=user_id)
                )
            elif delete_count > 1:
                raise Exception(
                    "user_id {user_id} had multiple instances. Delete not committed.".format(
                        user_id=user_id
                    )
                )

            db.session.commit()

            try:
                firebase_admin.auth.delete_user(deleted_user.auth_id)
            except Exception as firebase_error:
                # rollback Postgres user deletion
                try:
                    deleted_user_dict = {
                        "first_name": deleted_user.first_name,
                        "last_name": deleted_user.last_name,
                        "auth_id": deleted_user.auth_id,
                        "role": deleted_user.role,
                    }

                    new_user = User(**deleted_user_dict)
                    db.session.add(new_user)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user deletion after Firebase user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(postgres_error)),
                        ),
                        "Firebase uid with non-existent Postgres record ={auth_id}".format(
                            auth_id=deleted_user.auth_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def delete_user_by_email(self, email):
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            deleted_user = User.query.filter_by(auth_id=firebase_user.uid).first()

            if not deleted_user:
                raise Exception(
                    "auth_id (Firebase uid) {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            delete_count = User.query.filter_by(auth_id=firebase_user.uid).delete(
                synchronize_session="fetch"
            )

            if delete_count < 1:
                raise Exception(
                    "User with email {email} was not deleted".format(email=email)
                )
            elif delete_count > 1:
                raise Exception(
                    "User with email {email} had multiple instances. Delete not committed.".format(
                        email=email
                    )
                )

            db.session.commit()

            try:
                firebase_admin.auth.delete_user(firebase_user.uid)
            except Exception as firebase_error:
                try:
                    deleted_user_dict = {
                        "first_name": deleted_user.first_name,
                        "last_name": deleted_user.last_name,
                        "auth_id": deleted_user.auth_id,
                        "role": deleted_user.role,
                    }
                    new_user = User(**deleted_user_dict)
                    db.session.add(new_user)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user deletion after Firebase user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(postgres_error))
                        ),
                        "Firebase uid with non-existent Postgres record = {auth_id}".format(
                            auth_id=deleted_user.auth_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_by_auth_id(self, auth_id):
        """
        Get a user document by auth_id

        :param auth_id: the user's auth_id (Firebase uid)
        :type auth_id: str
        """
        firebase_user = firebase_admin.auth.get_user(auth_id)

        user = User.query.filter_by(auth_id=auth_id).first()
        if not user:
            raise KeyError(
                "user with auth_id {auth_id} not found".format(auth_id=auth_id)
            )
        user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
        user_dict["email"] = firebase_user.email

        return UserDTO(**user_dict)

    def update_approved_language(self, user_id, is_translate, language, level):
        try:
            if not language in LanguageEnum._member_names_:
                raise Exception(f"Invalid language provided: {language}")
            if level > 4:
                raise Exception(f"Invalid language level provided: {level}")

            user = User.query.filter_by(id=user_id).first()
            if not user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            curr_languages = (
                user.approved_languages_translation
                if is_translate
                else user.approved_languages_review
            ) or {}

            if level < 1 and language in curr_languages:
                curr_languages.pop(language)
            else:
                curr_languages[language] = level

            if is_translate:
                user.approved_languages_translation = curr_languages
            else:
                user.approved_languages_review = curr_languages

            User.query.filter_by(id=user_id).update(user.to_dict())
            db.session.commit()
            return user
        except Exception as error:
            self.logger.error(str(error))
            raise error

    @staticmethod
    def __user_to_dict_and_remove_auth_id(user):
        """
        Convert a User document to a serializable dict and remove the
        auth id field

        :param user: the user
        :type user: User
        """
        user_dict = user.to_dict()
        user_dict.pop("auth_id", None)
        user_dict.pop("is_deleted", None)
        return user_dict
