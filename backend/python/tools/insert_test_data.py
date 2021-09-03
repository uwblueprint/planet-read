import os

from flask_sqlalchemy import SQLAlchemy

from app import create_app

db = SQLAlchemy()


def insert_test_data():
    from app.models.comment import Comment
    from app.models.story import Story
    from app.models.story_content import StoryContent
    from app.models.story_translation import StoryTranslation
    from app.models.story_translation_content import StoryTranslationContent
    from app.models.user import User

    # users
    db.engine.execute("ALTER TABLE users AUTO_INCREMENT = 1;")
    db.session.bulk_save_objects(
        [
            User(
                first_name="Carl",
                last_name="Sagan",
                auth_id=os.getenv("AUTH_ID_1", ""),
                role="User",
                approved_languages='{"ENGLISH_US":4}',
            ),
            User(
                first_name="Miroslav",
                last_name="Klose",
                auth_id=os.getenv("AUTH_ID_2", ""),
                role="User",
                approved_languages='{"POLISH":4, "GERMAN":4}',
            ),
            User(
                first_name="Kevin",
                last_name="De Bryune",
                auth_id=os.getenv("AUTH_ID_3", ""),
                role="User",
                approved_languages='{"DUTCH":4, "FRENCH":4}',
            ),
            User(
                first_name="Dwight",
                last_name="D. Eisenhower",
                auth_id=os.getenv("AUTH_ID_4", ""),
                role="User",
                approved_languages='{"ENGLISH_UK":4, "ENGLISH_US":4}',
            ),
            User(
                first_name="Alexander",
                last_name="Hamilton",
                auth_id=os.getenv("AUTH_ID_5", ""),
                role="User",
                approved_languages='{"MANDARIN":4}',
            ),
            User(
                first_name="Angela",
                last_name="Merkel",
                auth_id=os.getenv("AUTH_ID_6", ""),
                role="Admin",
                approved_languages='{"GERMAN":4}',
            ),
            User(
                first_name="Richard",
                last_name="Feynman",
                auth_id=os.getenv("AUTH_ID_7", ""),
                role="User",
                approved_languages='{"PORTUGESE":4}',
            ),
        ]
    )
    db.session().commit()

    # stories
    db.engine.execute("ALTER TABLE stories AUTO_INCREMENT = 1;")
    db.session.bulk_save_objects(
        [
            Story(
                title="East of Eden",
                description="Follow the intertwined destinies of two families whose generations reenact the poisonous rivalry of Cain and Abel.",
                youtube_link="https://www.youtube.com/watch?v=redECmF7wh8",
                level=4,
                translated_languages=["GERMAN", "ENGLISH_UK"],
            ),
            Story(
                title="War and Peace",
                description="War and Peace is a literary work mixed with chapters on history and philosophy by the Russian author Leo Tolstoy.",
                youtube_link="https://www.youtube.com/watch?v=4dn7TEjnbPY",
                level=1,
                translated_languages=["GERMAN", "POLISH"],
            ),
            Story(
                title="A Tale of Two Cities",
                description="An 1859 historical novel by Charles Dickens, set in London and Paris before and during the French Revolution.",
                youtube_link="https://www.youtube.com/watch?v=5czA_L_eOp4",
                level=3,
                translated_languages=["MANDARIN", "ENGLISH_UK"],
            ),
            Story(
                title="Pride and Prejudice",
                description="Pride and Prejudice preaches the difference between superficial goodness and actual goodness.",
                youtube_link="https://www.youtube.com/watch?v=5xTh44G6RYs",
                level=4,
                translated_languages=["GERMAN", "ENGLISH_UK"],
            ),
            Story(
                title="To Kill a Mockingbird",
                description="To Kill a Mockingbird is a novel by the American author Harper Lee. A sentence cannot do this novel justice.",
                youtube_link="https://www.youtube.com/watch?v=3xM8hvEE2dI",
                level=3,
                translated_languages=[
                    "GERMAN",
                    "ENGLISH_UK",
                    "PORTUGUESE",
                    "DUTCH",
                ],
            ),
            Story(
                title="The Great Gatsby",
                description="Set in the Jazz Age on Long Island, near New York City, the novel depicts mysterious millionaire Jay Gatsby and Gatsby and Daisy Buchanan.",
                youtube_link="https://www.youtube.com/watch?v=e6Iu29TNfkM",
                level=4,
                translated_languages=["ENGLISH_UK"],
            ),
            Story(
                title="Nineteen Eighty-Four",
                description="Nineteen Eighty-Four, often referred to as 1984, is a dystopian social science fiction novel by the English novelist George Orwell.",
                youtube_link="https://www.youtube.com/watch?v=h9JIKngJnCU",
                level=2,
                translated_languages=[],
            ),
        ]
    )
    db.session().commit()
    generic_content = [
        "Every two weeks I went to a meeting with them, and in my room here I covered pages with writing. I bought every known Hebrew dictionary. But the old gentlemen were always ahead of me. It wasn't long before they were ahead of our rabbi; he brought a colleague in.",
        "Mr. Hamilton, you should have sat through some of those nights of argument and discussion. The questions, the inspection, oh, the lovely thinking-the beautiful thinking.",
        "After two years we felt that we could approach your sixteen verses of the fourth chapter of Genesis. ",
        "My old gentlemen felt that these words were very important too-'Thou shalt' and 'Do thou.' And this was the gold from our mining: 'Thou mayest.' 'Thou mayest rule over sin.' ",
        'The old gentlemen smiled and nodded and felt the years were well spent. It brought them out of their Chinese shells too, and right now they are studying Greek."',
        "Samuel said, \"It's a fantastic story. And I've tried to follow and maybe I've missed somewhere. Why is this word so important?\"",
        "Lee's hand shook as he filled the delicate cups. He drank his down in one gulp. \"Don't you see?\" he cried. ",
        '"The American Standard translation orders men to triumph over sin, and you can call sin ignorance. ',
        "The King James translation makes a promise in 'Thou shalt,' meaning that men will surely triumph over sin. ",
        "But the Hebrew word, the word timshel-'Thou mayest'-that gives a choice. It might be the most important word in the world. That says the way is open. That throws it right back on a man. For if 'Thou mayest'-it is also true that 'Thou mayest not.' Don't you see?\"",
    ]

    # story contents
    db.engine.execute("ALTER TABLE story_contents AUTO_INCREMENT = 1;")
    for story_id in range(1, 8):
        for i, content in enumerate(generic_content):
            db.session.add(
                StoryContent(
                    story_id=story_id,
                    line_index=i,
                    content=content,
                ),
            )

    # story translations
    db.engine.execute("ALTER TABLE story_translations AUTO_INCREMENT = 1;")
    db.session.bulk_save_objects(
        [
            StoryTranslation(
                story_id=1, language="GERMAN", stage="TRANSLATE", translator_id=6
            ),
            StoryTranslation(
                story_id=1,
                language="ENGLISH_UK",
                stage="TRANSLATE",
                translator_id=4,
            ),
            StoryTranslation(
                story_id=2, language="GERMAN", stage="TRANSLATE", translator_id=2
            ),
            StoryTranslation(
                story_id=2, language="POLISH", stage="TRANSLATE", translator_id=4
            ),
            StoryTranslation(
                story_id=3, language="MANDARIN", stage="TRANSLATE", translator_id=5
            ),
            StoryTranslation(
                story_id=3,
                language="ENGLISH_UK",
                stage="TRANSLATE",
                translator_id=4,
            ),
            StoryTranslation(
                story_id=4, language="GERMAN", stage="TRANSLATE", translator_id=6
            ),
            StoryTranslation(
                story_id=4,
                language="ENGLISH_UK",
                stage="TRANSLATE",
                translator_id=4,
            ),
            StoryTranslation(
                story_id=5, language="GERMAN", stage="TRANSLATE", translator_id=2
            ),
            StoryTranslation(
                story_id=5,
                language="ENGLISH_UK",
                stage="TRANSLATE",
                translator_id=1,
            ),
            StoryTranslation(
                story_id=5,
                language="PORTUGUESE",
                stage="TRANSLATE",
                translator_id=7,
            ),
            StoryTranslation(
                story_id=5, language="DUTCH", stage="TRANSLATE", translator_id=3
            ),
            StoryTranslation(
                story_id=6,
                language="ENGLISH_US",
                stage="TRANSLATE",
                translator_id=1,
            ),
        ]
    )
    db.session().commit()

    # story translation contents
    db.engine.execute("ALTER TABLE story_translation_contents AUTO_INCREMENT = 1;")
    full_translation = [2, 3, 5, 7, 11, 13]
    for story_translation_id in full_translation:
        for i, content in enumerate(generic_content):
            db.session.add(
                StoryTranslationContent(
                    story_translation_id=story_translation_id,
                    line_index=i,
                    translation_content=content,
                )
            )

    empty_translation = [1, 4, 6, 8, 9, 10, 12]
    for story_translation_id in empty_translation:
        for line_index in range(9):
            db.session.add(
                StoryTranslationContent(
                    story_translation_id=story_translation_id,
                    line_index=line_index,
                    translation_content="",
                ),
            )
    db.session().commit()

    # comments
    # Adding comments to The Great Gatsby (id: 6)
    # Story Translation (id: 13) with
    # Carl (id: 1) and Dwight (id: 4)"
    db.engine.execute("ALTER TABLE comments AUTO_INCREMENT = 1;")
    carl = User.query.filter_by(first_name="Carl").first()
    dwight = User.query.filter_by(first_name="Dwight").first()
    the_gg = Story.query.filter_by(title="The Great Gatsby").first()
    st = (
        StoryTranslation.query.filter_by(story_id=the_gg.id)
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
    db.session().commit()
    db.session.bulk_save_objects(
        [
            Comment(
                story_translation_content_id=51,
                user_id=1,
                comment_index=0,
                time="2021-07-31 01:48:42",
                resolved=True,
                content="Not sure if this grammar makes sense",
            ),
            Comment(
                story_translation_content_id=51,
                user_id=4,
                comment_index=1,
                time="2021-08-09 12:28:42",
                resolved=True,
                content="It's fine, go back to grammar school man",
            ),
            Comment(
                story_translation_content_id=51,
                user_id=1,
                comment_index=2,
                time="2021-08-10 21:55:42",
                resolved=True,
                content="uwu dont need to be so mean man",
            ),
            Comment(
                story_translation_content_id=53,
                user_id=1,
                comment_index=0,
                time="2021-07-31 13:22:42",
                resolved=False,
                content="this comment is lonely uwu",
            ),
            Comment(
                story_translation_content_id=54,
                user_id=4,
                comment_index=0,
                time="2021-08-09 01:38:12",
                resolved=True,
                content="this comment is likes to be alone uwu",
            ),
            Comment(
                story_translation_content_id=59,
                user_id=4,
                comment_index=0,
                time="2021-08-09 18:23:32",
                resolved=False,
                content="this comment is disagreeable",
            ),
            Comment(
                story_translation_content_id=59,
                user_id=1,
                comment_index=1,
                time="2021-08-10 21:58:42",
                resolved=False,
                content="I agree!",
            ),
        ]
    )
    db.session().commit()


if __name__ == "__main__":
    app = create_app("development")
    insert_test_data()
