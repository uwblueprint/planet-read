import graphene


class LanguageDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    language = graphene.String(required=True)
    is_rtl = graphene.Boolean(required=True)
