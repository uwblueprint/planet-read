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

This will take down the database and all it's data too.
If you don't need to rebuild packages between switching branches, you probably don't _need_ `--volumes`.

To run the project:

```
docker-compose up
```

If it's your first time running the project, or there's new packages since your last build:

```
docker-compose up --build
```

To create tables in the DB, run

```
docker exec -it planet-read_py-backend_1 /bin/bash -c "flask db upgrade"
```

Insert test data into the database with the provided script. Your environment variables need to be correctly configured in `.env`

```
docker exec -it planet-read_py-backend_1 /bin/bash -c "python -m tools.insert_test_data"
```

# Lint

Frontend has on-save linting. To lint the backend:

```
docker exec -it planet-read_py-backend_1 /bin/bash -c "black . && isort --profile black ."
```

# Database + Migrations

## Access the Database

To access the database:

```
docker exec -it planet-read_db_1 /bin/bash -c "mysql -u root -proot"
use planet-read;
```

For specific db commands,

```
docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; SELECT * FROM users;"
```

## Migrations

We are currently using Flask-Migrate to handle our database migrations. To update your database, run:

```
docker exec -it planet-read_py-backend_1 /bin/bash -c "flask db upgrade"
```

To reset your database, run:

```
docker exec -it planet-read_py-backend_1 /bin/bash -c "flask db downgrade"
```

A new migration will need to be generated when database changes are made. Import any new tables into [backend/python/app/models/\_\_init\_\_.py](backend/python/app/models/__init__.py) and run:

```
docker exec -it planet-read_py-backend_1 /bin/bash -c "flask db migrate -m '<description of your migration>'"
```

Ensure that a new revision file is created in the directory [backend/python/migrations/versions](backend/python/migrations/versions). **Do not** change the alembic revision/identifiers. Generally these auto-generated revision files will encompass all schema changes, and thus do not need to be modified!

# Test

Backend test run using the `pytest` framework on a distinct test database. The following utils are available for testing:

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

## Writing Tests

If you're writing some test, make sure to apply migrations to your test db first! you can do this by temporarily hardcoding the DB host to `TEST_DB_HOST` in `app/__init__.py`, then run `flask db upgrade` in the backend container as usual.

```
app/__init__.py
...
 app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = "mysql://{username}:{password}@{host}:3306/{db}".format(
        username=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        host=os.getenv("TEST_DB_HOST"),
        # if config_name == "testing"
        # else os.getenv("DB_HOST"),
        db=os.getenv("MYSQL_DATABASE"),
    )
...
```

# Staging Deployment

Main branch Frontend deployment: https://planet-read-uwbp.web.app/
Main branch Backend deployment: https://uwbp-planet-read-preview.herokuapp.com/

We maintain firebase and a heroku deployment for frontend & backend.

The heroku app is the backend at the head of the main branch. The database is rebuilt and filled with `insert_test_data.py` data on each deployment.

Each pr has it's own firebase deployment. Each deployment points to the same heroku app at master, so frontend pr deployment links with any backend changes should be used with caution.

# Production Deployment

Code is pushed to the server on each new release. Releases should be tagged as `v1.X.Y`, where X=major version (e.g. after each sprint), and Y=minor version (e.g. for a patch or hotfix). To create a new release:

1. Follow [this link](https://github.com/uwblueprint/planet-read/releases/new) to create a new release
2. Create a new tag based on the major minor versioning scheme above (i.e. `v1.X.Y`). Ensure the target branch is set to `main`
3. Enter the release title: `v1.X.Y`
4. In the description, highlight key features/tickets included in the release, and click the button to `Auto-generate release notes`
5. Click `Publish Release` and verify the CircleCI deploy job passes!

You can view all releases [here](https://github.com/uwblueprint/planet-read/releases), and all tags [here](https://github.com/uwblueprint/planet-read/tags).

# Other

Follow the [getting started](https://uwblueprint.github.io/starter-code-v2/docs/getting-started) for more details, especially if you desire to use your own firebase and gcp projects.

Happy hacking! 💻🚀
