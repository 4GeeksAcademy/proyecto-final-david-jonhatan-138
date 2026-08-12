from api.models import db
from api.models.appointment import Appointment


def get_appointments():
    return Appointment.query.all()


def get_appointments_by_user(user_id: int):
    return Appointment.query.filter_by(user_id=user_id).all()


def get_appointment_by_id(appointment_id: int):
    return Appointment.query.get(appointment_id)


def create_appointment(**appointment_data):
    return Appointment(**appointment_data)


def update_appointment(appointment_id: int, **appointment_data):
    appointment = Appointment.query.get(appointment_id)
    if appointment is None:
        return None
    for key, value in appointment_data.items():
        setattr(appointment, key, value)
    return appointment


def delete_appointment(appointment_id: int):
    appointment = Appointment.query.get(appointment_id)
    if appointment is None:
        return False
    db.session.delete(appointment)
    return True
