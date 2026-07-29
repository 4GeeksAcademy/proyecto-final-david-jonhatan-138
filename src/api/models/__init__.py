from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from api.models.user import User
from api.models.appointment import Appointment
from api.models.client import Client
from api.models.service import Service
