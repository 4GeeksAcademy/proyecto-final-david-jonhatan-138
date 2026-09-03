"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint, jsonify, request
from api.controllers.stripe_controller import StripeController
from api.controllers.main_controller import hello
from api.controllers.auth_controller import get_user_by_email_controller, login as login_controller, newuser as signup_controller, patch_user_controller, get_all_user_controller
from api.controllers.appointment_controller import (
    create_appointment as create_appointment_controller,
    delete_appointment as delete_appointment_controller,
    get_all_appointments as get_all_appointments_controller,
    get_appointment as get_appointment_controller,
    get_appointments_for_user as get_appointments_for_user_controller,
    update_appointment as update_appointment_controller,
)
from api.controllers.client_controller import ClientController
from api.controllers.service_controller import ServiceController
from api.controllers.mail_controller import mail_reset_pass_controller
from api.models.user import User, db
from werkzeug.security import generate_password_hash

api = Blueprint('api', __name__)


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


@api.route('/appointments/user/<int:user_id>', methods=['GET'])
def list_appointments_by_user(user_id):
    return get_appointments_for_user_controller(user_id)


@api.route('/appointments/<int:appointment_id>', methods=['GET'])
def fetch_appointment(appointment_id):
    return get_appointment_controller(appointment_id)


@api.route('/appointments', methods=['POST'])
def create_appointment():
    return create_appointment_controller()


@api.route('/appointments/<int:appointment_id>', methods=['PATCH'])
def patch_appointment(appointment_id):
    return update_appointment_controller(appointment_id)


@api.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def remove_appointment(appointment_id):
    return delete_appointment_controller(appointment_id)


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


# --- RUTAS PARA EL PANEL DE ADMINISTRACIÓN (DUEÑOS) ---

@api.route('/user', methods=['GET'])
def get_all_users():
    """Endpoint unificado para listar todos los usuarios en el panel de admin"""
    try:
        users = User.query.all()
        return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        print(f"Error cargando usuarios: {e}")
        return jsonify({"message": "Error al cargar los usuarios"}), 500


@api.route('/admin/users', methods=['POST'])
def admin_create_user():
    """Endpoint exclusivo para que el admin cree usuarios con cualquier rol/suscripción"""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "professional")
    subscription_status = data.get("subscription_status", "active")

    if not email or not password:
        return jsonify({"message": "Faltan campos obligatorios"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "El correo ya está registrado"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        email=email,
        password=hashed_password,
        name=data.get("name", ""),
        last_name=data.get("last_name", ""),
        role=role,
        subscription_status=subscription_status,
        category=data.get("category", ""),
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Usuario creado con éxito por el administrador",
        "user": new_user.serialize()
    }), 201


@api.route("/subscriptions", methods=['POST'])
def stripe_subscription():
    return StripeController.create_subscription()

@api.route("/check-webhook", methods=['post'])
def stripe_check_webhook():
    return StripeController.stripe_webhook()
