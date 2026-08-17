from flask import jsonify
from api.services.mail_service import mail_reset_pass


def mail_reset_pass_controller():
    mensaje = mail_reset_pass()
    return jsonify({
        "message": mensaje
    }), 200
