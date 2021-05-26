class FileDTO(object):
    def __init__(self, path):
        if not path:
            raise ValueError("Invalid path value, must not be empty")

        self.path = path
