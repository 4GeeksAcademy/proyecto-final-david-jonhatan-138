import ssl
from email.message import EmailMessage
import smtplib
import os
from flask import request


def mail_reset_pass():
    data = request.get_json(silent=True) or {}
    remitente = os.getenv("MAIL")
    password = os.getenv("PASSWORD")
    destinatario = data["email"]

    msg = EmailMessage()
    msg["Subject"] = "Reiniciar Contraseña"
    msg["From"] = remitente
    msg["To"] = destinatario
    msg.set_content(f"{os.getenv("VITE_FRONTEND_URL")}/reset-pass")

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(remitente, password)
        smtp.send_message(msg)

    return "Correo enviado con éxito"
