class CreateUserWithEmailDTO:
    def __init__(
        self,
        first_name,
        last_name,
        email,
        role,
        password,
        resume=None,
        profile_pic=None,
        approved_languages_translation=None,
        approved_languages_review=None,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.role = role
        self.password = password
        self.resume = resume
        self.profile_pic = profile_pic
        self.approved_languages_translation = approved_languages_translation
        self.approved_languages_review = approved_languages_review
        self.signUpMethod = "PASSWORD"


class CreateUserWithGoogleDTO:
    def __init__(
        self,
        first_name,
        last_name,
        role,
        email,
        auth_id,
        onFirebase,
        resume=None,
        profile_pic=None,
        approved_languages_translation=None,
        approved_languages_review=None,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
        self.email = email
        self.auth_id = auth_id
        self.resume = resume
        self.profile_pic = profile_pic
        self.approved_languages_translation = approved_languages_translation
        self.approved_languages_review = approved_languages_review
        self.signUpMethod = "GOOGLE"
        self.onFirebase = onFirebase
