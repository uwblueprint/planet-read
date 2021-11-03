import os
import sys

from flask_sqlalchemy import SQLAlchemy

from app import create_app

db = SQLAlchemy()

from app.models.comment_all import CommentAll
from app.models.story import Story
from app.models.story_content import StoryContent
from app.models.story_translation import StoryTranslation
from app.models.story_translation_all import StoryTranslationAll
from app.models.story_translation_content import StoryTranslationContent
from app.models.story_translation_content_all import StoryTranslationContentAll
from app.models.user_all import UserAll


def insert_test_data():
    # users
    db.engine.execute("ALTER TABLE users_all AUTO_INCREMENT = 1;")
    db.engine.execute(
        f"INSERT IGNORE INTO users \
            (first_name, last_name, email, auth_id, role, approved_languages_translation, approved_languages_review) \
        VALUES \
            ('Carl', 'Sagan', 'planetread+carlsagan@uwblueprint.org', '{os.getenv('AUTH_ID_1', '')}', 'User', '{{\"ENGLISH_US\":4, \"ENGLISH_UK\":3}}', NULL), \
            ('Miroslav', 'Klose', 'planetread+miroslavklose@uwblueprint.org', '{os.getenv('AUTH_ID_2', '')}', 'User', '{{\"POLISH\":4, \"GERMAN\":4}}', '{{\"POLISH\":3}}'), \
            ('Kevin', 'De Bruyne', 'planetread+kevindebruyne@uwblueprint.org', '{os.getenv('AUTH_ID_3', '')}', 'User', '{{\"DUTCH\":4, \"FRENCH\":4}}', '{{\"DUTCH\":2, \"FRENCH\":4}}'), \
            ('Dwight', 'D. Eisenhower', 'planetread+dwightdeisenhower@uwblueprint.org', '{os.getenv('AUTH_ID_4', '')}', 'User', '{{\"ENGLISH_UK\":4, \"ENGLISH_US\":4, \"GERMAN\":3}}', '{{\"ENGLISH_UK\":3, \"ENGLISH_US\":4}}'), \
            ('Alexander', 'Hamilton', 'planetread+alexanderhamilton@uwblueprint.org', '{os.getenv('AUTH_ID_5', '')}', 'User', '{{\"MANDARIN\":4, \"ENGLISH_UK\":3}}', '{{\"MANDARIN\":2}}'), \
            ('Angela', 'Merkel', 'planetread+angelamerkel@uwblueprint.org', '{os.getenv('AUTH_ID_6', '')}', 'Admin', '{{\"GERMAN\":4}}', '{{\"GERMAN\":4}}'), \
            ('Richard', 'Feynman', 'planetread+richardfeynman@uwblueprint.org', '{os.getenv('AUTH_ID_7', '')}', 'User', '{{\"PORTUGUESE\":4, \"ENGLISH_UK\":4, \"GERMAN\":1}}', '{{\"PORTUGUESE\":1}}'); \
    "
    )

    # stories
    db.engine.execute("ALTER TABLE stories AUTO_INCREMENT = 1;")
    db.engine.execute(
        "INSERT IGNORE INTO stories \
                (id, title, description, youtube_link, level, translated_languages) \
            VALUES \
                (1, 'East of Eden', 'Follow the intertwined destinies of two families whose generations reenact the poisonous rivalry of Cain and Abel.', 'https://www.youtube.com/watch?v=redECmF7wh8', 4, '[\"GERMAN\", \"ENGLISH_UK\"]'), \
                (2, 'War and Peace', 'War and Peace is a literary work mixed with chapters on history and philosophy by the Russian author Leo Tolstoy.', 'https://www.youtube.com/watch?v=4dn7TEjnbPY', 1, '[\"GERMAN\", \"POLISH\"]'), \
                (3, 'A Tale of Two Cities', 'An 1859 historical novel by Charles Dickens, set in London and Paris before and during the French Revolution.', 'https://www.youtube.com/watch?v=5czA_L_eOp4', 3, '[\"MANDARIN\", \"ENGLISH_UK\"]'), \
                (4, 'Pride and Prejudice', 'Pride and Prejudice preaches the difference between superficial goodness and actual goodness.', 'https://www.youtube.com/watch?v=5xTh44G6RYs', 4, '[\"GERMAN\", \"ENGLISH_UK\"]'), \
                (5, 'To Kill a Mockingbird', 'To Kill a Mockingbird is a novel by the American author Harper Lee. A sentence cannot do this novel justice.', 'https://www.youtube.com/watch?v=3xM8hvEE2dI', 3, '[\"GERMAN\", \"ENGLISH_UK\", \"PORTUGUESE\", \"DUTCH\"]'), \
                (6, 'The Great Gatsby', 'Set in the Jazz Age on Long Island, near New York City, the novel depicts mysterious millionaire Jay Gatsby and Gatsby and Daisy Buchanan.', 'https://www.youtube.com/watch?v=e6Iu29TNfkM', 4, '[\"ENGLISH_US\"]'), \
                (7, 'Nineteen Eighty-Four', 'Nineteen Eighty-Four, often referred to as 1984, is a dystopian social science fiction novel by the English novelist George Orwell.', 'https://www.youtube.com/watch?v=h9JIKngJnCU', 2, '[]');"
    )

    generic_content = [
        "Every two weeks I went to a meeting with them, and in my room here I covered pages with writing. I bought every known Hebrew dictionary. But the old gentlemen were always ahead of me. It wasn't long before they were ahead of our rabbi; he brought a colleague in.",
        "Mr. Hamilton, you should have sat through some of those nights of argument and discussion. The questions, the inspection, oh, the lovely thinking-the beautiful thinking.",
        "After two years we felt that we could approach your sixteen verses of the fourth chapter of Genesis. ",
        "My old gentlemen felt that these words were very important too-'Thou shalt' and 'Do thou.' And this was the gold from our mining: 'Thou mayest.' 'Thou mayest rule over sin.' ",
        "The old gentlemen smiled and nodded and felt the years were well spent. It brought them out of their Chinese shells too, and right now they are studying Greek.",
        "Samuel said, 'It's a fantastic story. And I've tried to follow and maybe I've missed somewhere. Why is this word so important?'",
        "Lee's hand shook as he filled the delicate cups. He drank his down in one gulp. 'Don't you see?' he cried. ",
        "The American Standard translation orders men to triumph over sin, and you can call sin ignorance.",
        "The King James translation makes a promise in 'Thou shalt,' meaning that men will surely triumph over sin. ",
        "But the Hebrew word, the word timshel-'Thou mayest'-that gives a choice. It might be the most important word in the world. That says the way is open. That throws it right back on a man. For if 'Thou mayest'-it is also true that 'Thou mayest not.' Don't you see?",
    ]

    # story contents
    db.engine.execute("ALTER TABLE story_contents AUTO_INCREMENT = 1;")
    for story_id in range(1, 8):
        for i, content in enumerate(generic_content):
            id = (story_id - 1) * 10 + i + 1
            db.engine.execute(
                f'INSERT IGNORE INTO story_contents \
                        (id, story_id, line_index, content) \
                    VALUES \
                        ({id}, {story_id}, {i}, "{content}") \
                '
            )

    # story translations
    db.engine.execute("ALTER TABLE story_translations_all AUTO_INCREMENT = 1;")
    db.engine.execute(
        "INSERT IGNORE INTO story_translations \
            (id, story_id, language, stage, translator_id) \
        VALUES \
            (1, 1, 'GERMAN', 'TRANSLATE', 6), \
            (2, 1, 'ENGLISH_UK', 'TRANSLATE', 7), \
            (3, 2, 'GERMAN', 'TRANSLATE', 7), \
            (4, 2, 'POLISH', 'TRANSLATE', 2), \
            (5, 3, 'MANDARIN', 'TRANSLATE', 5), \
            (6, 3, 'ENGLISH_UK', 'TRANSLATE', 5), \
            (7, 4, 'GERMAN', 'TRANSLATE', 2), \
            (8, 4, 'ENGLISH_UK', 'TRANSLATE', 4), \
            (9, 5, 'GERMAN', 'TRANSLATE', 4), \
            (10, 5, 'ENGLISH_UK', 'TRANSLATE', 1), \
            (11, 5, 'PORTUGUESE', 'TRANSLATE', 7), \
            (12, 5, 'DUTCH', 'TRANSLATE', 3), \
            (13, 6, 'ENGLISH_US', 'TRANSLATE', 1);"
    )

    # story translation contents
    db.engine.execute("ALTER TABLE story_translation_contents_all AUTO_INCREMENT = 1;")
    full_translation = [2, 3, 5, 7, 11, 13]
    story_count = 0
    for story_translation_id in full_translation:
        for i, content in enumerate(generic_content):
            id = story_count * 10 + i + 1
            db.engine.execute(
                f'INSERT IGNORE INTO story_translation_contents \
                        (id, story_translation_id, line_index, translation_content) \
                    VALUES \
                        ({id}, {story_translation_id}, {i}, "{content}") \
                '
            )
        story_count += 1

    empty_translation = [1, 4, 6, 8, 9, 10, 12]
    for story_translation_id in empty_translation:
        for line_index in range(10):
            id = story_count * 10 + line_index + 1
            db.engine.execute(
                f'INSERT IGNORE INTO story_translation_contents \
                        (id, story_translation_id, line_index, translation_content) \
                    VALUES \
                        ({id}, {story_translation_id}, {line_index}, "") \
                '
            )
        story_count += 1

    # comments
    # Adding comments to The Great Gatsby (id: 6)
    # Story Translation (id: 13) with
    # Carl (id: 1) and Dwight (id: 4)"
    carl = UserAll.query.filter_by(first_name="Carl").first()
    dwight = UserAll.query.filter_by(first_name="Dwight").first()
    the_gg = Story.query.filter_by(title="The Great Gatsby").first()
    st = (
        db.session.query(StoryTranslation)
        .filter_by(story_id=the_gg.id)
        .filter_by(language="ENGLISH_US")
        .first()
    )
    st.translator_id = carl.id
    st.reviewer_id = dwight.id
    db.session.query(StoryTranslationContent).filter(
        StoryTranslationContent.id.in_([51, 52, 55, 56, 60])
    ).update({StoryTranslationContent.status: "APPROVED"}, synchronize_session="fetch")
    db.session.query(StoryTranslationContent).filter(
        StoryTranslationContent.id.in_([53, 54, 59])
    ).update(
        {StoryTranslationContent.status: "ACTION_REQUIRED"},
        synchronize_session="fetch",
    )
    db.session.commit()
    db.engine.execute("ALTER TABLE comments_all AUTO_INCREMENT = 1;")
    db.engine.execute(
        "INSERT IGNORE INTO comments \
            (id, story_translation_content_id, user_id, comment_index, time, resolved, content) \
        VALUES \
            (1, 51, 1, 0, '2021-07-31 01:48:42', True, 'Not sure if this grammar makes sense'), \
            (2, 51, 4, 1, '2021-08-09 12:28:42', True, 'It''s fine, go back to grammar school man'), \
            (3, 51, 1, 2, '2021-08-10 21:55:42', True, 'uwu dont need to be so mean man'), \
            (4, 53, 1, 0, '2021-07-31 13:22:42', False, 'this comment is lonely uwu '), \
            (5, 54, 4, 0, '2021-08-09 01:38:12', True, 'this comment is likes to be alone uwu '), \
            (6, 59, 4, 0, '2021-08-09 18:23:32', False, 'this comment is disagreeable'), \
            (7, 59, 1, 1, '2021-08-10 21:58:42', False, 'I agree!');"
    )


def erase_db():
    db.session.query(CommentAll).delete()
    db.session.commit()
    db.session.query(StoryTranslationContentAll).delete()
    db.session.commit()
    db.session.query(StoryContent).delete()
    db.session.commit()
    db.session.query(StoryTranslationAll).delete()
    db.session.commit()
    db.session.query(UserAll).delete()
    db.session.commit()
    db.session.query(Story).delete()
    db.session.commit()


if __name__ == "__main__":
    app = create_app("development")
    if "erase" in sys.argv:
        erase_db()
    else:
        insert_test_data()
