from flask import request, jsonify
from api.models.user import UserRole
from api.services.user_service import get_user_by_email, create_user, patch_user, get_all_user
from api.models import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash


def login():
    credentials = request.get_json(silent=True) or {}
    email = credentials.get("email")
    password = credentials.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = get_user_by_email(email)
    
    # Comprobamos la contraseña de forma segura (soporta hashes y texto plano antiguo por seguridad)
    is_valid_password = False
    if user:
        if user.password.startswith("pbkdf2:") or user.password.startswith("scrypt:"):
            is_valid_password = check_password_hash(user.password, password)
        else:
            is_valid_password = (user.password == password)

    if user is None or not is_valid_password:
        return jsonify({"message": "Invalid email or password"}), 401

    if user.subscription_status == "suspended":
        return jsonify({"message": "Suspended Acount"}), 403
    
    token = create_access_token(identity=str(user.serialize()["id"]))
    
    return jsonify({"user": user.serialize(), "token": token}), 200


def signup(id_stripe_user):
    user_data = request.get_json(silent=True) or {}
    required_fields = ("role", "email", "password", "name", "last_name")
    if any(not user_data.get(field) for field in required_fields):
        return jsonify({"message": "All required fields must be provided"}), 400

    if get_user_by_email(user_data["email"]) is not None:
        return jsonify({"message": "Email is already registered"}), 409

    if user_data["role"] != "admin" and user_data["role"] != "professional":
        return jsonify({"message": "Invalid role"}), 400

    # create_user ya hace el add y el commit internamente de forma segura
    user = create_user(
        role=user_data["role"],
        email=user_data["email"],
        password=user_data["password"],
        name=user_data["name"],
        last_name=user_data["last_name"],
        biografi=user_data["biografi"],
        category=user_data["category"],
        id_stripe_user=id_stripe_user
    )

    return jsonify({"user": user.serialize()}), 201

def newuser():
    user_data = request.get_json(silent=True) or {}
    required_fields = ("role", "email", "password", "name", "last_name")
    if any(not user_data.get(field) for field in required_fields):
        return jsonify({"message": "All required fields must be provided"}), 400

    if get_user_by_email(user_data["email"]) is not None:
        return jsonify({"message": "Email is already registered"}), 409

    if user_data["role"] != "admin" and user_data["role"] != "professional":
        return jsonify({"message": "Invalid role"}), 400

    # create_user ya hace el add y el commit internamente de forma segura
    user = create_user(
        role=user_data["role"],
        email=user_data["email"],
        password=user_data["password"],
        name=user_data["name"],
        last_name=user_data["last_name"],
        biografi=user_data["biografi"],
        category=user_data["category"],
    )

    return jsonify({"user": user.serialize()}), 201


def patch_user_controller(user_id):
    user = patch_user(user_id)
    return jsonify(user), 200


def get_user_by_email_controller():
    credentials = request.get_json(silent=True) or {}
    user = get_user_by_email(credentials.get("email"))
    return jsonify({"user": user.serialize()}), 200

def get_all_user_controller():
    people = get_all_user()
    return jsonify(people), 200