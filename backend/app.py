from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import services
from datetime import timedelta
from flask_cors import CORS

app = Flask(__name__)

# Configura CORS para todo el servidor
CORS(app)

app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2024'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30) # esto para que el token expire cada 30 min

jwt = JWTManager(app)