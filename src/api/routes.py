"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.models.user import UserRole
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def login():
    credentials = request.get_json(silent=True) or {}
    email = credentials.get('email')
    password = credentials.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None or user.password != password:
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({"user": user.serialize()}), 200


@api.route('/signin', methods=['POST'])
def signin():
    user_data = request.get_json(silent=True) or {}
    required_fields = ('role', 'email', 'password', 'name', 'last_name')

    if any(not user_data.get(field) for field in required_fields):
        return jsonify({"message": "All required fields must be provided"}), 400

    if User.query.filter_by(email=user_data['email']).first() is not None:
        return jsonify({"message": "Email is already registered"}), 409

    try:
        role = UserRole(user_data['role'])
    except ValueError:
        return jsonify({"message": "Invalid role"}), 400

    user = User(
        role=role,
        email=user_data['email'],
        password=user_data['password'],
        name=user_data['name'],
        last_name=user_data['last_name'],
        biografi=user_data.get('biografi'),
        category=user_data.get('category')
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"user": user.serialize()}), 201
