def test_stories(app, db, client):
    result = client.execute("""
        {
            stories {
                id
                title
                description
                contents  {
                    id
                }      
            }
        }
    """)

    # im against using snapshot
    assert(result == {
        "data": { "stories": [] }
    })

def test_story_by_id(db, client):
    pass


def test_story_by_id_invalid_id(db, client):
    pass

def test_stories_available_for_translation(db, client):
    pass

def test_stories_available_for_translation_invalid_language_string(db, client):
    pass

def test_stories_available_for_translation_negative_or_too_large_level(db, client):
    pass

def test_stories_available_for_translation_invalid_language_and_level_for_given_user(db, client):
    pass

def test_stories_available_for_translation_user_not_approved(db, client):
    pass

def test_story_translaiton_by_id(db, client):
    pass

def test_story_translation_by_id_invalid_id(db, client):
    pass

def test_stories_available_for_review(db, client):
    pass

def test_stories_available_for_review_invalid_language_string(db, client):
    pass

def test_stories_available_for_review_negative_or_too_large_level(db, client):
    pass

def test_stories_available_for_review_invalid_language_and_level_for_given_user(db, client):
    pass

def test_stories_available_for_review_user_not_approved(db, client):
    pass

def test_not_authenticated_for_endpoint(db, client):
    pass

