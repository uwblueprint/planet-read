from flask_sqlalchemy import SQLAlchemy

from app import create_app

db = SQLAlchemy()

import csv
import json
import random
import string

import requests

query = """
    mutation SignUp($firstName: String!, $lastName: String!, $email: String!, $password: String!) 
        {
            signup(
                firstName: $firstName
                lastName: $lastName
                email: $email
                password: $password
            ) 
            {
                id
                firstName
                lastName
                email
                role
                accessToken
                refreshToken
            }
        }
"""

app = create_app("development")
# To generate file, Use the linked google sheet document, File > Download > tsv
with open("tools/seed_users.tsv", newline="") as csvfile:
    spamreader = csv.reader(csvfile, delimiter="\t")
    for i, row in enumerate(spamreader):
        if i == 0:
            continue
        fname, lname, email, role, appr_trans, appr_rev = row
        user_id = None
        # create firebase + database user via signup mutation
        temp = random.sample(string.ascii_lowercase, 10)
        password = "".join(temp)
        variables = {
            "firstName": fname,
            "lastName": lname,
            "email": email,
            "password": password,
        }
        url = "http://localhost:5000/graphql"
        r = requests.post(url, json={"query": query, "variables": variables})
        json_data = json.loads(r.text)
        user_id = json_data["data"]["signup"]["id"]
        # correct database user information
        # update approved languages and role
        if appr_trans:
            db.engine.execute(
                f"UPDATE users \
                SET  \
                    role = '{role}', approved_languages_translation= '{appr_trans}'\
                WHERE \
                    id='{user_id}'; \
            "
            )
        if appr_rev:
            db.engine.execute(
                f"UPDATE users \
                SET  \
                    role = '{role}', approved_languages_review = '{appr_rev}'\
                WHERE \
                    id='{user_id}'; \
            "
            )
