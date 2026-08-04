from api.models.appointment import Appointment


def get_appointments():
    return Appointment.query.all()


def get_appointment_by_id(appointment_id: int):
    return Appointment.query.get(appointment_id)


def create_appointment(**appointment_data):
    return Appointment(**appointment_data)
