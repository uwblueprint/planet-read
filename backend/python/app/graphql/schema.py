from .types.entity_type import EntityResponseDTO
from .types.user_type import UserDTO
from .mutations.entity_mutation import CreateEntity
from .mutations.user_mutation import CreateUser
from .service import services
from .queries.entity_query import resolve_entities
from .queries.user_query import resolve_users, resolve_user_by_id, resolve_user_by_email

import graphene


class Mutation(graphene.ObjectType):
    create_entity = CreateEntity.Field()
    create_user = CreateUser.Field()


class Query(graphene.ObjectType):
    entities = graphene.Field(graphene.List(EntityResponseDTO))
    users = graphene.Field(graphene.List(UserDTO))
    user_by_id = graphene.Field(UserDTO, id=graphene.Int())
    user_by_email = graphene.Field(UserDTO, email=graphene.String())

    def resolve_entities(root, info, **kwargs):
        return resolve_entities(root, info, **kwargs)

    def resolve_users(root, info, **kwargs):
        return resolve_users(root, info, **kwargs)

    def resolve_user_by_id(root, info, id):
        return resolve_user_by_id(root, info, id)

    def resolve_user_by_email(root, info, email):
        return resolve_user_by_email(root, info, email)


schema = graphene.Schema(query=Query, mutation=Mutation)
