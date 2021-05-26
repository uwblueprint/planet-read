import os
from werkzeug.utils import secure_filename

from flask import Blueprint, current_app, request
from flask import jsonify

from ..resources.file_dto import FileDTO

from ..middlewares.auth import require_authorization_by_role
from ..services.implementations.file_service import FileService

# define instance of fileService
file_service = FileService(current_app.logger)

# defines a shared URL prefix for all routes
blueprint = Blueprint("file", __name__, url_prefix="/files")


@blueprint.route("/<int:id>", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def get_file(id):
    try:
        result = file_service.get_file(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200


@blueprint.route("/", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def create_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file provided"}), 400

        upload_folder_path = os.getenv("UPLOAD_PATH")
        upload_path = os.path.join(upload_folder_path, secure_filename(file.filename))
        # rename file if it already exists
        if os.path.isfile(upload_path):
            upload_path = file_service.generate_file_name(
                secure_filename(file.filename)
            )
        file.save(upload_path)
        file_dto = FileDTO(upload_path)
        res = file_service.create_file(file_dto)
        return jsonify(res), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
