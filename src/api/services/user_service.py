from api.models.user import db, User
from flask import request, jsonify
from werkzeug.security import generate_password_hash


def get_user_by_email(email: str):
    return User.query.filter_by(email=email).first()


def create_user(role, email, password, name, last_name, biografi=None, category=None, id_stripe_user=None):
    # Encriptamos la contraseña por seguridad antes de guardarla
    hashed_password = generate_password_hash(password)
    
    new_user = User(
        role=role,
        email=email,
        password=hashed_password,
        name=name,
        last_name=last_name,
        biografi=biografi,
        category=category,
        id_stripe_user=id_stripe_user
    )
    
    db.session.add(new_user)
    db.session.commit()
    return new_user


def patch_user(user_id):
    data = request.get_json(silent=True) or {}

    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    # Actualizar campos permitidos (incluyendo rol y suscripción si llegan)
    if "name" in data:
        user.name = data["name"]

    if "last_name" in data:
        user.last_name = data["last_name"]

    if "password" in data and data["password"]:
        user.password = generate_password_hash(data["password"])

    if "category" in data:
        user.category = data["category"]

    if "biografi" in data:
        user.biografi = data["biografi"]

    if "role" in data:
        from api.models.user import UserRole
        try:
            user.role = UserRole(data["role"])
        except ValueError:
            pass # Si mandan un rol inválido lo ignoramos

    if "subscription_status" in data:
        user.subscription_status = data["subscription_status"]

    db.session.commit()

    return user.serialize()
def get_all_user():
    users = User.query.all()
    return [user.serialize() for user in users]

def update_payment_by_subscription_id(stripe_subscription_id: str, value: bool):
    user = User.query.filter_by(id_stripe_subscription=stripe_subscription_id).first()

    if not user:
        return None  # o lanzar excepción si prefieres

    user.payment = value
    db.session.commit()

    return user

def update_payment_by_stripe_id(stripe_customer_id: str, value: bool, stripe_subscription_id: str | None = None):
    user = User.query.filter_by(id_stripe_user=stripe_customer_id).first()

    if not user:
        print(f"⚠️ No se encontró usuario con id_stripe_user={stripe_customer_id}")
        return None

    # Actualizar estado de pago
    user.payment = value

    # Actualizar suscripción si viene del webhook
    if stripe_subscription_id is not None:
        user.id_stripe_subscription = stripe_subscription_id

    db.session.commit()

    return user




