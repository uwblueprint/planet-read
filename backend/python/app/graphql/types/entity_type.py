from ...models import Entity as EntityModel
from ...resources.entity_dto import EntityDTO

import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

class Entity(SQLAlchemyObjectType):
    class Meta:
        model = EntityModel
        interfaces = (relay.Node, )

class EntityInput(graphene.InputObjectType):
    string_field = graphene.String(required=True)
    int_field = graphene.Int(required=True)
    string_array_field = graphene.List(graphene.String, required=True)
    enum_field = graphene.String(required=True) # TODO: make stricter
    bool_field = graphene.Boolean(required=True)

def entity_input_to_dto_and_model(entity_data):
    entity_dto = EntityDTO(
        string_field=entity_data.string_field,
        int_field=entity_data.int_field,
        string_array_field=entity_data.string_array_field,
        enum_field=entity_data.enum_field,
        bool_field=entity_data.bool_field,
    )
    entity_model = EntityModel(
        string_field=entity_data.string_field,
        int_field=entity_data.int_field,
        string_array_field=entity_data.string_array_field,
        enum_field=entity_data.enum_field,
        bool_field=entity_data.bool_field,
    )
    return entity_dto, entity_model 
