from ..types.entity_type import Entity, EntityInput, entity_input_to_dto_and_model
from ..service import services

import graphene

class CreateEntity(graphene.Mutation):
    class Arguments:
        entity_data = EntityInput(required=True)
        
    ok = graphene.Boolean()
    entity = graphene.Field(lambda: Entity)

    def mutate(root, info, entity_data=None):
        entity_dto, entity_model = entity_input_to_dto_and_model(entity_data)
        services["entity"].create_entity(entity_dto) 
        ok = True
        return CreateEntity(entity=entity_model, ok=ok)

# TODO: 
# updateEntity(id: ID!, entity: EntityRequestDTO!): EntityResponseDTO!
# deleteEntity(id: ID!): ID 
