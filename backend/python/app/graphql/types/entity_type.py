import graphene

class EntityEnum(graphene.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"

class EntityResponseDTO(graphene.ObjectType):
    id = graphene.Int()
    string_field = graphene.String(required=True)
    int_field = graphene.Int(required=True)
    string_array_field = graphene.List(graphene.String, required=True)
    enum_field = graphene.Field(EntityEnum, required=True)
    bool_field = graphene.Boolean(required=True)

class EntityRequestDTO(graphene.InputObjectType):
    string_field = graphene.String(required=True)
    int_field = graphene.Int(required=True)
    string_array_field = graphene.List(graphene.String, required=True)
    enum_field = graphene.Argument(EntityEnum, required=True) 
    bool_field = graphene.Boolean(required=True)
