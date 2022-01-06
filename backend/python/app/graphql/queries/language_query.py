from ..service import services


def resolve_languages(root, info):
    return services["language"].get_languages()


def resolve_is_rtl(root, info, language):
    return services["language"].get_is_rtl(language)
