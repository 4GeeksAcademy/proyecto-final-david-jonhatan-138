from api.services.user_service import update_payment_by_stripe_id, update_payment_by_subscription_id
import stripe
import os
stripe.api_key = os.getenv("API_KEY_STRIPE")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
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

    @staticmethod
    def verify_event(payload, sig_header):
        return stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=endpoint_secret
        )

    @staticmethod
    def process_event(event):
        event_type = event["type"]
        data = event["data"]["object"]

        print(f"📡 Evento recibido: {event_type}")

        # Convertir StripeObject a dict
        obj = data.to_dict()

        # 1️⃣ Checkout completado
        if event_type == "checkout.session.completed":
            customer_id = obj.get("customer")
            subscription_id = obj.get("subscription")  
            if subscription_id is None:
                print("⚠️ No hay subscription en el evento, recuperando desde Stripe…")
                # Stripe crea la suscripción en invoice.paid, así que aquí no siempre existe
            else:
                update_payment_by_stripe_id(customer_id, True,subscription_id,"active")

        # 2️⃣ Pago exitoso
        elif event_type == "invoice.paid":
            subscription_id = obj.get("subscription")
            update_payment_by_subscription_id(subscription_id,True,"active")

        # 3️⃣ Pago fallido
        elif event_type == "invoice.payment_failed":
            subscription_id = obj.get("subscription")
            update_payment_by_subscription_id(subscription_id, False,"pending")

    