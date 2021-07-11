import os
from logging.config import dictConfig

import firebase_admin
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flaskext.mysql import MySQL

from .config import app_config


def create_app(config_name):
    # configure Flask logger
    dictConfig(
        {
            "version": 1,
            "handlers": {
                "wsgi": {
                    "class": "logging.FileHandler",
                    "level": "ERROR",
                    "filename": "error.log",
                    "formatter": "default",
                }
            },
            "formatters": {
                "default": {
                    "format": "%(asctime)s-%(levelname)s-%(name)s::%(module)s,%(lineno)s: %(message)s"
                },
            },
            "root": {"level": "ERROR", "handlers": ["wsgi"]},
        }
    )

    app = Flask(__name__)
    mysql = MySQL()
    app.config.from_object(app_config[config_name])

    app.config["CORS_ORIGINS"] = ["http://localhost:3000"]
    app.config["CORS_SUPPORTS_CREDENTIALS"] = True
    CORS(app)

    app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
    app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
    app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
    app.config["MYSQL_DATABASE"] = os.getenv("MYSQL_DATABASE")

    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = "mysql://{username}:{password}@{host}:3306/{db}".format(
        username=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        host=os.getenv("DB_HOST"),
        db=os.getenv("MYSQL_DATABASE"),
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    mysql.init_app(app)
    firebase_admin.initialize_app()

    from . import models, rest

    models.init_app(app)
    rest.init_app(app)

    from . import graphql

    graphql.init_app(app)

    return app
