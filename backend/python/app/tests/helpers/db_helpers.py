def db_session_add_commit_obj(db, obj):
    db.session.add(obj)
    assert db.session.commit() == None
    return obj
