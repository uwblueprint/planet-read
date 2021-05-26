# 🌏 Planet Read

🐘 Postgres + 🐍 Flask story translation platform.  

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
Don't forget to seed your database with a firebase user: 
```
docker ps
docker exec -it <db-container-id> /bin/bash
psql -U postgres -d planet-read
INSERT INTO users (first_name, last_name, auth_id, role) VALUES ('First', 'Last', 'insert-firebase-uid', 'Admin');
```

If there are no tables in the DB, go into `/backend/python/app/models/__init__.py` and change the `erase_db_and_sync = False` to True, allow the hot reload to build, and change it back to `False`. Try to seed the database with a user again.

Follow the [getting started](https://uwblueprint.github.io/starter-code-v2/docs/getting-started) for more details, especially if you desire to use your own firebase and gcp projects.

Happy hacking! 💻🚀