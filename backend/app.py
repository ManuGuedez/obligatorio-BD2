from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import services
from datetime import timedelta
from flask_cors import CORS
import os
import mysql.connector

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2025'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)

jwt = JWTManager(app)

@app.route('/registrar_usuario', methods=['POST'])
@jwt_required()
def registrar_usuario():
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    required_fields = ['nombre_usuario', 'password', 'ci', 'nombre', 'apellido']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} es requerido"}), 400

    result = services.register_user(data)
    return result[1], 400 if result[0] < 0 else 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    password = data.get('password')

    if not nombre_usuario or not password:
        return jsonify({"error": "Nombre de usuario y contraseña son requeridos"}), 400

    resultado = services.login_user(nombre_usuario, password)
    if resultado[0] < 0:
        return resultado[1], 400

    datos_usuario = dict()
    if resultado[1]['role_description'] == "miembroMesa":
        person_data = services.get_person_data(nombre_usuario)
        usuario = {
            "ci": person_data['ci'],
            "nombre_usuario": nombre_usuario,
            "nombre": person_data['nombre'],
            "apellido": person_data['apellido']
        }
        datos_usuario["user"] = usuario

    access_token = create_access_token(
        identity=str(resultado[1]['id']),
        additional_claims={'role_descripcion': resultado[1]['role_description']}
    )

    datos_usuario["access_token"] = access_token
    datos_usuario["role_description"] = resultado[1]['role_description']
    return jsonify(datos_usuario), 200


if __name__ == "__main__":
    app.run(debug=True)
