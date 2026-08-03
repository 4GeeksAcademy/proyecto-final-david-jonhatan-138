from flask import jsonify


def hello():
    return jsonify({
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }), 200
