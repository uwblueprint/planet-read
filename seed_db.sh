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

if [[ "$1" = "erase" ]]
then 
    echo "Erasing the database..."

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "DELETE FROM story_translations;"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "DELETE FROM users;"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "DELETE FROM stories;"

    echo "Erased the database 💥💥💥"

elif [[ "$1" = "kevin" ]]
then 
    
    if [ -z "$AUTH_ID_1" ] 
    then 
        echo "ERROR: \$AUTH_ID is empty. Please set the value to the one posted in the secrets channel." 
        exit 1
    fi 

    echo "Generating data exposing the corruption, scandal, and graft of Kevin..."

    # users 
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE users_id_seq RESTART WITH 1;"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Carl', 'Sagan', '$AUTH_ID_1', 'User', '{\"ENGLISH_US\":4}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Miroslav', 'Klose', '$AUTH_ID_2', 'User', '{\"POLISH\":4, \"GERMAN\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Kevin', 'De Bryune', '$AUTH_ID_3', 'User', '{\"DUTCH\":4, \"FRENCH\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Dwight', 'D. Eisenhower', '$AUTH_ID_4', 'User', '{\"ENGLISH_US\":1}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Alexander', 'Hamilton', '$AUTH_ID_5', 'User', '{\"ENGLISH_US\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Angela', 'Merkel', '$AUTH_ID_6', 'Admin', '{\"GERMAN\":2}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Richard', 'Feynman', '$AUTH_ID_7', 'User', '{\"PORTUGESE\":3}');"

    # stories 
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE stories_id_seq RESTART WITH 1;"
    
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Burns Coal to Create Smog', 'He wants to test out the HEPA filter in the new Tesla he got for his birthday', 'https://www.youtube.com/watch?v=pP44EPBMb8A', 4, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Drives Dolphin Species to Extinction', 'He said dolphin looked at him funny', 'https://www.youtube.com/watch?v=ouAccsTzlGU', 2, '{\"ARABIC\", \"SWAHILI\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Complains About Taxes', 'He wants buy a new 180 foot yacht', 'https://www.youtube.com/watch?v=PaErPyEnDvk', 3, '{\"MANDARIN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Burns Down Old Growth Forest', 'Aims to expand cow pasture for his A5 Wagyu cattle', 'https://www.youtube.com/watch?v=udFxKZRyQt4', 2, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin, When Told that Peasants Have No Bread, Responds:', 'Let them eat cake', 'https://www.youtube.com/watch?v=y8XvQNt26KI', 4, '{\"GERMAN\", \"ENGLISH_UK\", \"PORTUGUESE\", \"DUTCH\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Four Score and Seven Years Ago', 'Conceived in liberty and dedicated to the proposition that all men are created equal', 'https://www.youtube.com/watch?v=QImCld9YubE', 4, '{\"ENGLISH_US\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Kevin Lobbies Against Expansion of Social Safety Net', 'He complains higher taxes will prevent him from getting a new Gulfstream G650ER for Christmas', 'https://www.youtube.com/watch?v=t8IK0ZqfxNI&t=27s', 1, '{}');"
    
    # story_translations
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'GERMAN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'ENGLISH_UK', 'REVIEW', 3);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'ARABIC', 'REVIEW', 2);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'SWAHILI', 'REVIEW', 3);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'MANDARIN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'ENGLISH_UK', 'START', 4);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'GERMAN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'ENGLISH_UK', 'START', 7);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'GERMAN', 'START', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'ENGLISH_UK', 'START', 2);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'PORTUGUESE', 'START', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'DUTCH', 'START', 4);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'ENGLISH_US', 'START', 3);"

    echo "A small snippet of Kevin's crimes have been exposed. 🤑🤑🤑"

else
    if [ -z "$AUTH_ID_1" ] 
    then 
        echo "ERROR: \$AUTH_ID is empty. Please set the value to the one posted in the secrets channel." 
        exit 1
    fi 

    echo "Generating data..." 

    # users
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE users_id_seq RESTART WITH 1;"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Carl', 'Sagan', '$AUTH_ID_1', 'User', '{\"ENGLISH_US\":4}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Miroslav', 'Klose', '$AUTH_ID_2', 'User', '{\"POLISH\":4, \"GERMAN\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Kevin', 'De Bryune', '$AUTH_ID_3', 'User', '{\"DUTCH\":4, \"FRENCH\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Dwight', 'D. Eisenhower', '$AUTH_ID_4', 'User', '{\"ENGLISH_US\":1}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Alexander', 'Hamilton', '$AUTH_ID_5', 'User', '{\"ENGLISH_US\":3}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Angela', 'Merkel', '$AUTH_ID_6', 'Admin', '{\"GERMAN\":2}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO users (first_name, last_name, auth_id, role, approved_languages) VALUES ('Richard', 'Feynman', '$AUTH_ID_7', 'User', '{\"PORTUGESE\":3}');"

    # stories 
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "ALTER SEQUENCE stories_id_seq RESTART WITH 1;"
    
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('East of Eden', 'John Steinbeck', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 4, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('War and Peace', 'Leo Tolstoy', 'https://www.youtube.com/watch?v=Da-2h2B4faU&t=4s', 420, '{\"ARABIC\", \"SWAHILI\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('A Tale of Two Cities', 'Charles Dickens', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 3, '{\"MANDARIN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('Pride and Prejudice', 'Jane Austen', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 7, '{\"GERMAN\", \"ENGLISH_UK\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('To Kill a Mockingbird', 'Harper Lee', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 4, '{\"GERMAN\", \"ENGLISH_UK\", \"PORTUGUESE\", \"DUTCH\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 4, '{\"ENGLISH_US\"}');"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO stories (title, description, youtube_link, level, translated_languages) VALUES ('1984', 'George Orwell', 'https://www.youtube.com/watch?v=Da-2h2B4faU&t=4s', 1, '{}');"
    
    # story_translations
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'GERMAN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (1, 'ENGLISH_UK', 'REVIEW', 3);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'ARABIC', 'REVIEW', 2);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (2, 'SWAHILI', 'REVIEW', 3);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'MANDARIN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (3, 'ENGLISH_UK', 'START', 4);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'GERMAN', 'REVIEW', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (4, 'ENGLISH_UK', 'START', 7);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'GERMAN', 'START', 1);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'ENGLISH_UK', 'START', 2);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'PORTUGUESE', 'START', 3);"
    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (5, 'DUTCH', 'START', 4);"

    docker exec -it planet-read_db_1 psql -U postgres -d planet-read -c "INSERT INTO story_translations (story_id, language, stage, translator_id) VALUES (6, 'ENGLISH_US', 'START', 3);"
    
    echo "Database seeded 🌱->🌳->🍊"

fi 
 