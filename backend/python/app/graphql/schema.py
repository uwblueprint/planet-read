from .types.entity_type import EntityResponseDTO
from .types.user_type import UserDTO
from .mutations.entity_mutation import CreateEntity
from .mutations.user_mutation import CreateUser
from .service import services
from .queries.entity_query import resolve_entities
from .queries.user_query import resolve_users

import graphene

class Mutation(graphene.ObjectType):
    create_entity = CreateEntity.Field()
    create_user = CreateUser.Field()
     
class Query(graphene.ObjectType):
    entities = graphene.Field(graphene.List(EntityResponseDTO))
    users = graphene.Field(graphene.List(UserDTO))  
    
    def resolve_entities(root, info, **kwargs):
        return resolve_entities(root, info, **kwargs)

    def resolve_users(root, info, **kwargs):
        return resolve_users(root, info, **kwargs)

schema = graphene.Schema(query=Query, mutation=Mutation)
