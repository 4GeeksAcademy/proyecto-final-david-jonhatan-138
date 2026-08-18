"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint
from flask_cors import CORS

from api.controllers.main_controller import hello
from api.controllers.auth_controller import get_user_by_email_controller, login as login_controller, signup as signup_controller, patch_user_controller
from api.controllers.appointment_controller import (
    create_appointment as create_appointment_controller,
    get_all_appointments as get_all_appointments_controller,
    get_appointment as get_appointment_controller
)
from api.controllers.client_controller import ClientController
from api.controllers.service_controller import ServiceController
from api.controllers.mail_controller import mail_reset_pass_controller

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/login', methods=['POST'])
def login():
    return login_controller()


@api.route('/signin', methods=['POST'])
def signin():
    return signup_controller()


@api.route('/user/<int:user_id>', methods=['PATCH'])
def patch_user(user_id):
    return patch_user_controller(user_id)


@api.route('/appointments', methods=['GET'])
def list_appointments():
    return get_all_appointments_controller()


@api.route('/appointments/<int:appointment_id>', methods=['GET'])
def fetch_appointment(appointment_id):
    return get_appointment_controller(appointment_id)


@api.route('/appointments', methods=['POST'])
def create_appointment():
    return create_appointment_controller()


@api.route('/clients', methods=['GET'])
def get_all_clients():
    return ClientController.get_all_clients()


@api.route('/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    return ClientController.get_client(client_id)


@api.route('/clients/user/<int:user_id>', methods=['GET'])
def get_all_clients_by_user(user_id):
    return ClientController.get_all_clients_by_user(user_id)


@api.route('/clients', methods=['POST'])
def add_client():
    return ClientController.add_client()


@api.route('/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    return ClientController.delete_client(client_id)


@api.route('/clients/<int:client_id>', methods=['PATCH'])
def patch_client(client_id):
    return ClientController.patch_client(client_id)

@api.route('/services', methods=['GET'])
def get_all_services():
    return ServiceController.get_all_services()


@api.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    return ServiceController.get_service(service_id)


@api.route('/services/user/<int:user_id>', methods=['GET'])
def get_all_services_by_user(user_id):
    return ServiceController.get_all_services_by_user(user_id)


@api.route('/services', methods=['POST'])
def add_service():
    return ServiceController.add_service()


@api.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    return ServiceController.delete_service(service_id)


@api.route('/services/<int:service_id>', methods=['PATCH'])
def patch_service(service_id):
    return ServiceController.patch_service(service_id)


@api.route('/mail-reset-pass', methods=['POST'])
def mail_reset_pass():
    return mail_reset_pass_controller()


@api.route('/user-email', methods=['POST'])
def get_user_by_email():
    return get_user_by_email_controller()