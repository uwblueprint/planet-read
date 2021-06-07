class UserDTO:
    def __init__(
        self,
        id,
        first_name,
        last_name,
        email,
        role,
        resume,
        profile_pic,
        approved_languages,
    ):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.role = role
        self.resume = resume
        self.profile_pic = profile_pic
        self.approved_languages = approved_languages
