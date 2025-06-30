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
        - id_miembro
        - no se pide rol porque solo se pueden registrsr miembros de mesa, el admin ya existe
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    required_fields = {'nombre_usuario', 'password', 'id_miembro'}
    
    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    result = services.register_user(data)
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Usuario registrado exitosamente"}), 200

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
    print("resultado: ",resultado)
    
    if resultado[0] < 0:
        return resultado[1], 400
    
    datos_usuario = dict()
    
    if resultado[1]['role_description'] == "miembroMesa":           
        person_data = services.get_person_data(nombre_usuario)
        usuario = {"ci": person_data['ci'], "nombre_usuario": nombre_usuario, "nombre": person_data['nombre'], "apellido": person_data['apellido'], "id": resultado[1]['id']}
        datos_usuario["user"] = usuario 
        
    access_token = create_access_token(identity=str(resultado[1]['id']), additional_claims={'role_description': resultado[1]['role_description'],"id": resultado[1]['id']})

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
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    required_fields = {'nombre', 'tipo', 'direccion', 'id_zona'}
    
    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    result = services.create_establishment(data)
    
    return result[1], 400 if result[0] < 0 else 200

@app.route('/establecimientos', methods=['GET'])
@jwt_required()
def get_establishments():
    '''
    obtiene todos los establecimientos
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

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
    role_description = claims.get('role_description')

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
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    allowed_fields = {'nombre', 'tipo', 'direccion', 'id_zona'}
    if not allowed_fields & data.keys(): # si la interseccion es vacía
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
    role_description = claims.get('role_description')

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
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_circuitos()

    return jsonify(result), 200 if result else ({"error": "No se encontraron circuitos"}, 404)

@app.route('/circuitos/<int:nro>', methods=['GET'])
@jwt_required()
def get_circuito(nro):
    '''
    obtiene un circuito por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_circuito(nro)

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
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    required_fields = {'nro', 'es_accesible', 'id_establecimiento'}
    
    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400

    result = services.create_circuito(data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/circuitos/<int:nro>', methods=['PATCH'])
@jwt_required()
def update_circuito(nro):
    '''
    cuerpo requerido (al menos uno):
        - es_accesible
        - id_establecimiento
        - es_accesible 
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "No tiene permisos para realizar esta acción"}), 400

    admin_allowed_fields = {'es_accesible', 'id_establecimiento'}
    
    if (role_description == "admin" and 
        not admin_allowed_fields & data.keys()): 
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400

    # Filtra solo los campos permitidos
    update_data = {}
    for field in data.keys():
        if field in admin_allowed_fields and role_description == "admin":
            update_data[field] = data[field]

    result = services.update_circuito(nro, update_data)
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": result[1]}), 200

@app.route('/circuitos/<int:nro>/abrir', methods=['POST'])
@jwt_required()
def abrir_circuito(nro):
    '''
    abre un circuito
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "miembroMesa":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por un miembro de mesa."}), 400

    result = services.abrir_circuito(claims.get('id'), nro)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Circuito abierto exitosamente"}), 200

@app.route('/circuitos/<int:nro>/cerrar', methods=['POST'])
@jwt_required()
def cerrar_circuito(nro):
    '''
    cierra un circuito
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "miembroMesa":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por un miembro de mesa."}), 400

    result = services.cerrar_circuito(claims.get('id'), nro)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Circuito cerrado exitosamente"}), 200

@app.route('/circuitos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_circuito(id):
    '''
    elimina un circuito por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_circuito(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Circuito eliminado exitosamente"}), 200

@app.route('/comisarias', methods=['GET'])
@jwt_required()
def get_comisarias():
    '''
    obtiene todas las comisarias
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_comisarias()

    return jsonify(result), 200 if result else ({"error": "No se encontraron comisarias"}, 404)

@app.route('/comisarias/<int:id>', methods=['GET'])
@jwt_required()
def get_comisaria(id):
    '''
    obtiene una comisaria por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_comisaria(id)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Comisaria no encontrada"}), 404
    
@app.route('/comisarias', methods=['POST'])
@jwt_required()
def crear_comisaria():
    '''
    cuerpo requerido:
        - calle
        - numero
        - codigo_postal
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    required_fields = ['calle', 'numero', 'codigo_postal']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} es requerido"}), 400

    result = services.create_comisaria(data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/comisarias/<int:id>', methods=['PATCH'])
@jwt_required()
def update_comisaria(id):
    '''
    cuerpo requerido (al menos uno):
        - calle
        - numero
        - codigo_postal
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    allowed_fields = ['calle', 'numero', 'codigo_postal']
    if not any(field in data for field in allowed_fields):
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400

    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data}

    result = services.update_comisaria(id, update_data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/comisarias/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_comisaria(id):
    '''
    elimina una comisaria por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_comisaria(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Comisaria eliminada exitosamente"}), 200

@app.route('/police', methods=['GET'])
@jwt_required()
def get_policias():
    '''
    obtiene todos los policias
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_policias()

    return jsonify(result), 200 if result else ({"error": "No se encontraron policias"}, 404)

@app.route('/police/<int:id>', methods=['GET'])
@jwt_required()
def get_policia(id):
    '''
    obtiene un policia por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_policia(id)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Policia no encontrado"}), 404

@app.route('/police', methods=['POST'])
@jwt_required()
def crear_policia():
    '''
    cuerpo requerido:
        - id_comisaria
        - ci_ciudadano
        _ id_establecimiento
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    required_fields = ['id_comisaria', 'ci_ciudadano', 'id_establecimiento']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} es requerido"}), 400

    result = services.create_policia(data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/police/<int:id>', methods=['PATCH'])
@jwt_required()
def update_policia(id):
    '''
    cuerpo requerido (al menos uno):
        - id_comisaria
        - id_establecimiento
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    allowed_fields = ['id_comisaria', 'id_establecimiento']
    if not any(field in data for field in allowed_fields):
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400

    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data}

    result = services.update_policia(id, update_data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/police/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_policia(id):
    '''
    elimina un policia por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_policia(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Policia eliminado exitosamente"}), 200

@app.route('/candidatos', methods=['GET'])
@jwt_required()
def get_candidatos():
    '''
    obtiene todos los candidatos
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_candidatos()

    return jsonify(result), 200 if result else ({"error": "No se encontraron candidatos"}, 404)

@app.route('/candidatos/<int:id>', methods=['GET'])
@jwt_required()
def get_candidato(id):
    '''
    obtiene un candidato por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_candidato(id)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Candidato no encontrado"}), 404

@app.route('/candidatos', methods=['POST'])
@jwt_required()
def crear_candidato():
    '''
    cuerpo requerido:
        - ci_ciudadano
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    required_fields = ['ci_ciudadano']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} es requerido"}), 400

    result = services.create_candidato(data)

    return result[1], 400 if result[0] < 0 else 200

@app.route('/candidatos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_candidato(id):
    '''
    elimina un candidato por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_candidato(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Candidato eliminado exitosamente"}), 200
    
    
@app.route('/ciudadano/add-citizen', methods=['POST'])
@jwt_required()
def add_citizen():
    '''
    cuerpo requerido:
        - ci
        - nombre
        - apellido
        - serie_credencial
        - nro_credencial
        - nro_circuito
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    data = request.get_json()
    required_fields = {'ci', 'nombre', 'apellido', 'serie_credencial', 'nro_credencial', 'nro_circuito'} # set con los campos requeridos
    
    if data.keys() != required_fields:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    
    result = services.add_citizen(data['ci'], data['nombre'], data['apellido'], data['serie_credencial'], data['nro_credencial'], data['nro_circuito'])
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    else:
        return jsonify({"message": "Ciudadano agregado exitosamente"}), 200
    

@app.route('/ciudadano/update-citizen/<int:ci>', methods=['PATCH'])
@jwt_required()
def update_citizen(ci):
    '''
    cuerpo requerido (al menos uno):
        - nombre
        - apellido
        - serie_credencial
        - nro_credencial
        - nro_circuito
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    data = request.get_json()
    allowed_fields = {'nombre', 'apellido', 'serie_credencial', 'nro_credencial', 'nro_circuito'}
    if not any(field in data for field in allowed_fields):
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400
    
    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data} 
    
    result = services.update_citizen(ci, update_data)
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    else:
        return jsonify({"message": "Ciudadano actualizado exitosamente"}), 200


# OJO: terminar luego, la idea es implementar un borrado lógico, no eliminar el ciudadano de la base de datos
@app.route('/ciudadano/delete-citizen/<int:ci>', methods=['DELETE'])
@jwt_required()
def delete_citizen(ci):
    '''
    elimina un ciudadano por su ci
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    result = services.delete_citizen(ci)
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    else:
        return jsonify({"message": "Ciudadano eliminado exitosamente"}), 200

    
@app.route('/miembro', methods=['POST'])
@jwt_required()
def add_member():
    '''
    cuerpo requerido:
        - id_organismo (público en el que trabaja)
        - ci
        - nro_circuito (al que es asignado para trabajar)
        - id_rol (presi, vice, secre)
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    data = request.get_json()
    required_fields = {'id_organismo', 'ci', 'nro_circuito', 'id_rol'}
    if data.keys() != required_fields:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    
    result = services.add_member(data['id_organismo'], data['ci'], data['nro_circuito'], data['id_rol'])
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Miembro agregado exitosamente"}), 200
    
    

    

if __name__ == "__main__":
    app.run(debug=True)