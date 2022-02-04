import os

from dotenv import load_dotenv

# note: VS Code's Python extension might falsely report an unresolved import
from app import create_app

load_dotenv()
config_name = os.getenv("FLASK_CONFIG") or "development"
application = create_app(config_name)
