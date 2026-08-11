from flask import jsonify
from api.services.service_service import ServiceService


class ServiceController:
    @staticmethod
    def get_all_services():
        services = ServiceService.get_all()
        return jsonify(services), 200

    @staticmethod
    def get_all_services_by_user(user_id):
        services = ServiceService.get_all_services_by_user(user_id)
        return jsonify(services), 200

    @staticmethod
    def get_service(service_id):
        service = ServiceService.get_service(service_id)
        return jsonify(service), 200

    @staticmethod
    def add_service():
        service = ServiceService.add_service()
        return service

    @staticmethod
    def delete_service(service_id):
        service = ServiceService.delete_service(service_id)
        return service

    @staticmethod
    def patch_service(service_id):
        service = ServiceService.patch_service(service_id)
        return jsonify(service), 200
