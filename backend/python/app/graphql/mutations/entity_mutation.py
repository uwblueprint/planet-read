import graphene

from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services
from ..types.entity_type import EntityRequestDTO, EntityResponseDTO


class CreateEntity(graphene.Mutation):
    class Arguments:
        entity_data = EntityRequestDTO(required=True)

    ok = graphene.Boolean()
    entity = graphene.Field(lambda: EntityResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, entity_data=None):
        entity_response = services["entity"].create_entity(entity_data)
        ok = True
        return CreateEntity(entity=entity_response, ok=ok)


# optional TODO:
# updateEntity(id: ID!, entity: EntityRequestDTO!): EntityResponseDTO!
# deleteEntity(id: ID!): ID
