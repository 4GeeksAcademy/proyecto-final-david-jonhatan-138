from flask import abort, request, jsonify
from api.models import db, Client, User


class ClientService:
    @staticmethod
    def get_all():
        clients = Client.query.all()
        return [client.serialize() for client in clients]
    
    @staticmethod
    def get_client(client_id):
        client = Client.query.get(client_id)
        if client is None:
            abort(404, description=f"Cliente con id {client_id} no encontrado")
        return client.serialize()

    @staticmethod
    def get_all_clients_by_user(user_id):
        clients = Client.query.filter_by(user_id=user_id).all()
        return [client.serialize() for client in clients]


    @staticmethod
    def add_client():
        data = request.get_json(silent=True) or {}

        required_fields = ["full_name", "user_id", "email", "phone"]
        missing = [field for field in required_fields if not data.get(field)]

        if missing:
            return jsonify({"message": f"Faltan campos requeridos: {', '.join(missing)}"}), 400

        # Validar usuario
        user = User.query.get(data["user_id"])
        if user is None:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Campos opcionales
        notes = data.get("notes", "")

        client = Client(
            full_name=data["full_name"],
            notes=notes,
            email=data["email"],
            phone=data["phone"],
            user_id=user.id
        )

        db.session.add(client)
        db.session.commit()

        return jsonify(client.serialize()), 201

    @staticmethod
    def delete_client(client_id):
        client = Client.query.get(client_id)

        if client is None:
            return jsonify({"message": f"Cliente con id {client_id} no encontrado"}), 404

        db.session.delete(client)
        db.session.commit()

        return f"Cliente con id {client_id} eliminado correctamente"

    @staticmethod
    def patch_client(client_id):
        data = request.get_json(silent=True) or {}

        client = Client.query.get(client_id)
        if client is None:
            return jsonify({"message": "Client not found"}), 404

        # Actualizar solo los campos enviados
        if "full_name" in data:
            client.full_name = data["full_name"]

        if "notes" in data:
            client.notes = data["notes"]

        if "email" in data:
            client.email = data["email"]

        if "phone" in data:
            client.phone = data["phone"]

        if "user_id" in data:
            client.user_id = data["user_id"]

        db.session.commit()

        return client.serialize()