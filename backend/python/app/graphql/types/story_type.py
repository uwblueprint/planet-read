import graphene


class StageEnum(graphene.Enum):
    START = "START"
    TRANSLATE = "TRANSLATE"
    REVIEW = "REVIEW"
    PUBLISH = "PUBLISH"


class StoryResponseDTO(graphene.ObjectType):
    id = graphene.Int()
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translated_languages = graphene.List(graphene.String)  # TODO replace with Enum


class StoryRequestDTO(graphene.InputObjectType):
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translated_languages = graphene.List(graphene.String)  # TODO replace with Enum
