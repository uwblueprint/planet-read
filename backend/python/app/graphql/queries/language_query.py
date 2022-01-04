from ..service import services


def resolve_languages(root, info):
    return services["language"].get_languages()
