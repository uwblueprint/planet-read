import firebase_admin.auth

from ...models import db
from ...models.story_translation import StoryTranslation
from ...models.story_translation_content import StoryTranslationContent
from ...resources.auth_dto import AuthDTO
from ...resources.create_user_dto import CreateUserWithGoogleDTO
from ...resources.token import Token
from ...utilities.firebase_rest_client import FirebaseRestClient
from ..interfaces.auth_service import IAuthService


class AuthService(IAuthService):
    """
    AuthService implementation with user authentication methods
    """

    def __init__(self, logger, user_service, email_service=None):
        """
        Create an instance of AuthService

        :param logger: application's logger instance
        :type logger: logger
        :param user_service: an user_service instance
        :type user_service: IUserService
        :param email_service: an email_service instance
        :type email_service: IEmailService
        """
        self.logger = logger
        self.user_service = user_service
        self.email_service = email_service
        self.firebase_rest_client = FirebaseRestClient(logger)

    def generate_token(self, email, password):
        try:
            token = self.firebase_rest_client.sign_in_with_password(email, password)
            user = self.user_service.get_user_by_email(email)
            return AuthDTO(**{**token.__dict__, **user.__dict__})
        except Exception as e:
            self.logger.error(
                "Failed to generate token for user with email {email}".format(
                    email=email
                )
            )
            raise e

    def generate_oauth_token(self, id_token):
        # If user already has a login with this email, just return the token
        try:
            google_user = self.firebase_rest_client.sign_in_with_google(id_token)
            auth_id = google_user["localId"]
            token = Token(google_user["idToken"], google_user["refreshToken"])
            on_firebase = False
            try:
                user = self.user_service.get_user_by_email(
                    google_user["email"]
                )  # If the user already has an email account, let them access that account
                return AuthDTO(**{**token.__dict__, **user.__dict__})
            except KeyError as e:
                pass
            try:
                firebase_admin.auth.get_user(
                    auth_id
                )  # If a person is on firebase but isn't there locally (a check that's mainly useful in a dev environment) so that we don't double create accounts
                on_firebase = True
            except firebase_admin.auth.UserNotFoundError as e:
                self.logger.error("User not found locally, but exists on Firebase")
            user = self.user_service.create_user(
                CreateUserWithGoogleDTO(
                    first_name=google_user["firstName"],
                    last_name=google_user["lastName"],
                    role_id="User",
                    email=google_user["email"],
                    auth_id=auth_id,
                    on_firebase=on_firebase,
                )
            )  # TODO: Pass in the profile photo from google
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to generate token for user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        return AuthDTO(**{**token.__dict__, **user.__dict__})

    def revoke_tokens(self, user_id):
        try:
            auth_id = self.user_service.get_auth_id_by_user_id(user_id)
            firebase_admin.auth.revoke_refresh_tokens(auth_id)
        except Exception as e:
            reason = getattr(e, "message", None)
            error_message = [
                "Failed to revoke refresh tokens of user with id {user_id}".format(
                    user_id=user_id
                ),
                "Reason =",
                (reason if reason else str(e)),
            ]
            self.logger.error(" ".join(error_message))
            raise e

    def renew_token(self, refresh_token):
        try:
            return self.firebase_rest_client.refresh_token(refresh_token)
        except Exception as e:
            self.logger.error("Failed to refresh token")
            raise e

    def reset_password(self, email):
        if not self.email_service:
            error_message = """
                Attempted to call reset_password but this instance of AuthService 
                does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            reset_link = firebase_admin.auth.generate_password_reset_link(email)
            email_body = """
                Hello,
                <br><br>
                We have received a password reset request for your account. 
                Please click the following link to reset it. 
                <strong>This link is only valid for 1 hour.</strong>
                <br><br>
                <a href={reset_link}>Reset Password</a>
                """.format(
                reset_link=reset_link
            )
            self.email_service.send_email(email, "Your Password Reset Link", email_body)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to send password reset link for {email}. Reason = {reason}".format(
                    email=email, reason=(reason if reason else str(e))
                )
            )
            raise e

    def is_authorized_by_role(self, access_token, roles):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            user_role = self.user_service.get_user_role_by_auth_id(
                decoded_id_token["uid"]
            )
            return user_role in roles
        except:
            return False

    def is_authorized_by_user_id(self, access_token, requested_user_id):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            token_user_id = self.user_service.get_user_id_by_auth_id(
                decoded_id_token["uid"]
            )
            return token_user_id == requested_user_id
        except:
            return False

    def is_authorized_by_user_id_not_equal(self, access_token, requested_user_id):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            token_user_id = self.user_service.get_user_id_by_auth_id(
                decoded_id_token["uid"]
            )
            return int(token_user_id) != requested_user_id
        except:
            return False

    def is_authorized_by_email(self, access_token, requested_email):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            return decoded_id_token["email"] == requested_email
        except:
            return False

    def is_translator(
        self, access_token, story_translation_id=None, story_translation_content_id=None
    ):
        return self._is_story_role(
            access_token,
            is_role_translator=True,
            story_translation_id=story_translation_id,
            story_translation_content_id=story_translation_content_id,
        )

    def is_reviewer(
        self, access_token, story_translation_id=None, story_translation_content_id=None
    ):
        return self._is_story_role(
            access_token,
            is_role_translator=False,
            story_translation_id=story_translation_id,
            story_translation_content_id=story_translation_content_id,
        )

    def _is_story_role(
        self,
        access_token,
        is_role_translator,
        story_translation_id,
        story_translation_content_id,
    ):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            user_id = self.user_service.get_user_id_by_auth_id(decoded_id_token["uid"])

            query_base = (
                db.session.query(StoryTranslation.translator_id)
                if is_role_translator
                else db.session.query(StoryTranslation.reviewer_id)
            )

            role_id = None

            if story_translation_id:
                role_id = (
                    query_base.filter(
                        StoryTranslation.id == story_translation_id
                    ).first()
                )[0]
            elif story_translation_content_id:
                role_id = (
                    query_base.join(
                        StoryTranslationContent,
                        StoryTranslationContent.story_translation_id
                        == StoryTranslation.id,
                    )
                    .filter(StoryTranslationContent.id == story_translation_content_id)
                    .first()
                )[0]
            else:
                error_message = """
                Neither story_translation_id nor story_translation_content_id were passed in 
                """
                self.logger.error(error_message)
                raise Exception(error_message)

            return int(user_id) == role_id
        except:
            return False
