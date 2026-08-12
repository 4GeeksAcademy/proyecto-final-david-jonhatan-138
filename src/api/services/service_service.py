from flask import abort, request, jsonify
from api.models import db, Service, User


class ServiceService:
    @staticmethod
    def get_all():
        services = Service.query.all()
        return [service.serialize() for service in services]

    @staticmethod
    def get_service(service_id):
        service = Service.query.get(service_id)
        if service is None:
            abort(404, description=f"Servicio con id {service_id} no encontrado")
        return service.serialize()

    @staticmethod
    def get_all_services_by_user(user_id):
        services = Service.query.filter_by(user_id=user_id).all()
        return [service.serialize() for service in services]

    @staticmethod
    def add_service():
        data = request.get_json(silent=True) or {}

        required_fields = ["title", "duration", "price", "user_id"]
        missing = [field for field in required_fields if not data.get(field)]

        if missing:
            return jsonify({"message": f"Faltan campos requeridos: {', '.join(missing)}"}), 400

        user = User.query.get(data["user_id"])
        if user is None:
            return jsonify({"message": "Usuario no encontrado"}), 404

        try:
            duration = int(data["duration"])
            price = int(data["price"])
        except (ValueError, TypeError):
            return jsonify({"message": "Los campos duration y price deben ser números enteros"}), 400

        service = Service(
            title=data["title"],
            duration=duration,
            price=price,
            is_active=bool(data.get("is_active", True)),
            user_id=user.id,
        )

        db.session.add(service)
        db.session.commit()

        return service.serialize()

    @staticmethod
    def patch_service(service_id):
        data = request.get_json(silent=True) or {}

        service = Service.query.get(service_id)
        if service is None:
            return jsonify({"message": f"Servicio con id {service_id} no encontrado"}), 404

        if "title" in data:
            service.title = data["title"]

        if "duration" in data:
            try:
                service.duration = int(data["duration"])
            except (ValueError, TypeError):
                return jsonify({"message": "El campo duration debe ser un número entero"}), 400

        if "price" in data:
            try:
                service.price = int(data["price"])
            except (ValueError, TypeError):
                return jsonify({"message": "El campo price debe ser un número entero"}), 400

        if "is_active" in data:
            service.is_active = bool(data["is_active"])

        if "user_id" in data:
            user = User.query.get(data["user_id"])
            if user is None:
                return jsonify({"message": "Usuario no encontrado"}), 404
            service.user_id = user.id

        db.session.commit()
        return service.serialize()

    @staticmethod
    def delete_service(service_id):
        service = Service.query.get(service_id)
        if service is None:
            return jsonify({"message": f"Servicio con id {service_id} no encontrado"}), 404

        db.session.delete(service)
        db.session.commit()

        return {"message": f"Servicio con id {service_id} eliminado correctamente"}
