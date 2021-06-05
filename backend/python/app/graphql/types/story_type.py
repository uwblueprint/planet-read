import graphene


class StageEnum(graphene.Enum):
    START = "START"
    TRANSLATE = "TRANSLATE"
    REVIEW = "REVIEW"
    PUBLISH = "PUBLISH"


class StoryResponseDTO(graphene.ObjectType):
    id = graphene.Int()
    stage = graphene.Field(StageEnum, required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translated_languages = graphene.List(graphene.String)  # TODO replace with Enum


class StoryRequestDTO(graphene.InputObjectType):
    stage = graphene.Argument(StageEnum, required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translated_languages = graphene.List(graphene.String)  # TODO replace with Enum
