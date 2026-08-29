import stripe
import os
stripe.api_key = os.getenv("API_KEY_STRIPE")

class StripeService:

    @staticmethod
    def create_customer(email, user_id):
        return stripe.Customer.create(
            email=email,
            metadata={"user_id": user_id}
        )

    @staticmethod
    def create_checkout_session(customer_id, price_id):
        return stripe.checkout.Session.create(
            mode="subscription",
            customer=customer_id,
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=f"{os.getenv("VITE_FRONTEND_URL")}/professional?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.getenv("VITE_FRONTEND_URL")}"
        )
