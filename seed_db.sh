# ***** How to Use: *****
# For now, you will need to set the secret variables $AUTH_ID_* in your own shell.
# The values of these variables can be found in the secret channel. 
# Working to add these to vault and, in a future update, you won't need to set these variables manually. 
# 
# In the directory of the script, call: 
# ** Replace '123' with auth_ids posted in the secrets channel 
# 
# 1) 
# export AUTH_ID_1=123 && \ 
# export AUTH_ID_2=123 && \ 
# export AUTH_ID_3=123 && \ 
# export AUTH_ID_4=123 && \ 
# export AUTH_ID_5=123 && \ 
# export AUTH_ID_6=123 && \ 
# export AUTH_ID_7=123 \ 
# 
# 2) 
# ./seed_db.sh [OPTION] 
#
# [OPTIONS]: 
#   erase - erases the contents of the database. To avoid conflicting entries, 
#           please call this to erase the contents of the db. Note that this 
#           will erase all of the contents in the story_translations, users, 
#           stories, story_contents, and story_translation_contents databases. 
# 
#   kevin - generates story contents that, to say the least, are probably 
#           not NGO-friendly. Please use this option cautiously. 
#
# ** Debugging Tips ** 
# 1) If you run into an issue running this script, try to toggle your shell line endings between CRLF and LF.
# These change the formatting of whitespace and endline characters which, if left in the wrong format, 
# may cause runtime issues. 
# This can be done directly through IDEs like VSCode; the toggle option is in the bottom right corner. 
# 
# 2) If you are encountering issues with inserting duplicate elements into a database, call: 
# ./seed_db.sh erase 
# which will clear the databases. 
# 

if [[ "$1" = "erase" ]]
then 
    echo "Erasing the database..."


    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; DELETE FROM story_translation_contents;"
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; DELETE FROM story_contents;"
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; DELETE FROM story_translations;"
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; DELETE FROM users;"
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; DELETE FROM stories;"


    echo "Erased the database 💥💥💥"
else
    if [ -z "$AUTH_ID_1" ] || [ -z "$AUTH_ID_2" ] || [ -z "$AUTH_ID_3" ] || [ -z "$AUTH_ID_4" ] || [ -z "$AUTH_ID_5" ] || [ -z "$AUTH_ID_6" ] || [ -z "$AUTH_ID_7" ] 
    then 
        echo "ERROR: \$AUTH_ID_* is empty. Please set the value to the one posted in the secrets channel." 
        exit 1
    fi 

    
    if  [[ "$1" = "kevin" ]] 
    then 
        echo "Generating data exposing the corruption, scandal, and graft of Kevin..."
    else 
        echo "Generating data..." 
    fi 
    

    # users 
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; ALTER TABLE users AUTO_INCREMENT = 1;"

    docker exec -it planet-read_db_1 mysql -u root -proot -e "
        USE planet-read; 
        INSERT INTO users 
            (first_name, last_name, auth_id, role, approved_languages) 
        VALUES 
            ('Carl', 'Sagan', '$AUTH_ID_1', 'User', '{\"ENGLISH_US\":4}'),
            ('Miroslav', 'Klose', '$AUTH_ID_2', 'User', '{\"POLISH\":4, \"GERMAN\":4}'),
            ('Kevin', 'De Bryune', '$AUTH_ID_3', 'User', '{\"DUTCH\":4, \"FRENCH\":4}'),
            ('Dwight', 'D. Eisenhower', '$AUTH_ID_4', 'User', '{\"ENGLISH_UK\":4}'), 
            ('Alexander', 'Hamilton', '$AUTH_ID_5', 'User', '{\"MANDARIN\":4}'), 
            ('Angela', 'Merkel', '$AUTH_ID_6', 'Admin', '{\"GERMAN\":4}'), 
            ('Richard', 'Feynman', '$AUTH_ID_7', 'User', '{\"PORTUGESE\":4}');
    "

    echo "Finished generating users..." 

    if  [[ "$1" = "kevin" ]] 
    then 
        # stories 
        docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; ALTER TABLE stories AUTO_INCREMENT = 1;"
        
        docker exec -it planet-read_db_1 mysql -u root -proot -e "
            USE planet-read; 
            INSERT INTO stories 
                (title, description, youtube_link, level, translated_languages) 
            VALUES 
                ('Kevin Burns Coal to Create Smog', 'He wants to test out the HEPA filter in the new Tesla he got for his birthday', 'https://www.youtube.com/watch?v=pP44EPBMb8A', 4, '[\"GERMAN\", \"ENGLISH_UK\"]'),
                ('Kevin Drives Dolphin Species to Extinction', 'He said dolphin looked at him funny', 'https://www.youtube.com/watch?v=ouAccsTzlGU', 2, '[\"GERMAN\", \"POLISH\"]'),
                ('Kevin Complains About the Inheritance Tax', 'He thinks it is unfair for the government to take his hard-earned money', 'https://www.youtube.com/watch?v=PaErPyEnDvk', 3, '[\"MANDARIN\", \"ENGLISH_UK\"]'),
                ('Kevin Burns Down Old Growth Forest', 'Aims to expand cow pasture for his A5 Wagyu cattle', 'https://www.youtube.com/watch?v=udFxKZRyQt4', 2, '[\"GERMAN\", \"ENGLISH_UK\"]'),
                ('Kevin, When Told that Peasants Have No Bread, Responds:', 'Let them eat cake', 'https://www.youtube.com/watch?v=y8XvQNt26KI', 4, '[\"GERMAN\", \"ENGLISH_UK\", \"PORTUGUESE\", \"DUTCH\"]'),
                ('Kevin Funds Study Discrediting the Science behind Climate Change', 'Seeks to protect his business interests in Exxon Mobil', 'https://www.youtube.com/watch?v=QImCld9YubE', 4, '[\"ENGLISH_US\"]'),
                ('Kevin Lobbies Against Expansion of Social Safety Net', 'He complains higher taxes will prevent him from getting a new Gulfstream G650ER for Christmas', 'https://www.youtube.com/watch?v=t8IK0ZqfxNI&t=27s', 2, '[]');
        "

    else 
        # stories 
        docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; ALTER TABLE stories AUTO_INCREMENT = 1;"
        
        docker exec -it planet-read_db_1 mysql -u root -proot -e "
            USE planet-read; 
            INSERT INTO stories 
                (title, description, youtube_link, level, translated_languages) 
            VALUES 
                ('East of Eden', 'John Steinbeck', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 4, '[\"GERMAN\", \"ENGLISH_UK\"]'),
                ('War and Peace', 'Leo Tolstoy', 'https://www.youtube.com/watch?v=Da-2h2B4faU&t=4s', 1, '[\"GERMAN\", \"POLISH\"]'),
                ('A Tale of Two Cities', 'Charles Dickens', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 3, '[\"MANDARIN\", \"ENGLISH_UK\"]'),
                ('Pride and Prejudice', 'Jane Austen', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 4, '[\"GERMAN\", \"ENGLISH_UK\"]'),
                ('To Kill a Mockingbird', 'Harper Lee', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 3, '[\"GERMAN\", \"ENGLISH_UK\", \"PORTUGUESE\", \"DUTCH\"]'),
                ('The Great Gatsby', 'F. Scott Fitzgerald', 'https://www.youtube.com/watch?v=DHyUYg8X31c', 4, '[\"ENGLISH_US\"]'),
                ('1984', 'George Orwell', 'https://www.youtube.com/watch?v=Da-2h2B4faU&t=4s', 2, '[]');
        "

    fi 

    echo "Finished generating stories..." 

    # story_translations
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; ALTER TABLE story_translations AUTO_INCREMENT = 1;"

    docker exec -it planet-read_db_1 mysql -u root -proot -e "
        USE planet-read; 
        INSERT INTO story_translations 
            (story_id, language, stage, translator_id) 
        VALUES 
            (1, 'GERMAN', 'TRANSLATE', 6),
            (1, 'ENGLISH_UK', 'TRANSLATE', 4),
            (2, 'GERMAN', 'TRANSLATE', 2),
            (2, 'POLISH', 'TRANSLATE', 2),
            (3, 'MANDARIN', 'TRANSLATE', 5),
            (3, 'ENGLISH_UK', 'TRANSLATE', 4),
            (4, 'GERMAN', 'TRANSLATE', 6),
            (4, 'ENGLISH_UK', 'TRANSLATE', 4),
            (5, 'GERMAN', 'TRANSLATE', 2),
            (5, 'ENGLISH_UK', 'TRANSLATE', 1),
            (5, 'PORTUGUESE', 'TRANSLATE', 7),
            (5, 'DUTCH', 'TRANSLATE', 3),
            (6, 'ENGLISH_US', 'TRANSLATE', 1);
    "
    echo "Finished generating story translations..." 
    
    # Story content 
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; ALTER TABLE story_contents AUTO_INCREMENT = 1;"

    for STORY_ID in 1 2 3 4 5 6 7
    do 
        docker exec -it planet-read_db_1 mysql -u root -proot -e "
        USE planet-read; 
        INSERT INTO story_contents 
            (story_id, line_index, content) 
        VALUES 
            ('$STORY_ID', 0, '\"Every two weeks I went to a meeting with them, and in my room here I covered pages with writing. I bought every known Hebrew dictionary. But the old gentlemen were always ahead of me. It wasn\'t long before they were ahead of our rabbi; he brought a colleague in. '),
            ('$STORY_ID', 1, 'Mr. Hamilton, you should have sat through some of those nights of argument and discussion. The questions, the inspection, oh, the lovely thinking-the beautiful thinking.'),
            ('$STORY_ID', 2, 'After two years we felt that we could approach your sixteen verses of the fourth chapter of Genesis. '),
            ('$STORY_ID', 3, 'My old gentlemen felt that these words were very important too-\'Thou shalt\' and \'Do thou.\' And this was the gold from our mining: \'Thou mayest.\' \'Thou mayest rule over sin.\' '),
            ('$STORY_ID', 4, 'The old gentlemen smiled and nodded and felt the years were well spent. It brought them out of their Chinese shells too, and right now they are studying Greek.\" '),
            ('$STORY_ID', 5, 'Samuel said, \"It\'s a fantastic story. And I\'ve tried to follow and maybe I\'ve missed somewhere. Why is this word so important?\"'),
            ('$STORY_ID', 6, 'Lee\'s hand shook as he filled the delicate cups. He drank his down in one gulp. \"Don\'t you see?\" he cried. '),
            ('$STORY_ID', 7, '\"The American Standard translation orders men to triumph over sin, and you can call sin ignorance. '),
            ('$STORY_ID', 8, 'The King James translation makes a promise in \'Thou shalt,\' meaning that men will surely triumph over sin. '),
            ('$STORY_ID', 9, 'But the Hebrew word, the word timshel-\'Thou mayest\'-that gives a choice. It might be the most important word in the world. That says the way is open. That throws it right back on a man. For if \'Thou mayest\'-it is also true that \'Thou mayest not.\' Don\'t you see?\"');
        "
    done 
    
    echo "Finished generating story contents..." 

    # Story translation content 
    docker exec -it planet-read_db_1 mysql -u root -proot -e "USE planet-read; ALTER TABLE story_translation_contents AUTO_INCREMENT = 1;"

    for STORY_TRANSLATION_ID in 2 3 5 7 11 13 
    do 
        docker exec -it planet-read_db_1 mysql -u root -proot -e "
        USE planet-read; 
        INSERT INTO story_translation_contents 
            (story_translation_id, line_index, translation_content) 
        VALUES 
            ('$STORY_TRANSLATION_ID', 0, '\"Every two weeks I went to a meeting with them, and in my room here I covered pages with writing. I bought every known Hebrew dictionary. But the old gentlemen were always ahead of me. It wasn\'t long before they were ahead of our rabbi; he brought a colleague in. '),
            ('$STORY_TRANSLATION_ID', 1, 'Mr. Hamilton, you should have sat through some of those nights of argument and discussion. The questions, the inspection, oh, the lovely thinking-the beautiful thinking.'),
            ('$STORY_TRANSLATION_ID', 2, 'After two years we felt that we could approach your sixteen verses of the fourth chapter of Genesis. '),
            ('$STORY_TRANSLATION_ID', 3, 'My old gentlemen felt that these words were very important too-\'Thou shalt\' and \'Do thou.\' And this was the gold from our mining: \'Thou mayest.\' \'Thou mayest rule over sin.\' '),
            ('$STORY_TRANSLATION_ID', 4, 'The old gentlemen smiled and nodded and felt the years were well spent. It brought them out of their Chinese shells too, and right now they are studying Greek.\" '),
            ('$STORY_TRANSLATION_ID', 5, 'Samuel said, \"It\'s a fantastic story. And I\'ve tried to follow and maybe I\'ve missed somewhere. Why is this word so important?\"'),
            ('$STORY_TRANSLATION_ID', 6, 'Lee\'s hand shook as he filled the delicate cups. He drank his down in one gulp. \"Don\'t you see?\" he cried. '),
            ('$STORY_TRANSLATION_ID', 7, '\"The American Standard translation orders men to triumph over sin, and you can call sin ignorance. '),
            ('$STORY_TRANSLATION_ID', 8, 'The King James translation makes a promise in \'Thou shalt,\' meaning that men will surely triumph over sin. '),
            ('$STORY_TRANSLATION_ID', 9, 'But the Hebrew word, the word timshel-\'Thou mayest\'-that gives a choice. It might be the most important word in the world. That says the way is open. That throws it right back on a man. For if \'Thou mayest\'-it is also true that \'Thou mayest not.\' Don\'t you see?\"');
        "
    done 

    for STORY_TRANSLATION_ID in 1 4 6 8 9 10  
    do 
        docker exec -it planet-read_db_1 mysql -u root -proot -e "
            USE planet-read; 
            INSERT INTO story_translation_contents 
                (story_translation_id, line_index, translation_content) 
            VALUES 
                ('$STORY_TRANSLATION_ID', 0, ''),
                ('$STORY_TRANSLATION_ID', 1, ''),
                ('$STORY_TRANSLATION_ID', 2, ''),
                ('$STORY_TRANSLATION_ID', 3, ''),
                ('$STORY_TRANSLATION_ID', 4, ''),
                ('$STORY_TRANSLATION_ID', 5, ''),
                ('$STORY_TRANSLATION_ID', 6, ''),
                ('$STORY_TRANSLATION_ID', 7, ''),
                ('$STORY_TRANSLATION_ID', 8, ''),
                ('$STORY_TRANSLATION_ID', 9, '');
        "

    done 

    for STORY_TRANSLATION_ID in 12 
    do 
        docker exec -it planet-read_db_1 mysql -u root -proot -e "
            USE planet-read; 
            INSERT INTO story_translation_contents 
                (story_translation_id, line_index, translation_content) 
            VALUES 
                ('$STORY_TRANSLATION_ID', 0, ''),
                ('$STORY_TRANSLATION_ID', 1, ''),
                ('$STORY_TRANSLATION_ID', 2, ''),
                ('$STORY_TRANSLATION_ID', 3, ''),
                ('$STORY_TRANSLATION_ID', 4, ''),
                ('$STORY_TRANSLATION_ID', 5, ''),
                ('$STORY_TRANSLATION_ID', 6, ''),
                ('$STORY_TRANSLATION_ID', 7, ''),
                ('$STORY_TRANSLATION_ID', 8, ''),
                ('$STORY_TRANSLATION_ID', 9, 'But the Hebrew word, the word timshel-\'Thou mayest\'-that gives a choice. It might be the most important word in the world. That says the way is open. That throws it right back on a man. For if \'Thou mayest\'-it is also true that \'Thou mayest not.\' Don\'t you see?\"');
        "
    done 

    echo "Finished generating story translation contents..." 

    if  [[ "$1" = "kevin" ]] 
    then 
        echo "A small snippet of Kevin's crimes have been exposed. 🤑🤑🤑"
    else 
        echo "Database seeded 🌱->🌳->🍊"
    fi 
fi