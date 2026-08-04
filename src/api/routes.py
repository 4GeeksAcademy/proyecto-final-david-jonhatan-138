"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint
from flask_cors import CORS

from api.controllers.main_controller import hello
from api.controllers.auth_controller import login as login_controller, signup as signup_controller

api = Blueprint('api', __name__,"/api")

# Allow CORS requests to this API
CORS(api)


@api.route('/login', methods=['POST'])
def login():
    return login_controller()


@api.route('/signin', methods=['POST'])
def signin():
    return signup_controller()
