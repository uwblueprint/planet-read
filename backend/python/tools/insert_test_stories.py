import os
import sys

from flask_sqlalchemy import SQLAlchemy

from app import create_app

db = SQLAlchemy()

from app.models.story import Story
from app.models.story_all import StoryAll
from app.models.story_content import StoryContent
from app.models.story_content_all import StoryContentAll


def insert_test_stories():
    # stories
    db.engine.execute("ALTER TABLE stories_all AUTO_INCREMENT = 1;")
    db.engine.execute(
        "INSERT IGNORE INTO stories \
                (id, title, description, youtube_link, level, translated_languages, is_test, date_uploaded) \
            VALUES \
                (1, 'The Musical Donkey', 'There was a donkey who felt so happy that he sang through the night in the cucumber field. The problem was that the cucumbers couldn\"t bear it. What did they do?', 'https://www.youtube.com/watch?v=QfcttsaHTIY', 2, '[]', true, '2000-09-06 19:27:26'), \
                (2, 'The Little Pianist', 'Azul loves to play the piano and he wants to become not just a good pianist but a great pianist. See how he learns the secret!', 'https://www.youtube.com/watch?v=4GsjEPRMzdw', 3, '[]', true, '2000-12-21 19:27:26'), \
                (3, 'The River and the Mountain', 'The River thinks that the Mountain\"s life is more comfortable and peaceful than hers. Is it true?', 'https://www.youtube.com/watch?v=DlQ4zvJymKI', 4, '[]', true, '2000-12-21 19:27:26');"
    )

    the_musical_content = [
        "During the day the donkey worked for the washerman. At night he went for long walks with his friend, the jackal. The jackal never listened but the donkey talked and talked until they reached the cucumber field. Then the donkey would open his mouth wide and bite into a fresh, juicy cucumber, cool as the moon.",
        "Every night, the two ate.  The donkey ate a LOT.  He grew fat with joy. And then one day he began to sing with joy. 'Oh no!' said the jackal and closed his ears.  'Oh yes!' said the donkey and opened his mouth even wider.",
        "'STOP!' cried the jackal.  'The farmer will hear you!' But the donkey didn't stop singing. 'STOP!' cried the jackal.   'The cucumbers will hear you!'  Still the donkey didn't stop singing. But the farmer didn't hear him. You know why?",
        "He was dreaming he had a thousand cucumbers in his field.   He didn't want to wake up. In the field, the real cucumbers waited. But the farmer did not come. And the musical donkey would not stop singing.",
        "The cucumbers could not bear it.   What could they do? One by one, they jumped out of the field and ran to the farmer's house. The next morning, when the farmer woke up, he was not alone. All around him were cucumbers - wide awake, looking at him. And in the field the donkey was fast asleep.",
    ]

    the_little_pianist_content = [
        "There was once a little boy named Azul. He loved to play the piano and dreamed of becoming a pianist some day. Every Sunday, Azul went to his piano class, and practiced every night at home, just before going to bed.",
        "Azul became good at it because he was so sincere. He would forget to brush his teeth but would never forget to practice playing the piano!",
        "One day, Vicki, his piano teacher told him, 'Azul, you will perform tomorrow in front of a large audience. You are getting to be quite the pianist! Your fingers move like a squirrel on the piano keys. But there is something missing.' ",
        "'What is it?' Azul just had to know. He really… really wanted to be, not just a good pianist, but a great pianist. Vicki smiled. She whispered into Azul's ear a piano teacher's secret. 'Play with your heart, not with your fingers.' ",
        "As always, Vicki pulled out her box of stickers. Azul held out his hand and Vicki stuck on it, a gorgeous sticker of a butterfly. 'There, think of this butterfly when you want to play with your heart,' she said.",
        # Observation: Word doc double quotes seem to be different from ascii double quotes. They can be inserted and require no escape characters.
        "That day, when all the children played in the park, Azul just stared at his butterfly. He wondered, “I can play with my fingers because I can move them. I can touch the piano keys. How can I play with my heart? I can’t even see my heart.”",
        "For the first time, in a long time, Azul went to bed without playing the piano. The night before his performance, he did not practice because he did not know how to play with his heart! When Azul woke up, he looked for the butterfly sticker.",
        "Oh no! The sticker was gone too! Now Azul was nervous. Really nervous… He tried playing the piano, but his fingers would just not move! However, that did not stop the clock from ticking. Soon it was performance time.",
        "The piano was in the middle of a round stage, surrounded by rows of people. Azul walked onto the stage, sat on the piano bench and closed his eyes for a second. Remembering Vicki's words, he thought of the butterfly.",
        "In the quiet of the auditorium, Azul heard the flutter of wings. A butterfly sat on his shoulder and started to hum a tune. His fingers began to move by themselves. His heart began to play the butterfly's song.",
    ]

    the_river_and_mountain_content = [
        "One day, the river thought to herself, 'Do I have to keep flowing all my life? Can't I stop and rest for a little while?' She needed advice, so she called out to the mountain and shared her thoughts with him. The mountain just laughed and said: 'Hey, look at me, I have been standing in the same place for ages!'",
        "The river replied, 'You are firm and fixed in one place, how could you ever get tired? Look at me, I have to be on the move all the time. I don't get to rest for even a single minute!'",
        "The mountain smiled. 'That is how you see it, but I get tired of standing here,' he replied. 'Every day I see the same trees and the same patch of sky. Sometimes I wish: if only I could run around like the river. I would visit new forests and villages. I would water their fields, give life, and be so deeply loved by all.'",
        "The river interrupted, 'That's strange! Your life is so comfortable and peaceful, yet you feel this way.'",
        "'You don't get it, my sister. You are worshiped by everyone.' the mountain replied lovingly. 'You flow for the sake of others. And that's not all! After giving away so much, you offer whatever remains, to the sea.'",
        "On hearing this, the river bowed down to the mountain and said with great enthusiasm, 'You are absolutely right, my brother. The true purpose of my life is to give life to others. Thank you for your kind wisdom!' she said. Then, while the mountain smiled at her newfound positive energy, she gushed away with a loud gurgle, feeling very happy.",
    ]

    # story contents
    db.engine.execute("ALTER TABLE story_contents_all AUTO_INCREMENT = 1;")
    # story contents for the story tests
    story_test_pairs = [
        (1, the_musical_content),
        (2, the_little_pianist_content),
        (3, the_river_and_mountain_content),
    ]
    for i, pair in enumerate(story_test_pairs):
        story_id, story_content = pair
        for i, content in enumerate(story_content):
            id = (story_id - 1) * 10 + i + 1
            db.engine.execute(
                f'INSERT IGNORE INTO story_contents \
                        (id, story_id, line_index, content) \
                    VALUES \
                        ({id}, {story_id}, {i}, "{content}") \
                '
            )


def erase_db():
    db.session.query(StoryContentAll).delete()
    db.session.commit()
    db.session.query(StoryAll).delete()
    db.session.commit()


if __name__ == "__main__":
    app = create_app("development")
    if "erase" in sys.argv:
        erase_db()
    else:
        insert_test_stories()
