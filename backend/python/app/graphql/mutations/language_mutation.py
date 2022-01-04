import graphene

from ..service import services
from ..types.language_type import LanguageDTO


class AddLanguage(graphene.Mutation):
    class Arguments:
        language = graphene.String(required=True)
        is_rtl = graphene.Boolean(required=True)

    ok = graphene.Boolean()
    language = graphene.Field(lambda: LanguageDTO)

    def mutate(root, info, language, is_rtl=False):
        try:
            new_language = services["language"].add_language(
                language=language, is_rtl=is_rtl
            )
            return AddLanguage(ok=True, language=new_language)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
