from api.controllers.auth_controller import signup
from flask import request, jsonify
from api.services.stripe_service import StripeService
import os
class StripeController:
    @staticmethod
    def create_subscription():
        data = request.get_json()

        price_id = os.getenv("ID_PRICE_STRIPE")
        email = data["email"]
        user_id = data["userId"]

        # Crear customer
        customer = StripeService.create_customer(email, user_id)

        try:
            signup_response = signup(customer.id)
            response_obj, status_code = signup_response
            if status_code != 201:
                return signup_response
            user_json = response_obj.get_json()
            user_data = user_json.get("user")

        except Exception as e:
            print(f"Error en signup: {e}")
            return jsonify({"message": "Error creating user", "error": str(e)}), 500

        # Crear checkout session
        session = StripeService.create_checkout_session(customer.id, price_id)

        return jsonify({
            "url": session.url,
            "user": user_data
        })


