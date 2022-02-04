import os

from dotenv import load_dotenv

# note: VS Code's Python extension might falsely report an unresolved import
from server import application

if __name__ == "__main__":
    load_dotenv()
    port = int(os.getenv("PORT", 5000))
    application.run(host="0.0.0.0", port=port)
