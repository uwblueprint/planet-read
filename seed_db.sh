# ***** How to Use: *****
# For now, you will need to set the two secret variables $USER_AUTH_ID and $ADMIN_AUTH_ID in your own shell.
# The values of these variables can be found in the secret channel. 
# Working to add these to vault and, in a future update, you won't need to set these variables manually. 
# 
# In the directory of the script, call ./seed_db.sh [OPTION] 
#
# [OPTIONS]: 
#   erase - erases the contents of the database. To avoid conflicting entries, 
#           please call this to erase the contents of the db. Note that this 
#           will erase all of the contents in the story_translations, users, 
#           and stories databases. 
# 
#   kevin - generates story contents that, to say the least, are probably 
#           not NGO-friendly. Please use this option cautiously. 



if [ -z "$USER_AUTH_ID" ] 
then 
    echo "Warning: \$USER_AUTH_ID is empty. Please set the value to the one posted in the secrets channel." 
fi 

if [ -z "$ADMIN_AUTH_ID" ] 
then 
    echo "Warning: \$ADMIN_AUTH_ID is empty. Please set the value to the one posted in the secrets channel." 
fi 

if [[ "$1" = "erase" ]]
then 
    echo "Erasing the database..."

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "DELETE FROM story_translations;"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "DELETE FROM users;"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "DELETE FROM stories;"

    echo "Erased the database 💥💥💥"

elif [[ "$1" = "kevin" ]]
then 
    echo "Generating data exposing the corruption, scandal, and graft of Kevin..."

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE users_id_seq RESTART WITH 1;"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Carl', 'Sagan', '$USER_AUTH_ID', 'User', '{\"ENGLISH_US\":5}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Miroslav', 'Klose', '$USER_AUTH_ID', 'User', '{\"POLISH\":5, \"GERMAN\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Kevin', 'De Bryune', '$USER_AUTH_ID', 'User', '{\"DUTCH\":5, \"FRENCH\":6}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Dwight', 'D. Eisenhower', '$USER_AUTH_ID', 'User', '{\"ENGLISH\":10}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Alexander', 'Hamilton', '$USER_AUTH_ID', 'User', '{\"ENGLISH\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Angela', 'Merkel', '$ADMIN_AUTH_ID', 'Admin', '{\"GERMAN\":10}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Richard', 'Feynman', '$USER_AUTH_ID', 'User', '{\"PORTUGESE\":3}');"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE stories_id_seq RESTART WITH 1;"
    
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Burns Coal to Create Smog', 'He wants to test out the HEPA filter in the new Tesla he got for his birthday', 'link', 4, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Drives Dolphin Species to Extinction', 'He said dolphin looked at him funny', 'link', 420, '{\"ARABIC\", \"SWAHILI\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Complains About Taxes', 'He wants buy a new 180 foot yacht', 'link', 3, '{\"MANDARIN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Burns Down Old Growth Forest', 'Aims to expand cow pasture for his A5 Wagyu cattle', 'link', 7, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin, When Told that Peasants Have No Bread, Responds:', 'Let them eat cake', 'link', 4, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Four Score and Seven Years Ago', 'Conceived in liberty and dedicated to the proposition that all men are created equal', 'link', 4, '{\"ENGLISH_US\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Lobbies Against Expansion of Social Safety Net', 'He complains higher taxes will prevent him from getting a new Gulfstream G650ER for Christmas', 'link', 1, '{}');"
    
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'FRENCH', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'ARABIC', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'ARABIC', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'GERMAN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'ENGLISH_US', 'START', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'RUSSIAN', 'PUBLISH', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (7, 'ARABIC', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'MANDARIN', 'REVIEW', 6);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'ARABIC', 'REVIEW', 6);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'ENGLISH_UK', 'REVIEW', 6);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'SWAHILI', 'REVIEW', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'MANDARIN', 'START', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'GERMAN', 'PUBLISH', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (7, 'MANDARIN', 'REVIEW', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'NORWEGIAN', 'REVIEW', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'NORWEGIAN', 'REVIEW', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'NORWEGIAN', 'REVIEW', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'NORWEGIAN', 'REVIEW', 5);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'NORWEGIAN', 'START', 5);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'NORWEGIAN', 'PUBLISH', 5);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (7, 'NORWEGIAN', 'REVIEW', 5);"

    echo "A small snippet of Kevin's crimes have been exposed. 🤑🤑🤑"

else
    echo "Generating data..." 

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE users_id_seq RESTART WITH 1;"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Carl', 'Sagan', '$USER_AUTH_ID', 'User', '{\"ENGLISH_US\":5}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Miroslav', 'Klose', '$USER_AUTH_ID', 'User', '{\"POLISH\":5, \"GERMAN\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Kevin', 'De Bryune', '$USER_AUTH_ID', 'User', '{\"DUTCH\":5, \"FRENCH\":6}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Dwight', 'D. Eisenhower', '$USER_AUTH_ID', 'User', '{\"ENGLISH_US\":10}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Alexander', 'Hamilton', '$USER_AUTH_ID', 'User', '{\"ENGLISH_US\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Angela', 'Merkel', '$ADMIN_AUTH_ID', 'Admin', '{\"GERMAN\":10}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Richard', 'Feynman', '$USER_AUTH_ID', 'User', '{\"PORTUGESE\":3}');"


    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE stories_id_seq RESTART WITH 1;"
    
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('East of Eden', 'John Steinbeck', 'link', 4, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('War and Peace', 'Leo Tolstoy', 'link', 420, '{\"ARABIC\", \"SWAHILI\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('A Tale of Two Cities', 'Charles Dickens', 'link', 3, '{\"MANDARIN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Pride and Prejudice', 'Jane Austen', 'link', 7, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('To Kill a Mockingbird', 'Harper Lee', 'link', 4, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 'link', 4, '{\"ENGLISH_US\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('1984', 'George Orwell', 'link', 1, '{}');"
    
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'FRENCH', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'ARABIC', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'ARABIC', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'GERMAN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'ENGLISH_US', 'START', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'RUSSIAN', 'PUBLISH', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (7, 'ARABIC', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'MANDARIN', 'REVIEW', 6);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'ARABIC', 'REVIEW', 6);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'ENGLISH_UK', 'REVIEW', 6);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'SWAHILI', 'REVIEW', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'MANDARIN', 'START', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'GERMAN', 'PUBLISH', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (7, 'MANDARIN', 'REVIEW', 7);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'NORWEGIAN', 'REVIEW', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'NORWEGIAN', 'REVIEW', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'NORWEGIAN', 'REVIEW', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'NORWEGIAN', 'REVIEW', 5);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'NORWEGIAN', 'START', 5);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'NORWEGIAN', 'PUBLISH', 5);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (7, 'NORWEGIAN', 'REVIEW', 5);"

    echo "Database seeded 🌱->🌳->🍊"

fi 
 