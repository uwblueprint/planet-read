from abc import ABC, abstractmethod


class ILanguageService(ABC):
    """
    A class to handle CRUD functionality for languages
    """

    @abstractmethod
    def get_languages(self):
        """
        Get a list of languages currently used in the platform
        """
        pass

    @abstractmethod
    def add_language(self, language, is_rtl):
        """
        Add a new language to the db
        :param str language: new language
        :param is_rtl bool: indicates if the languages reads/writes right to left
        :rtype: LanguageDTO
        :raises Exception: if language fails to save
        """
        pass
