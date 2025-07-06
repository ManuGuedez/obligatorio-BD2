from flask import Flask, jsonify, request, g
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required, verify_jwt_in_request
import services
from datetime import timedelta
from flask_cors import CORS
import pandas as pd
from flask_socketio import SocketIO, emit 
from datetime import datetime
import random
import os
import mysql.connector
import eventlet
import eventlet.wsgi

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2025'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)

jwt = JWTManager(app)

# Cola temporal para votos
votos_temporales = []

from flask_jwt_extended import get_jwt, verify_jwt_in_request, create_access_token
from flask import g

@app.before_request
def refresh_token_if_needed():
    try:
        verify_jwt_in_request(optional=True)
        jwt_data = get_jwt()
        if jwt_data:
            exp_timestamp = jwt_data["exp"]
            now = datetime.utcnow().timestamp()
            remaining = exp_timestamp - now

            # Si quedan menos de 15 minutos, lo renovamos
            if remaining < 900:
                identity = jwt_data["sub"]
                new_token = create_access_token(identity=identity)
                # Guardamos en g para que esté disponible después
                g.new_token = new_token
    except Exception:
        pass  # No hay token o es inválido, ignoramos
    
@app.after_request
def attach_refresh_token(response):
    if hasattr(g, "new_token"):
        response.headers["X-Refresh-Token"] = g.new_token
    return response

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
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    password = data.get('password')

    if not nombre_usuario or not password:
        return jsonify({"error": "Nombre de usuario y contraseña son requeridos"}), 400

    resultado = services.login_user(nombre_usuario, password)
    print("resultado: ",resultado)
    
    if resultado[0] < 0:
        return jsonify({"error":resultado[1]}), 400

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

    return jsonify(result), 200 if result else ({"error": "No se encontraron establecimientos"}, 400)

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
        return jsonify({"error": "Establecimiento no encontrado"}), 400
    
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

    return jsonify(result), 200 if result else ({"error": "No se encontraron circuitos"}, 400)

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
        return jsonify({"error": "Circuito no encontrado"}), 400

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

    return jsonify({"message": result[1]}), 400 if result[0] < 0 else 200

@app.route('/circuitos/bulk', methods=['POST'])
@jwt_required()
def bulk_add_circuitos():
    '''
    Recibe un archivo .xlsx con circuitos y los agrega en lote.
    Columnas: nro, es_accesible, id_establecimiento
    '''
    claims = get_jwt()
    if claims.get('role_description') != "admin":
        return jsonify({"error": "Solo el administrador puede realizar esta acción."}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No se ha proporcionado un archivo"}), 400

    file = request.files['file']
    try:
        df = pd.read_excel(file)
        required_cols = {'nro', 'es_accesible', 'id_establecimiento'}
        if not required_cols.issubset(df.columns):
            return jsonify({"error": "El archivo debe contener las columnas: " + ", ".join(required_cols)}), 400

        circuitos = [
            (int(row['nro']), bool(row['es_accesible']), int(row['id_establecimiento']))
            for _, row in df.iterrows()
        ]
        result = services.bulk_add_circuitos(circuitos)
        if result[0] < 0:
            return jsonify({"error": result[1]}), 400
        return jsonify({"message": "Circuitos agregados exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@app.route('/circuitos/<int:nro>', methods=['PATCH'])
@jwt_required()
def update_circuito(nro):
    '''
    cuerpo requerido (al menos uno):
        - es_accesible
        - id_establecimiento
    '''
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "No tiene permisos para realizar esta acción"}), 400

    admin_allowed_fields = {'es_accesible', 'id_establecimiento'}
    
    if (not admin_allowed_fields & data.keys()): 
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

    if len(votos_temporales) > 0:
        random.shuffle(votos_temporales)
        guardar_votos = services.insertar_votos(votos_temporales)
        if guardar_votos[0] < 0:
            return jsonify({"error": guardar_votos[1]}), 400

    result = services.cerrar_circuito(claims.get('id'), nro)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Circuito cerrado exitosamente"}), 200

@app.route('/circuitos/obtener-resultado-final', methods=['GET'])
@jwt_required()
def obtener_resultado_final():
    '''
    obtiene el resultado final de los circuitos
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    id_miembro = get_jwt_identity()

    if role_description != "miembroMesa":
        return jsonify({"error": "No tiene autorización para acceder a esta información."}), 400

    result = services.obtener_resultado_final(id_miembro)
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message":result[1]}), 200

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

    return jsonify(result), 200 if result else ({"error": "No se encontraron comisarias"}, 400)

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
        return jsonify({"error": "Comisaria no encontrada"}), 400
    
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

    required_fields = {'calle', 'numero', 'codigo_postal'}
    
    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    result = services.create_comisaria(data)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Comisaria creada exitosamente"}), 200

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

    allowed_fields = {'calle', 'numero', 'codigo_postal'}
    if not allowed_fields & data.keys():  # si la intersección es vacía
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400

    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data}

    result = services.update_comisaria(id, update_data)
 
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Comisaria actualizada exitosamente"}), 200

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

    return jsonify(result), 200 if result else ({"error": "No se encontraron policias"}, 400)

@app.route('/police/<int:ci>', methods=['GET'])
@jwt_required()
def get_policia(ci):
    '''
    obtiene un policia por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_policia(ci)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Policia no encontrado"}), 400

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

    required_fields = {'id_comisaria', 'ci_ciudadano', 'id_establecimiento'}

    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400

    result = services.create_policia(data)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Policia creado exitosamente"}), 200

@app.route('/police/bulk', methods=['POST'])
@jwt_required()
def bulk_add_policias():
    '''
    Recibe un archivo .xlsx con policías y los agrega en lote.
    Columnas: id_comisaria, ci_ciudadano, id_establecimiento
    '''
    claims = get_jwt()
    if claims.get('role_description') != "admin":
        return jsonify({"error": "Solo el administrador puede realizar esta acción."}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No se ha proporcionado un archivo"}), 400

    file = request.files['file']
    try:
        df = pd.read_excel(file)
        required_cols = {'id_comisaria', 'ci_ciudadano', 'id_establecimiento'}
        if not required_cols.issubset(df.columns):
            return jsonify({"error": "El archivo debe contener las columnas: " + ", ".join(required_cols)}), 400

        policias = [
            (int(row['id_comisaria']), int(row['ci_ciudadano']), int(row['id_establecimiento']))
            for _, row in df.iterrows()
        ]
        result = services.bulk_add_policias(policias)
        if result[0] < 0:
            return jsonify({"error": result[1]}), 400
        return jsonify({"message": "Policías agregados exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

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

    allowed_fields = {'id_comisaria', 'id_establecimiento'}
    if not allowed_fields & data.keys():  # si la intersección es vacía
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400

    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data}

    result = services.update_policia(id, update_data)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    else:
        return jsonify({"message": result[1]}), 200

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

    return jsonify(result), 200 if result else ({"error": "No se encontraron candidatos"}, 400)

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
        return jsonify({"error": "Candidato no encontrado"}), 400

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

@app.route('/candidatos/bulk', methods=['POST'])
@jwt_required()
def bulk_add_candidatos():
    '''
    Recibe un archivo .xlsx con candidatos y los agrega en lote.
    Columnas: ci_ciudadano
    '''
    claims = get_jwt()
    if claims.get('role_description') != "admin":
        return jsonify({"error": "Solo el administrador puede realizar esta acción."}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No se ha proporcionado un archivo"}), 400

    file = request.files['file']
    try:
        df = pd.read_excel(file)
        required_cols = {'ci_ciudadano'}
        if not required_cols.issubset(df.columns):
            return jsonify({"error": "El archivo debe contener la columna: ci_ciudadano"}), 400

        candidatos = [
            (int(row['ci_ciudadano']),)
            for _, row in df.iterrows()
        ]
        result = services.bulk_add_candidatos(candidatos)
        if result[0] < 0:
            return jsonify({"error": result[1]}), 400
        return jsonify({"message": "Candidatos agregados exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

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
    
    
@app.route('/ciudadano', methods=['POST'])
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
    
@app.route('/ciudadano/bulk', methods=['POST'])
@jwt_required()
def bulk_add_citizens():
    '''
    Recible un archivo .xlsx con ciudadanos y los agrega en lote. El archivo debe tener las siguientes columnas:
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
   
    if 'file' not in request.files:
        return jsonify({"error": "No se ha proporcionado un archivo"}), 400
    
    file = request.files['file']
    try:
        df = pd.read_excel(file)
        required_cols = {'ci', 'nombre', 'apellido', 'serie_credencial', 'nro_credencial', 'nro_circuito'}
        if not required_cols.issubset(df.columns):
            return jsonify({"error": "El archivo debe contener las columnas: " + ", ".join(required_cols)}), 400
        
        ciudadanos = []
        for _, row in df.iterrows():
            ciudadanos.append(
                (int(row['ci']),
                str(row['nombre']).capitalize(),
                str(row['apellido']).capitalize(),
                str(row['serie_credencial']).upper(),
                int(row['nro_credencial']),
                int(row['nro_circuito']))
            )
        
        result = services.bulk_add_citizens(ciudadanos)
        if result[0] < 0:
            return jsonify({"error": result[1]}), 400
        return jsonify({"message": "Ciudadanos agregados exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
        
    

@app.route('/ciudadano/<int:ci>', methods=['PATCH'])
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


@app.route('/ciudadano/<int:ci>', methods=['DELETE'])
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

@app.route('/ciudadano/get-by-ci/<int:ci>', methods=['GET'])
@jwt_required()
def get_citizen(ci):
    '''
    obtiene un ciudadano por su ci
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "miembroMesa" and role_description != "admin":
        return jsonify({"error": "No tiene credenciales para realizar esta acción."}), 400

    result = services.get_citizen(ci)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Ciudadano no encontrado"}), 400
    
@app.route('/ciudadano/get-by-cc/<string:cc>', methods=['GET'])
@jwt_required()
def get_citizen_by_cc(cc):
    '''
    obtiene un ciudadano por su nro de credencial
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "miembroMesa" and role_description != "admin":
        return jsonify({"error": "No tiene credenciales para realizar esta acción."}), 400

    result = services.get_citizen_by_cc(cc)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Ciudadano no encontrado"}), 400
    
@app.route('/ciudadano', methods=['GET'])
@jwt_required()
def get_citizens_by_member_circuit():
    '''
    obtiene todos los ciudadanos de un circuito del circuito del miembro de mesa que consulta
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    member_id = get_jwt_identity()

    if role_description != "miembroMesa":
        return jsonify({"error": "No tiene credenciales para realizar esta acción."}), 400

    result = services.get_citizens_by_member_circuit(member_id)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "No se encontraron ciudadanos en el circuito especificado"}), 400


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

@app.route('/miembro/bulk', methods=['POST'])
@jwt_required()
def bulk_add_members():
    '''
    Recibe un archivo .xlsx con miembros de mesa y los agrega en lote.
    Columnas: id_organismo, ci, nro_circuito, id_rol
    '''
    claims = get_jwt()
    if claims.get('role_description') != "admin":
        return jsonify({"error": "Solo el administrador puede realizar esta acción."}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No se ha proporcionado un archivo"}), 400

    file = request.files['file']
    try:
        df = pd.read_excel(file)
        required_cols = {'id_organismo', 'ci', 'nro_circuito', 'id_rol'}
        if not required_cols.issubset(df.columns):
            return jsonify({"error": "El archivo debe contener las columnas: " + ", ".join(required_cols)}), 400

        miembros = [
            (int(row['id_organismo']), int(row['ci']), int(row['nro_circuito']), int(row['id_rol']))
            for _, row in df.iterrows()
        ]
        result = services.bulk_add_members(miembros)
        if result[0] < 0:
            return jsonify({"error": result[1]}), 400
        return jsonify({"message": "Miembros agregados exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/miembro', methods=['GET'])    
@jwt_required()
def get_members():
    '''
    obtiene todos los miembros
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_members_data()

    return jsonify(result), 200 if result else ({"error": "No se encontraron miembros"}, 400)

@app.route('/miembro/<int:ci>', methods=['GET'])
@jwt_required()
def get_member(ci):
    '''
    obtiene un miembro por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_member_data(ci)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Miembro no encontrado"}), 400

@app.route('/miembro/<int:id>', methods=['PATCH'])
@jwt_required()
def update_member(id):
    '''
    cuerpo requerido (al menos uno):
        - id_organismo
        - nro_circuito
        - id_rol
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    data = request.get_json()
    allowed_fields = {'id_organismo', 'nro_circuito', 'id_rol'}
    
    if not allowed_fields & data.keys():
        return jsonify({"error": "Debe proporcionar al menos un campo para actualizar"}), 400
    
    # Filtra solo los campos permitidos
    update_data = {field: data[field] for field in allowed_fields if field in data}

    result = services.update_member(id, update_data)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Miembro actualizado exitosamente"}), 200

@app.route('/miembro/roles', methods=['GET'])
def get_roles_de_miembro():
    return jsonify(services.get_roles_miembro())
    

@app.route('/miembro/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_member(id):
    '''
    elimina un miembro por su id
        en realidad se manteien los datos pero queda deshabilitado
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_member(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Miembro eliminado exitosamente"}), 200
    
@app.route('/partido-politico', methods=['POST'])
@jwt_required()
def crear_partido_politico():
    '''
    cuerpo requerido:
        -  calle
        -  numero
        -  telefono
        -  codigo_postal
        -  nombre
        -  ci_presidente
        -  ci_vicepresidente
        -  color
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    data = request.get_json()
    required_fields = {'calle', 'numero', 'telefono', 'codigo_postal', 'nombre', 'ci_presidente', 'ci_vicepresidente', 'color'}
    if data.keys() != required_fields :
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    elif data['ci_presidente'] == data['ci_vicepresidente']:
        return jsonify({"error": "El presidente y el vicepresidente no pueden ser la misma persona"}), 400
    
    result = services.crear_partido(data['calle'], data['numero'], data['telefono'], data['codigo_postal'], data['nombre'], data['ci_presidente'], data['ci_vicepresidente'], data['color'])

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Partido político creado exitosamente"}), 200

@app.route('/partido-politico/bulk', methods=['POST'])
@jwt_required()
def bulk_add_partidos():
    '''
    Recibe un archivo .xlsx con partidos políticos y los agrega en lote.
    Columnas: calle, numero, telefono, codigo_postal, nombre, ci_presidente, ci_vicepresidente
    '''
    claims = get_jwt()
    if claims.get('role_description') != "admin":
        return jsonify({"error": "Solo el administrador puede realizar esta acción."}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No se ha proporcionado un archivo"}), 400

    file = request.files['file']
    try:
        df = pd.read_excel(file)
        required_cols = {'calle', 'numero', 'telefono', 'codigo_postal', 'nombre', 'ci_presidente', 'ci_vicepresidente'}
        if not required_cols.issubset(df.columns):
            return jsonify({"error": "El archivo debe contener las columnas: " + ", ".join(required_cols)}), 400

        partidos = []
        for _, row in df.iterrows():
            if row['ci_presidente'] == row['ci_vicepresidente']:
                return jsonify({"error": "El presidente y el vicepresidente no pueden ser la misma persona"}), 400
            partidos.append(
                (
                    str(row['calle']),
                    int(row['numero']),
                    str(row['telefono']),
                    str(row['codigo_postal']),
                    str(row['nombre']),
                    int(row['ci_presidente']),
                    int(row['ci_vicepresidente'])
                )
            )
        result = services.bulk_add_partidos(partidos)
        if result[0] < 0:
            return jsonify({"error": result[1]}), 400
        return jsonify({"message": "Partidos políticos agregados exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/partido-politico', methods=['GET'])
@jwt_required()
def get_partidos_politicos():
    '''
    obtiene todos los partidos políticos
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_partidos_politicos()

    return jsonify(result), 200 if result else ({"error": "No se encontraron partidos políticos"}, 400)

@app.route('/partido-politico/<int:id>', methods=['GET'])
# @jwt_required()
def get_partido(id):
    '''
    obtiene todos los partidos políticos
    '''
    result = services.get_partido(id)

    return jsonify(result), 200 if result else ({"error": "No se encontró el partido político"}, 400)


@app.route('/lista', methods=['POST'])
@jwt_required()
def crear_lista():
    '''
    crea una nueva lista de candidatos para un partido político
    campos requeridos:
        - id_partido
        - descripción 
        - nro_lista
        - id_candidato_apoyado
        - id_departamento (en el que es válida la lista)
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    data = request.get_json()
    required_fields = {'id_partido', 'descripcion', 'nro_lista', 'id_candidato_apoyado', 'id_departamento'}
    if data.keys() != required_fields:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    
    print("entra a crear lista")
    result = services.crear_lista(data['id_partido'], data['descripcion'], data['nro_lista'], data['id_candidato_apoyado'], data['id_departamento'])
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": result[1]}), 200

@app.route('/lista/agregar-candidato', methods=['POST'])
@jwt_required()
def agregar_candidato_a_lista():
    '''
    agrega candidatos a una lista existente
    cuerpo requerido:
        - nro_lista
        - id_candidato (puede ser un solo candidato o una lista de candidatos)
        - id_tipo (tipo de candidato, presidente, vicepresidente, diputado o senador)
        - posición (int)
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    data = request.get_json()
    required_fields = {'nro_lista', 'id_candidato', 'id_tipo', 'posicion'}
    
    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    result = services.agregar_candidato_a_lista(data['nro_lista'], data['id_candidato'], data['id_tipo'], data['posicion'])
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Candidato agregado a la lista exitosamente"}), 200
    
@app.route('/lista', methods=['GET'])
# @jwt_required()
def get_listas():
    '''
    obtiene todas las listas de candidatos
    '''
    result = services.get_listas()

    return jsonify(result), 200 if result else ({"error": "No se encontraron listas"}, 400)

@app.route('/lista/<int:nro>/integrantes', methods=['GET'])
# @jwt_required()
def get_integrantes_lista(nro):
    '''
    obtiene los integrantes de una lista por su nro_lista
    '''
    result = services.get_integrantes_lista(nro)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Lista no encontrada"}), 400

@app.route('/lista/<int:nro>', methods=['DELETE'])
@jwt_required()
def delete_lista(nro):
    '''
    elimina una lista por su nro_lista
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.delete_lista(nro)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Lista eliminada exitosamente"}), 200
    
@app.route('/consulta', methods=['POST'])
@jwt_required()
def crear_consulta():
    '''
    crea una nueva consulta
    cuerpo requerido:
        - descripcion
        - id_color
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "admin":
        return jsonify({"error": "No tiene autorización para realizar esta acción."}), 400
    
    data = request.get_json()
    required_fields = {'descripcion', 'id_color'}
    
    if data.keys() != required_fields:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    
    result = services.crear_consulta(data['descripcion'], data['id_color'])
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    return jsonify({"message": "Consulta creada exitosamente"}), 200

@app.route('/consulta', methods=['GET'])
# @jwt_required()
def get_consultas():
    '''
    obtiene todas las consultas
    '''
    result = services.get_consultas()

    return jsonify(result), 200 if result else ({"error": "No se encontraron consultas"}, 400)

@app.route('/consulta/<int:id>', methods=['GET'])
# @jwt_required()
def get_consulta(id):
    '''
    obtiene una consulta por su id
    '''
    result = services.get_consulta(id)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Consulta no encontrada"}), 400

@app.route('/consulta/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_consulta(id):
    '''
    elimina una consulta por su id
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    print("entra caAAAAAA")
    result = services.delete_consulta(id)

    if result[0] < 0:
        return result[1], 400
    else:
        return jsonify({"message": "Consulta eliminada exitosamente"}), 200
    
@app.route('/habilitar_votante', methods=['POST'])
@jwt_required()
def habilitar_votante():
    '''
    Habilita a un votante para que pueda votar.
    cuerpo requerido:
        - ci_ciudadano (int)
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != "miembroMesa":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por un miembro de mesa."}), 400
    
    data = request.get_json()
    
    ci_ciudadano = data["ci_ciudadano"]
    # Lógica para marcar que el votante está habilitado
    
    # evnia un mensaje (evento) a los clientes conectados por websocket
    # - 'votante_habilitado' es el nombre del evento
    # - {'ci_ciudadano': ci_ciudadano} es el payload del evento
    # namespace='/totem' es el espacio de nombres del socketio (aisla conexiones de diferentes partes de la aplicación)
    socketio.emit('votante_habilitado', {'ci_ciudadano': ci_ciudadano}) 
    return jsonify({"status": "ok"}), 200

@app.route('/emitir_voto', methods=['POST'])
def emitir_voto():
    '''
    cuerpo requerido:
        - votos (lista) con la información de los votos
                 ejemplo: voto = [{"id_estado": 1, "es_observado": 0, "nro_circuito": 2345, "id_papeleta": 9}, {}, ...] // tantos diccionarios como papeletas votadas
        - ci_ciudadano (int) del votante que emite el voto
    '''
    data = request.json
    votos = data["votos"]  # El voto NO debe tener info del votante
    ci_ciudadano = data["ci_ciudadano"]
    
    required_fields = {'votos', 'ci_ciudadano'}
    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    result = services.registrar_voto(votos, ci_ciudadano)
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400    
    
    votos_temporales.append(votos)
    print(votos_temporales)
    # Marcar en la base de datos que el votante ya votó (sin guardar el voto junto al id)
    socketio.emit('voto_emitido', {'ci_ciudadano': ci_ciudadano})

    # Si hay 10 votos, los baraja e inserta
    if len(votos_temporales) >= 10:
        random.shuffle(votos_temporales)
        result = services.insertar_votos(votos_temporales)
        if result[0] < 0:
            return jsonify({"error": result[1]}), 400
        votos_temporales.clear()

    return jsonify({"status": "ok"}), 200

@app.route('/organismo-publico', methods=["GET"])
@jwt_required()
def get_organismos_publicos():
    '''
    obtiene todas las comisarias
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400

    result = services.get_organismos_publicos()

    return jsonify(result), 200 if result else ({"error": "No se encontraron organismos públicos"}, 400)

@app.route('/resultados/listas', methods=['GET'])
@jwt_required()
def get_resultados_por_listas():
    '''
    cuerpo opcional:
        - nro_circuito (int)
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != 'admin':
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    nro_circuito = request.args.get('nro_circuito', default=None, type=int)
    result = services.obtener_votos_por_lista_con_porcentaje(nro_circuito)
    
    if result[0] < 0:
        return jsonify({"error":result[1]}), 400
    else:
        return jsonify(result[1]), 200
    
@app.route('/resultados/partido', methods=['GET'])
@jwt_required()
def get_resultados_por_partido():
    '''
    cuerpo opcional:
        - nro_circuito (int)
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != 'admin':
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    nro_circuito = request.args.get('nro_circuito', default=None, type=int)
    result = services.obtener_votos_por_partido(nro_circuito)
    
    if result[0] < 0:
        return jsonify({"error":result[1]}), 400
    else:
        return jsonify(result[1]), 200

@app.route('/resultados/candidato', methods=['GET'])
@jwt_required()
def get_resultados_por_candidato():
    '''
    Parámetro opcional:
        - nro_circuito (int)
    '''
    claims = get_jwt()
    role_description = claims.get('role_description')
    
    if role_description != 'admin':
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    nro_circuito = request.args.get('nro_circuito', default=None, type=int)
    result = services.obtener_votos_por_candidato(nro_circuito)
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    else:
        return jsonify(result[1]), 200

@app.route('/departamentos', methods=['GET'])
def get_departamentos():
    return jsonify(services.get_departamentos())

@app.route('/ciudades', methods=['POST'])
@jwt_required()
def add_ciudad():
    '''
    cuerpo requerido:
    - id_departamento
    - nombre (de la ciudad)
    '''    
    data = request.get_json()
    claims = get_jwt()
    role_description = claims.get('role_description')

    if role_description != "admin":
        return jsonify({"error": "Esta acción puede ser realizada únicamente por el administrador."}), 400
    
    required_fields = {'id_departamento', 'nombre'}
    
    if data.keys() != required_fields:
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    result = services.add_ciudad(data['nombre'], data['id_departamento'])
    
    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    else:
        return jsonify({"message": result[1]}), 201
    
@app.route('/ciudades', methods=['GET'])
def get_ciudades():
    return jsonify(services.get_ciudades())

@app.route('/zonas', methods=['POST'])
@jwt_required()
def agregar_zona():
    '''
    Crea una nueva zona. 
    '''
    claims = get_jwt()
    if claims.get("role_description") != "admin":
        return jsonify({"error": "Solo el administrador puede agregar zonas."}), 403

    data = request.get_json()
    nombre = data.get("nombre")
    id_ciudad = data.get("id_ciudad")

    if not nombre or not id_ciudad:
        return jsonify({"error": "Faltan datos requeridos (nombre, id_ciudad)"}), 400

    result = services.add_zona(nombre, id_ciudad)

    if result[0] < 0:
        return jsonify({"error": result[1]}), 400
    else:
        return jsonify({"message": result[1]}), 201


@app.route('/zonas', methods=['GET'])
def get_zonas():
    return jsonify(services.get_zonas())



if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)