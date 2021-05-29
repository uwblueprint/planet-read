def init_app(app):
    from . import auth_routes, entity_routes, file_routes, user_routes

    app.register_blueprint(user_routes.blueprint)
    app.register_blueprint(auth_routes.blueprint)
    app.register_blueprint(entity_routes.blueprint)
    app.register_blueprint(file_routes.blueprint)
