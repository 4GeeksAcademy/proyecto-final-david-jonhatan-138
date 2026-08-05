from flask import jsonify
from api.services.client_service import ClientService

class ClientController:
    @staticmethod
    def get_all_clients():
        people = ClientService.get_all()
        return jsonify(people), 200

    @staticmethod
    def get_all_clients_by_user(user_id):
        people = ClientService.get_all_clients_by_user(user_id)
        return jsonify(people), 200

    @staticmethod
    def get_client(client_id):
        client = ClientService.get_client(client_id)
        return jsonify(client), 200

    @staticmethod
    def add_client():
        client = ClientService.add_client()
        return jsonify(client), 201

    @staticmethod
    def delete_client(client_id):
        client = ClientService.delete_client(client_id)
        return jsonify(client), 200

    @staticmethod
    def patch_client(client_id):
        client = ClientService.patch_client(client_id)
        return jsonify(client), 200
    

