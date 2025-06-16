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
@jwt_required()
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
    
    datos_usuario = dict()
    
    if resultado[1]['role_description'] == "miembroMesa":           
        person_data = services.get_person_data(nombre_usuario)
        usuario = {"ci": person_data['ci'], "nombre_usuario": nombre_usuario, "nombre": person_data['nombre'], "apellido": person_data['apellido']}
        datos_usuario["user"] = usuario 
        
    access_token = create_access_token(identity=str(resultado[1]['id']), additional_claims={'role_descripcion': resultado[1]['role_description']})

    datos_usuario["access_token"] = access_token
    datos_usuario["role_description"] = resultado[1]['role_description']
    return jsonify(datos_usuario), 200

@app.route('/establecimientos', methods=['POST'])
@jwt_required()
def crear_establecimiento():
    '''
    cuerpo requerido:
        - nombre
        - tipo
        - direccion
        - id_zona
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_descripcion')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    required_fields = ['nombre', 'tipo', 'direccion', 'id_zona']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} es requerido"}), 400
    
    result = services.create_establishment(data)
    
    return result[1], 400 if result[0] < 0 else 200

@app.route('/establecimientos', methods=['GET'])
@jwt_required()
def get_establishments():
    '''
    obtiene todos los establecimientos
    '''
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_establishments()

    return jsonify(result), 200 if result else ({"error": "No se encontraron establecimientos"}, 404)

@app.route('/establecimientos/<int:id>', methods=['GET'])
@jwt_required()
def get_establishment(id):
    '''
    obtiene un establecimiento por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_establishment(id)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Establecimiento no encontrado"}), 404
    
@app.route('/establecimientos/<int:id>', methods=['PATCH'])
@jwt_required()
def update_establishment(id):
    '''
    cuerpo requerido (al menos uno):
        - nombre
        - tipo
        - direccion
        - id_zona
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    allowed_fields = ['nombre', 'tipo', 'direccion', 'id_zona']
    if not any(field in data for field in allowed_fields):
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400

    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data}

    result = services.update_establishment(id, update_data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/establecimientos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_establishment(id):
    '''
    elimina un establecimiento por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_establishment(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Establecimiento eliminado exitosamente"}), 200
    
@app.route('/circuitos', methods=['GET'])
@jwt_required()
def get_circuitos():
    '''
    obtiene todos los circuitos
    '''
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_circuitos()

    return jsonify(result), 200 if result else ({"error": "No se encontraron circuitos"}, 404)

@app.route('/circuitos/<int:id>', methods=['GET'])
@jwt_required()
def get_circuito(id):
    '''
    obtiene un circuito por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_circuito(id)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Circuito no encontrado"}), 404
    
@app.route('/circuitos', methods=['POST'])
@jwt_required()
def crear_circuito():
    '''
    cuerpo requerido:
        - nro
        - es_accesible
        - id_establecimiento
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    required_fields = ['nro', 'es_accesible', 'id_establecimiento']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} es requerido"}), 400

    result = services.create_circuito(data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/circuitos/<int:id>', methods=['PATCH'])
@jwt_required()
def update_circuito(id):
    '''
    cuerpo requerido (al menos uno):
        - es_accesible
        - id_establecimiento
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    allowed_fields = ['es_accesible', 'id_establecimiento']
    if not any(field in data for field in allowed_fields):
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400

    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data}

    result = services.update_circuito(id, update_data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/circuitos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_circuito(id):
    '''
    elimina un circuito por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_descripcion')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_circuito(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Circuito eliminado exitosamente"}), 200

if __name__ == "__main__":
    app.run(debug=True)