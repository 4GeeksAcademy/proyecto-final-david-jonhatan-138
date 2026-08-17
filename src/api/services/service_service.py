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

        # Validar usuario
        user = User.query.get(data["user_id"])
        if user is None:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Campos opcionales
        is_active = data.get("is_active", True)

        service = Service(
            title=data["title"],
            duration=data["duration"],
            price=data["price"],
            is_active=is_active,
            user_id=user.id
        )

        db.session.add(service)
        db.session.commit()

        return service.serialize()

    @staticmethod
    def delete_service(service_id):
        service = Service.query.get(service_id)

        if service is None:
            return jsonify({"message": f"Servicio con id {service_id} no encontrado"}), 404

        db.session.delete(service)
        db.session.commit()

        return jsonify(f"Servicio con id {service_id} eliminado correctamente"), 200

    @staticmethod
    def patch_service(service_id):
        data = request.get_json(silent=True) or {}

        service = Service.query.get(service_id)
        if service is None:
            return jsonify({"message": "Service not found"}), 404

        # Actualizar solo los campos enviados
        if "title" in data:
            service.title = data["title"]

        if "duration" in data:
            service.duration = data["duration"]

        if "price" in data:
            service.price = data["price"]

        if "is_active" in data:
            service.is_active = data["is_active"]

        if "user_id" in data:
            service.user_id = data["user_id"]

        db.session.commit()

        return service.serialize()
