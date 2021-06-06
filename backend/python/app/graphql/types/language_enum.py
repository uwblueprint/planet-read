import graphene

from ...models.language_enum import LanguageEnum

LanguageEnum = graphene.Enum.from_enum(LanguageEnum)
