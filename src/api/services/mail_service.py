import ssl
from email.message import EmailMessage
import smtplib
import os

def mailResetPass(destinatario):
    remitente = os.getenv("MAIL")
    password = os.getenv("PASSWORD")

    msg = EmailMessage()
    msg["Subject"] = "Reiniciar Contraseña"
    msg["From"] = remitente
    msg["To"] = destinatario
    msg.set_content("<a href='https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3000.app.github.dev/reset-pass'>Reiniciar Contraseña<a/>")

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(remitente, password)
        smtp.send_message(msg)

    print("Correo enviado con éxito")
mailResetPass("davidplanaquerol@gmail.com")