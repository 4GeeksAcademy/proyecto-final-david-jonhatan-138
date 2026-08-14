from datetime import datetime
from flask import request, jsonify
from api.models import db
from api.models.appointment import AppointmentStatus, AppointmentSource
from api.models.client import Client
from api.models.service import Service
from api.models.user import User
from api.services.appointment_service import (
    create_appointment as build_appointment,
    get_appointment_by_id,
    get_appointments,
    get_appointments_by_user,
)


def _parse_datetime(value, field_name):
    if not isinstance(value, str):
        raise ValueError(f"{field_name} must be an ISO datetime string")
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        raise ValueError(f"{field_name} must be a valid ISO datetime string")


def _get_enum(enum_class, value, default=None, field_name=None):
    if value is None:
        return default
    try:
        return enum_class(value)
    except ValueError:
        raise ValueError(f"Invalid value for {field_name}: {value}")


def get_all_appointments():
    appointments = get_appointments()
    return jsonify({"appointments": [appointment.serialize() for appointment in appointments]}), 200


def get_appointments_for_user(user_id):
    appointments = get_appointments_by_user(user_id)
    return jsonify({"appointments": [appointment.serialize() for appointment in appointments]}), 200


def get_appointment(appointment_id):
    appointment = get_appointment_by_id(appointment_id)
    if appointment is None:
        return jsonify({"message": "Appointment not found"}), 404
    return jsonify({"appointment": appointment.serialize()}), 200


def create_appointment():
    data = request.get_json(silent=True) or {}
    required_fields = ["start_time", "end_time",
                       "service_id", "user_id", "client_id"]

    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        start_time = _parse_datetime(data["start_time"], "start_time")
        end_time = _parse_datetime(data["end_time"], "end_time")
    except ValueError as error:
        return jsonify({"message": str(error)}), 400

    status = None
    source = None
    try:
        status = _get_enum(AppointmentStatus, data.get(
            "status"), AppointmentStatus.pending, "status")
        source = _get_enum(AppointmentSource, data.get(
            "source"), AppointmentSource.manual, "source")
    except ValueError as error:
        return jsonify({"message": str(error)}), 400

    service = Service.query.get(data["service_id"])
    if service is None:
        return jsonify({"message": "Service not found"}), 404

    user = User.query.get(data["user_id"])
    if user is None:
        return jsonify({"message": "User not found"}), 404

    client = Client.query.get(data["client_id"])
    if client is None:
        return jsonify({"message": "Client not found"}), 404

    appointment = build_appointment(
        start_time=start_time,
        end_time=end_time,
        status=status,
        source=source,
        service_id=service.id,
        user_id=user.id,
        client_id=client.id,
    )

    db.session.add(appointment)
    db.session.commit()

    return jsonify({"appointment": appointment.serialize()}), 201


def update_appointment(appointment_id):
    appointment = get_appointment_by_id(appointment_id)
    if appointment is None:
        return jsonify({"message": "Appointment not found"}), 404

    data = request.get_json(silent=True) or {}
    if data.get("start_time"):
        try:
            appointment.start_time = _parse_datetime(
                data["start_time"], "start_time")
        except ValueError as error:
            return jsonify({"message": str(error)}), 400
    if data.get("end_time"):
        try:
            appointment.end_time = _parse_datetime(
                data["end_time"], "end_time")
        except ValueError as error:
            return jsonify({"message": str(error)}), 400

    if data.get("status"):
        try:
            appointment.status = _get_enum(AppointmentStatus, data.get(
                "status"), appointment.status, "status")
        except ValueError as error:
            return jsonify({"message": str(error)}), 400

    if data.get("service_id"):
        service = Service.query.get(data["service_id"])
        if service is None:
            return jsonify({"message": "Service not found"}), 404
        appointment.service_id = service.id

    if data.get("client_id"):
        client = Client.query.get(data["client_id"])
        if client is None:
            return jsonify({"message": "Client not found"}), 404
        appointment.client_id = client.id

    db.session.commit()
    return jsonify({"appointment": appointment.serialize()}), 200


def delete_appointment(appointment_id):
    appointment = get_appointment_by_id(appointment_id)
    if appointment is None:
        return jsonify({"message": "Appointment not found"}), 404

    db.session.delete(appointment)
    db.session.commit()
    return jsonify({"message": "Appointment deleted"}), 200
