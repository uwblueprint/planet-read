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
        approved_languages=None,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.role = role
        self.password = password
        self.resume = resume
        self.profile_pic = profile_pic
        self.approved_languages = approved_languages
        self.signUpMethod = "PASSWORD"


class CreateUserWithGoogleDTO:
    def __init__(
        self,
        first_name,
        last_name,
        role,
        email,
        uid,
        onFirebase,
        resume=None,
        profile_pic=None,
        approved_languages=None,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
        self.email = email
        self.uid = uid
        self.resume = resume
        self.profile_pic = profile_pic
        self.approved_languages = approved_languages
        self.signUpMethod = "GOOGLE"
        self.onFirebase = onFirebase
