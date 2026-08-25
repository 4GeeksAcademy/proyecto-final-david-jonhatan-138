from api.models.user import db, User
from flask import abort, request, jsonify


def get_user_by_email(email: str):
    return User.query.filter_by(email=email).first()


def create_user(role, email, password, name, last_name, biografi=None, category=None):
    return User(
        role=role,
        email=email,
        password=password,
        name=name,
        last_name=last_name,
        biografi=biografi,
        category=category
    )

def patch_user(user_id):
    data = request.get_json(silent=True) or {}

    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    # Actualizar solo los campos permitidos
    if "name" in data:
        user.name = data["name"]

    if "last_name" in data:
        user.last_name = data["last_name"]

    if "password" in data:
        user.password = data["password"]

    if "category" in data:
        user.category = data["category"]

    if "biografi" in data:
        user.biografi = data["biografi"]

    if "role" in data:
        user.role = data["role"]

    db.session.commit()

    return user.serialize()

def get_all_user():
    users = User.query.all()
    return [user.serialize() for user in users]

