from api.models.user import User


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
