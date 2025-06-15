from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import services
from datetime import timedelta
from flask_cors import CORS

app = Flask(__name__)

# Configura CORS para todo el servidor
CORS(app)

app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2025'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30) # esto para que el token expire cada 30 min

jwt = JWTManager(app)

@app.route('/registrar_usuario', methods=['POST'])
def registrar_usuario():
    '''
    cuerpo requerido:
        - nombre_usuario
        - password
        - ci
        - nombre
        - apellido
        - no se pide rol porque solo se pueden registrsr miembros de mesa, el admin ya existe
    '''
    data = request.get_json()
    
    required_fields = ['nombre_usuario', 'password', 'ci', 'nombre', 'apellido']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} es requerido"}), 400
    
    result = services.register_user(data)
    
    return result[1], 400 if result[0] < 0 else 200


@app.route('/login', methods=['POST'])
def login():
    '''
    cuerpo requerido:
        - nombre de usuario
        - password
    '''
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    password = data.get('password')
    
    if not nombre_usuario or not password:
        return jsonify({"error": "Nombre de usuario y contraseña son requeridos"}), 400
    
    resultado = services.login_user(nombre_usuario, password)
    
    if resultado[0] < 0:
        return resultado[1], 400
    
    person_data = services.get_person_data(nombre_usuario)
    
    usuario = {"ci": person_data['ci'], "nombre_usuario": nombre_usuario, "nombre": person_data['nombre'], "apellido": person_data['apellido']}
    access_token = create_access_token(identity=str(usuario['ci']), additional_claims={'nombre': usuario['nombre'], 'apellido': usuario['apellido']})

    return jsonify({
        "access_token": access_token,
        "user": usuario,
        "user_data": person_data
    }), 200
 
  
