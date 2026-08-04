"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint
from flask_cors import CORS

from api.controllers.main_controller import hello
from api.controllers.auth_controller import login as login_controller, signup as signup_controller
from api.controllers.appointment_controller import (
    create_appointment as create_appointment_controller,
    get_all_appointments as get_all_appointments_controller,
    get_appointment as get_appointment_controller
)

api = Blueprint('api', __name__,"/api")

# Allow CORS requests to this API
CORS(api)


@api.route('/login', methods=['POST'])
def login():
    return login_controller()


@api.route('/signin', methods=['POST'])
def signin():
    return signup_controller()


@api.route('/appointments', methods=['GET'])
def list_appointments():
    return get_all_appointments_controller()


@api.route('/appointments/<int:appointment_id>', methods=['GET'])
def fetch_appointment(appointment_id):
    return get_appointment_controller(appointment_id)


@api.route('/appointments', methods=['POST'])
def create_appointment():
    return create_appointment_controller()
