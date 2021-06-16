from ..service import services


# TODO: require User or Admin role
def resolve_file_by_id(root, info, id):
    return services["file"].get_file(id)
