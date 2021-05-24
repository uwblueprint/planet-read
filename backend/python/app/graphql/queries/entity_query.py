from ..service import services

def resolve_entities(root, info, **kwargs):
    return services['entity'].get_entities()