from .types.entity_type import Entity
from .resolvers.entity_resolver import CreateEntity
from .types.user_type import User

import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField

class Mutation(graphene.ObjectType):
    create_entity = CreateEntity.Field()

class Query(graphene.ObjectType):
    node = relay.Node.Field()

    all_entities = SQLAlchemyConnectionField(Entity.connection)
    all_users = SQLAlchemyConnectionField(User.connection)

schema = graphene.Schema(query=Query, mutation=Mutation)
