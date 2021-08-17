# 🌏 Planet Read

🐬 MySQL + 🐍 Flask story translation platform.  

Made with [starter-code-v2](https://github.com/uwblueprint/starter-code-v2), brought to you by the @uwblueprint/internal-tools team!

# Getting Started
## Vault
Get [started with vault](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e). To grab the project's secrets, run
```
vault kv get -format=json kv/planet-read | python update_secret_files.py
```
You should have three new files in your repo after this:
- `.env`
- `backend/.env`
- `backend/python/firebaseServiceAccount.json`
## Prereqs
Verify that you have docker and npx installed:
```
docker info
docker-compose --version
npx -v
```
# Build and Run
Note: if you have already built the project before, run this first: 
```
docker-compose down --volumes
```

And run the project:
```
docker-compose up --build
```

Seed your database with the provided script. Before running, you will need to set environment variables for all of the user secrets, which can be found in the secrets channel.
```
./seed_db.sh
```

If there are no tables in the DB, go into `/backend/python/app/models/__init__.py` and change the `erase_db_and_sync = False` to True, allow the hot reload to build, and change it back to `False`. Try to seed the database again.

# Test
Backend test run using the `pytest` framework on a distinct test database. You may need to rebuild if this is your first time running pytest. The following utils are available for testing:
```
# Run all tests
./utils.sh pytest

# Run all tests in a file
./utils.sh pytest app/tests/<path/to/file.py>

# Run all tests in a file matching a name pattern
./utils.sh pytest app/tests/<path/to/file.py> <name pattern>
```

If you want to run any other pytest commands, run them manually with:
```
docker exec -it planet-read_py-backend_1 /bin/bash <pytest command>
```

# Lint
Frontend has on-save linting. To lint the backend:
```
docker exec -it planet-read_py-backend_1 /bin/bash -c "black . && isort --profile black ."
```

Follow the [getting started](https://uwblueprint.github.io/starter-code-v2/docs/getting-started) for more details, especially if you desire to use your own firebase and gcp projects.

Happy hacking! 💻🚀