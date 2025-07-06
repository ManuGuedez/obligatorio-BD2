import mysql.connector as mysql
from mysql.connector.errors import IntegrityError
import encriptacion_contraseña as encrypt
from datetime import datetime

cnx = mysql.connect(user='xr_g6_admin', password='Bd2025!', host='mysql.reto-ucu.net', port=50006, database='XR_Grupo6') #mysql
cursor = cnx.cursor(dictionary=True) # devuelve la info en formato key-value

# prueba de inserción de datos para ver si funciona la conexión
def test_add_rol():
    query = 'INSERT INTO  Rol_usuario (descripcion_rol) VALUE (%s)'
    values = ('administrador',)
    cursor.execute(query, values)

    query = 'SELECT * FROM Rol_usuario'
    cursor.execute(query)
    data = cursor.fetchall()
    print(data)

# test_add_rol() -> [{'id': 1, 'descripcion_rol': 'administrador'}]

def verify_person(nombre, apellido, ci):
    '''
    verifica si la persona ya existe en la base de datos
    retorna True si existe, False si no
    '''
    query = 'SELECT 1 FROM Ciudadano WHERE ci = %s AND nombre = %s AND apellido = %s'
    cursor.execute(query, (ci, nombre, apellido))
    result = cursor.fetchone()
    
    if result:
        return True
    return False

def veriby_member(id):
    '''
    verifica si el miembro ya existe en la base de datos
    retorna True si existe, False si no
    '''
    query = 'SELECT 1 FROM Miembro_mesa WHERE id_miembro = %s'
    cursor.execute(query, (id,))
    result = cursor.fetchone()
    
    if result:
        return True
    return False
    
def get_role_id(role_name):
    '''
    obtiene el id del rol dado su nombre
    retorna el id del rol o None si no existe
    '''
    query = 'SELECT id FROM Rol_usuario WHERE descripcion_rol = %s'
    cursor.execute(query, (role_name,))
    result = cursor.fetchone()
    
    if result:
        return result['id']
    return None

def register_user(data, role_name='miembroMesa'):
    if not veriby_member(data['id_miembro']):
        message = f"No se encontró el miembro con ID {data['id_miembro']} en la base de datos."
        return -1, message

    hashed_password, salt = encrypt.encrypt_password(data['password'])
    
    current_role_id = int(get_role_id(role_name))
    if current_role_id is None:
        message = f"El rol '{role_name}' no existe en la base de datos"
        return -1, message

    try:
        query = 'INSERT INTO Usuario (nombre_usuario, contraseña, salt, id_rol_usuario) VALUES (%s, %s, %s, %s)'
        values = (data['nombre_usuario'], hashed_password, salt.hex(), current_role_id)
        cursor.execute(query, values)

        query = 'INSERT INTO Usuario_miembro (id_usuario, id_miembro) VALUES (LAST_INSERT_ID(), %s)'
        cursor.execute(query, (data['id_miembro'],))

        cnx.commit()
        message = "Usuario registrado exitosamente"
        return 1, message

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            message = f"El nombre de usuario '{data['nombre_usuario']}' ya fue ingresado."
            return -1, message
        else:
            # Otro error de integridad
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"

def get_role(id):
    '''
    obtiene el rol dado su id
    retorna el nombre del rol o None si no existe
    '''
    query = 'SELECT descripcion_rol FROM Rol_usuario WHERE id = %s'
    cursor.execute(query, (id,))
    result = cursor.fetchone()
    
    if result:
        return result['descripcion_rol']
    return None

def login_user(nombre_usuario, password):
    '''
    verifica si el usuario existe y si la contraseña es correcta
    retorna el nombre del usuario y el id del rol si es correcto, None en caso contrario
    '''
    query = '''SELECT id, contraseña, salt, id_rol_usuario 
                FROM Usuario 
                WHERE nombre_usuario = %s'''
    cursor.execute(query, (nombre_usuario,))
    result = cursor.fetchone()
    
    if not result:
        return -1, "Hubo un error al iniciar sesión, ingrese nuevamente las credenciales" 
        
    stored_hash = result['contraseña']
    stored_salt = result['salt']
    
    if encrypt.verify_password(stored_hash, stored_salt, password):
        current_role = get_role(result['id_rol_usuario'])
        if current_role is None:
            return -1, "Hubo un error al iniciar sesión, ingrese nuevamente las credenciales"
        query = 'SELECT id_miembro FROM Usuario_miembro WHERE id_usuario = %s'
        cursor.execute(query, (result['id'],))
        member_id = cursor.fetchone()
        if member_id:
            result['id'] = member_id['id_miembro']
            print(f"Usuario {nombre_usuario} con ID {result['id']} ha iniciado sesión correctamente.")
        user_details = {"user_name": nombre_usuario, "role_description": current_role ,"id": result['id']}
        return 1, user_details
    return -1, "Hubo un error al iniciar sesión, ingrese nuevamente las credenciales" 

def get_person_data(nombre_usuario):
    '''
    obtiene los datos de la persona dado su nombre de usuario
    retorna un diccionario con los datos de la persona
    '''
    query = """SELECT c.ci, c.nombre, c.apellido, r.descripcion_rol 
                FROM Ciudadano c 
                JOIN Miembro_mesa m ON (c.ci = m.ci_ciudadano)
                JOIN Usuario_miembro um ON (m.id_miembro = um.id_miembro)  
                JOIN Usuario u ON (um.id_usuario = u.id) 
                JOIN Rol_usuario r ON (u.id_rol_usuario = r.id)
                WHERE u.nombre_usuario = %s
                """
    cursor.execute(query, (nombre_usuario,))
    result = cursor.fetchone()
    
    if result:
        return result
    return None

def verify_establishment(nombre, direccion, id_zona):
    '''
    verifica si el establecimiento ya existe en la base de datos
    es necesario porque al tener el id autoincremental, no se puede verificar por id
    retorna True si existe, False si no
    '''
    query = 'SELECT 1 FROM Establecimiento WHERE (nombre = %s OR direccion = %s) AND id_zona = %s'
    cursor.execute(query, (nombre, direccion, id_zona))
    result = cursor.fetchone()
    
    if result:
        return True
    return False

def create_establishment(data):
    if verify_establishment(data['nombre'], data['direccion'], data['id_zona']):
        message = f"El establecimiento {data['nombre']}, {data['direccion']}, {data['id_zona']} ya está registrado en la base de datos."
        return -1, message

    try:
        query = 'INSERT INTO Establecimiento (nombre, tipo, direccion, id_zona) VALUES (%s, %s, %s, %s)'
        valores = (
            data['nombre'],
            data['tipo'],
            data['direccion'].capitalize(),
            data['id_zona']
        )
        cursor.execute(query, valores)

        cnx.commit()
        message = "Establecimiento registrado exitosamente"
        return 1, message

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            message = f"El Establecimiento '{data['nombre']}' ya fue ingresado."
            return -1, message
        else:
            # Otro error de integridad
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"
    
def get_establishments():
    '''
    obtiene todos los establecimientos
    '''
    query = '''
        SELECT e.id as id_est, e.nombre as nombre_est, e.tipo as tipo_est, e.direccion as direccion_est,
                z.nombre as nombre_zona, c.nombre as ciudad, d.nombre as departamento
            FROM Establecimiento e
            JOIN Zona z ON e.id_zona = z.id
            JOIN Ciudad c ON z.id_ciudad = c.id
            JOIN Departamento d ON c.id_departamento = d.id'''
            
    cursor.execute(query)
    result = cursor.fetchall()

    if result:
        return result
    return None

def get_establishment(id):
    '''
    obtiene un establecimiento por su id
    '''
    query = '''
        SELECT e.id as id_est, e.nombre as nombre_est, e.tipo as tipo_est, e.direccion as direccion_est,
            z.nombre as nombre_zona, c.nombre as ciudad, d.nombre as departamento
        FROM Establecimiento e
        JOIN Zona z ON e.id_zona = z.id
        JOIN Ciudad c ON z.id_ciudad = c.id
        JOIN Departamento d ON c.id_departamento = d.id
        WHERE e.id = %s'''
    cursor.execute(query, (id,))
    result = cursor.fetchone()

    if result:
        return result
    return None

def update_establishment(id, data):
    '''
    Actualiza un establecimiento por su id.
    Solo actualiza los campos presentes en el diccionario data.
    '''
    if not data:
        return -1, "No se proporcionaron datos para actualizar"

    fields = []
    values = []
    for key in ['nombre', 'tipo', 'direccion', 'id_zona']:
        if key in data:
            fields.append(f"{key} = %s")
            values.append(data[key])
    if not fields:
        return -1, "No se proporcionaron campos válidos para actualizar"

    query = f"UPDATE Establecimiento SET {', '.join(fields)} WHERE id = %s"
    values.append(id)
    cursor.execute(query, values)
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Establecimiento actualizado exitosamente"
    else:
        return -1, "No se encontró el establecimiento o no se realizaron cambios"

def delete_establishment(id):
    '''
    elimina un establecimiento por su id
    '''
    query = 'DELETE FROM Establecimiento WHERE id = %s'
    cursor.execute(query, (id,))
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Establecimiento eliminado exitosamente"
    else:
        return -1, "No se encontró el establecimiento o no se realizaron cambios"
    
def get_circuitos():
    '''
    obtiene todos los circuitos
    '''
    query = 'SELECT * FROM Circuito'
    cursor.execute(query)
    result = cursor.fetchall()
    if result:
        return result
    return None

def get_circuito(nro):
    '''
    obtiene un circuito por su id
    '''
    query = 'SELECT * FROM Circuito WHERE nro = %s'
    cursor.execute(query, (nro,))
    result = cursor.fetchone()

    if result:
        return result
    return None

def create_circuito(data):
    '''
    crea un circuito
    '''
    try:
        query = 'INSERT IGNORE INTO Circuito (nro, es_accesible, id_establecimiento) VALUES (%s, %s, %s)' # ignora si se intenta insertar un circuito con el mismo nro
        valores = (data['nro'], data['es_accesible'], data['id_establecimiento'])
        cursor.execute(query, valores)

        cnx.commit()
        message = "Circuito creado exitosamente"
        return 1, message

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            message = f"El Circuito '{data['nombre']}' ya fue ingresado."
            return -1, message
        else:
            # Otro error de integridad
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"

def is_member_assigned_to_circuito(id_miembro, nro):
    '''
    verifica si un miembro de mesa está asignado a un circuito
    retorna True si está asignado, False si no
    '''
    query = '''
        SELECT 1
        FROM Miembro_mesa
        WHERE id_miembro = %s AND nro_circuito = %s
    '''
    cursor.execute(query, (id_miembro, nro))
    result = cursor.fetchone()
    
    return result is not None

def abrir_circuito(id_miembro, nro):
    '''
    abre un circuito por su nro
    '''

    if not is_member_assigned_to_circuito(id_miembro, nro):
        return -1, "El miembro de mesa no está asignado a este circuito"
    
    query = '''
        UPDATE Circuito
        SET se_abrio = TRUE, es_cerrado = FALSE
        WHERE nro = %s AND se_abrio = FALSE AND es_cerrado = TRUE
    '''
    cursor.execute(query, (nro,))
    cnx.commit()
    
    if cursor.rowcount > 0:
        return 1, "Circuito abierto exitosamente"
    elif cursor.rowcount == 0:
        return -1, "El circuito ya está abierto."
    else:
        return -1, "No se encontró el circuito."    

def cerrar_circuito(id_miembro, nro):
    '''
    cierra un circuito por su nro
    '''

    if not is_member_assigned_to_circuito(id_miembro, nro):
        return -1, "El miembro de mesa no está asignado a este circuito"
    
    query = '''
        UPDATE Circuito
        SET es_cerrado = TRUE
        WHERE nro = %s AND es_cerrado = FALSE 
    '''
    cursor.execute(query, (nro,))
    cnx.commit()
    
    if cursor.rowcount > 0:
        return 1, "Circuito cerrado exitosamente"
    elif cursor.rowcount == 0:  
        return -1, "El circuito ya está cerrado"
    else:
        return -1, "No se encontró el circuito."

def update_circuito(nro, data):
    '''
    Actualiza un circuito por su id.
    Solo actualiza los campos presentes en el diccionario data.
    '''
    if not data:
        return -1, "No se proporcionaron datos para actualizar"
    
    fields = []
    values = []
    for key in ['es_accesible', 'id_establecimiento']:
        if key in data:
            fields.append(f"{key} = %s")
            values.append(data[key])
            
    if not fields:
        return -1, "No se proporcionaron campos válidos para actualizar"
    query = f"UPDATE Circuito SET {', '.join(fields)} WHERE nro = %s"
    values.append(nro)
    cursor.execute(query, values)
    cnx.commit()
    
    if cursor.rowcount > 0:
        return 1, "Circuito actualizado exitosamente"
    else:
        return -1, "No se encontró el circuito o no se realizaron cambios"
    
def delete_circuito(nro):
    '''
    elimina un circuito por su nro
    '''
    query = 'DELETE FROM Circuito WHERE nro = %s'
    cursor.execute(query, (nro,))
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Circuito eliminado exitosamente"
    else:
        return -1, "No se encontró el circuito o no se realizaron cambios"

def get_comisarias():
    '''
    obtiene todas las comisarías
    '''
    query = 'SELECT * FROM Comisaria'
    cursor.execute(query)
    result = cursor.fetchall()
    if result:
        return result
    return None

def get_comisaria(id):
    '''
    obtiene una comisaría por su id
    '''
    query = 'SELECT * FROM Comisaria WHERE id = %s'
    cursor.execute(query, (id,))
    result = cursor.fetchone()

    if result:
        return result
    return None

def create_comisaria(data):
    '''
    crea una comisaría
    '''
    try:
        query = 'INSERT INTO Comisaria (calle, numero, codigo_postal) VALUES (%s, %s, %s)'
        valores = (data['calle'], data['numero'], data['codigo_postal'])
        cursor.execute(query, valores)

        cnx.commit()
        message = "Comisaría creada exitosamente"
        return 1, message

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            message = f"La Comisaría '{data['']}' ya fue ingresada."
            return -1, message
        else:
            # Otro error de integridad
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"

def update_comisaria(id, data):
    '''
    Actualiza una comisaría por su id.
    Solo actualiza los campos presentes en el diccionario data.
    '''
    if not data:
        return -1, "No se proporcionaron datos para actualizar"
    fields = []
    values = []
    for key in ['calle', 'numero', 'codigo_postal']:
        if key in data:
            fields.append(f"{key} = %s")
            values.append(data[key])
    if not fields:
        return -1, "No se proporcionaron campos válidos para actualizar"
    query = f"UPDATE Comisaria SET {', '.join(fields)} WHERE id = %s"
    values.append(id)
    cursor.execute(query, values)
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Comisaría actualizada exitosamente"
    else:
        return -1, "No se encontró la comisaría o no se realizaron cambios"

def delete_comisaria(id):
    '''
    elimina una comisaría por su id
    '''
    query = 'DELETE FROM Comisaria WHERE id = %s'
    cursor.execute(query, (id,))
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Comisaría eliminada exitosamente"
    else:
        return -1, "No se encontró la comisaría o no se realizaron cambios"

def get_policias():
    '''
    obtiene todos los policías
    '''
    query = 'SELECT * FROM Policia'
    cursor.execute(query)
    result = cursor.fetchall()
    if result:
        return result
    return None

def get_policia(id):
    '''
    obtiene un policía por su id
    '''
    query = 'SELECT * FROM Policia WHERE ci_ciudadano = %s'
    cursor.execute(query, (id,))
    result = cursor.fetchone()

    if result:
        return result
    return None

def create_policia(data):
    '''
    crea un policía
    '''
    try:
        query = 'INSERT INTO Policia (id_comisaria, ci_ciudadano, id_establecimiento) VALUES (%s, %s, %s)'
        valores = (data['id_comisaria'], data['ci_ciudadano'], data['id_establecimiento'])
        cursor.execute(query, valores)

        cnx.commit()
        message = "Policía creado exitosamente"
        return 1, message

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            message = f"El Policía '{data['ci_ciudadano']}' ya fue ingresado."
            return -1, message
        else:
            # Otro error de integridad
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"

def update_policia(id, data):
    '''
    Actualiza un policía por su id.
    Solo actualiza los campos presentes en el diccionario data.
    '''
    if not data:
        return -1, "No se proporcionaron datos para actualizar"
    fields = []
    values = []
    for key in ['id_comisaria', 'id_establecimiento']:
        if key in data:
            fields.append(f"{key} = %s")
            values.append(data[key])
    if not fields:
        return -1, "No se proporcionaron campos válidos para actualizar"
    query = f"UPDATE Policia SET {', '.join(fields)} WHERE id_policia = %s"
    values.append(id)
    cursor.execute(query, values)
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Policía actualizado exitosamente"
    else:
        return -1, "No se encontró el policía o no se realizaron cambios"

def delete_policia(id):
    '''
    elimina un policía por su id
    '''
    query = 'DELETE FROM Policia WHERE id_policia = %s'
    cursor.execute(query, (id,))
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Policía eliminado exitosamente"
    else:
        return -1, "No se encontró el policía o no se realizaron cambios"

def get_candidatos():
    '''
    obtiene todos los candidatos
    '''
    query = '''
        SELECT c.nombre, c.apellido, can.id
            FROM Candidato can
            JOIN Ciudadano c ON can.ci_ciudadano = c.ci
        '''
    cursor.execute(query)
    result = cursor.fetchall()
    
    if result:
        return result
    return None

def get_candidato(id):
    '''
    obtiene un candidato por su id
    '''
    query = '''
        SELECT c.nombre, c.apellido, can.id
            FROM Candidato can
            JOIN Ciudadano c ON can.ci_ciudadano = c.ci
            WHERE id = %s
    '''
    cursor.execute(query, (id,))
    result = cursor.fetchone()
    if result:
        return result
    return None

def create_candidato(data):
    '''
    crea un candidato
    '''
    try:
        query = 'INSERT INTO Candidato (ci_ciudadano) VALUES (%s)'
        valores = (data['ci_ciudadano'],)
        cursor.execute(query, valores)

        cnx.commit()
        message = "Candidato creado exitosamente"
        return 1, message

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            message = f"El Candidato '{data['ci_ciudadano']}' ya fue ingresado."
            return -1, message
        else:
            # Otro error de integridad
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"

def delete_candidato(id):
    '''
    elimina un candidato por su id
    '''
    query = 'DELETE FROM Candidato WHERE id = %s'
    cursor.execute(query, (id,))
    cnx.commit()
    if cursor.rowcount > 0:
        return 1, "Candidato eliminado exitosamente"
    else:
        return -1, "No se encontró el candidato o no se realizaron cambios"
    

def format_citizen_data(nombre, apellido, serie_credencial, nro_credencial, nro_circuito):
    '''
    Formatea los datos del ciudadano para ser insertados en la base de datos.
    Convierte el nombre y apellido a mayúsculas y la serie de credencial a mayúsculas.
    '''
    nombre = nombre.capitalize()
    apellido = apellido.capitalize()
    serie_credencial = serie_credencial.upper()
    
    return {
        'nombre': nombre,
        'apellido': apellido,
        'serie_credencial': serie_credencial,
        'nro_credencial': int(nro_credencial),
        'nro_circuito': int(nro_circuito)
    }

def add_citizen(ci, nombre, apellido, serie_credencial, nro_credencial, nro_circuito):
    '''
    Agrega un ciudadano a la base de datos.
    Si el ciudadano ya existe, no se agrega y se retorna un mensaje de error.
    '''
    # Formatear los datos del ciudadano
    citizen_data = format_citizen_data(nombre, apellido, serie_credencial, nro_credencial, nro_circuito)
   
    if verify_person(citizen_data['nombre'], citizen_data['apellido'], ci):
        return -1, f"El ciudadano {citizen_data['nombre']} {citizen_data['apellido']} ya está registrado en la base de datos."

    try:
        query = 'INSERT INTO Ciudadano (ci, nombre, apellido, serie_credencial, nro_credencial, nro_circuito) VALUES (%s, %s, %s, %s, %s, %s)'
        values = (
            ci,
            citizen_data['nombre'],
            citizen_data['apellido'],
            citizen_data['serie_credencial'],
            citizen_data['nro_credencial'],
            citizen_data['nro_circuito']
        )
        cursor.execute(query, values)

        cnx.commit()
        return 1, "Ciudadano agregado exitosamente"

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            return -1, f"El ciudadano con CI {ci} ya fue ingresado o se repite la credencial."
        else:
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, str(e)
    

def update_citizen(ci, update_data):
    '''
    Actualiza los datos de un ciudadano.
    '''
    
    fields = []
    values = []
    for key in ['nombre', 'apellido', 'serie_credencial', 'nro_credencial', 'nro_circuito']:
        if key in update_data:
            fields.append(f"{key} = %s")
            if key == 'nombre' or key == 'apellido':
                value = update_data[key].capitalize()
            elif key == 'serie_credencial':
                value = update_data[key].upper()
            elif key == 'nro_credencial' or key == 'nro_circuito':
                value = int(update_data[key])
            print(f"Actualizando {key} a: {value}")
            values.append(value)
    
    if not fields:
        return -1, "No se proporcionaron campos válidos para actualizar"

    query = f"UPDATE Ciudadano SET {', '.join(fields)} WHERE ci = %s"
    values.append(ci)
    
    cursor.execute(query, values)
    cnx.commit()
    
    if cursor.rowcount > 0:
        return 1, "Ciudadano actualizado exitosamente"
    else:
        return -1, "No se encontraron cambios o el ciudadano no existe"
    

def delete_citizen(ci):
    try:
        cursor = cnx.cursor()
        cursor.execute("DELETE FROM Ciudadano WHERE ci = %s", (ci,))
        cnx.commit()

        if cursor.rowcount == 0:
            return -1, f"No existe un ciudadano con ci {ci}"

        return 1, f"Ciudadano con ci {ci} eliminado correctamente"

    except IntegrityError as e:
        # Error 1451 = clave foránea en uso (Cannot delete or update a parent row)
        if e.errno == 1451:
            return -1, "El ciudadano no se puede eliminar dado que está siendo referenciado por otra tabla"
        else:
            return -1, "Error de integridad: " + str(e)

    except Exception as e:
        return -1, f"Error al eliminar ciudadano: {str(e)}"

def add_member(id_organismo,ci, nro_circuito, id_rol):
    '''
    Agrega un miembro a la base de datos.
    Si el miembro ya existe, no se agrega y se retorna un mensaje de error.
    '''
    try:
        query = '''
            INSERT INTO Miembro_mesa (id_organismo, ci_ciudadano, nro_circuito, id_rol)
            SELECT %s, %s, %s, %s
            FROM DUAL
            WHERE NOT EXISTS (
                SELECT 1 FROM Miembro_mesa
                WHERE nro_circuito = %s AND id_rol = %s
            )
        '''
        values = (id_organismo, ci, nro_circuito, id_rol, nro_circuito, id_rol)
        cursor.execute(query, values)

        cnx.commit()
        if cursor.rowcount > 0:
            return 1, "Miembro agregado exitosamente"
        else:
            return -1, "Ya existe un miembro con ese rol en el circuito"

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            return -1, f"El miembro con CI {ci} ya fue ingresado."
        else:
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, str(e)
    
def get_members_data():
    '''
    Obtiene todos los miembros de mesa.
    '''
    query = '''
        SELECT m.id_miembro, m.nro_circuito, rm.descripcion as rol_en_mesa, c.nombre, c.apellido
            FROM Miembro_mesa m
            JOIN Ciudadano c ON m.ci_ciudadano = c.ci
            JOIN Rol_mesa rm ON m.id_rol = rm.id
    '''
    cursor.execute(query)
    result = cursor.fetchall()
    
    if result:
        return result
    return None

def get_member_data(id):
    '''
    Obtiene los datos de un miembro de mesa por su ID.
    '''
    query = '''
        SELECT m.id_miembro, m.nro_circuito, rm.descripcion as rol_en_mesa, c.nombre, c.apellido
            FROM Miembro_mesa m
            JOIN Ciudadano c ON m.ci_ciudadano = c.ci
            JOIN Rol_mesa rm ON m.id_rol = rm.id
            WHERE m.id_miembro = %s
    '''
    cursor.execute(query, (id,))
    result = cursor.fetchone()
    
    if result:
        return result
    return None

def validar_posicion_miembro_disponible(nro_circuito, id_rol):
    '''
    Verifica si un miembro de mesa con el mismo nro_circuito y id_rol ya existe.
    Retorna True si está disponible, False si ya existe.
    '''
    query = '''
        SELECT 1 FROM Miembro_mesa
        WHERE nro_circuito = %s AND id_rol = %s
    '''
    cursor.execute(query, (nro_circuito, id_rol))
    result = cursor.fetchone()
    
    return result is None

def update_member(member_id, update_data):
    '''
    Actualiza los datos de un miembro de mesa.
    '''
    fields = []
    values = []
    for key in ['nro_circuito', 'id_rol', 'id_organismo']:
        if key in update_data:
            fields.append(f"{key} = %s")
            values.append(update_data[key])
    
    if not fields:
        return -1, "No se proporcionaron campos válidos para actualizar"
    
    if not 'nro_circuito' in update_data:
        result = get_member_data(member_id)
        if result:
            update_data['nro_circuito'] = result['nro_circuito']
        else:
            return -1, "No se encontró el miembro con el ID proporcionado"
    
    if not validar_posicion_miembro_disponible(update_data['nro_circuito'], update_data['id_rol']):
        return -1, "Ya existe un miembro con ese rol en el circuito, debe eliminar o actualizar el otro miembro primero"

    query = f"UPDATE Miembro_mesa SET {', '.join(fields)} WHERE id_miembro = %s"
    values.append(member_id)
    
    cursor.execute(query, values)
    cnx.commit()
    
    if cursor.rowcount > 0:
        return 1, "Miembro actualizado exitosamente"
    else:
        return -1, "No se encontraron cambios o el miembro no existe"
    
def delete_member(id):
    '''
    Elimina un miembro de mesa por su id
    '''
    query = 'DELETE FROM Miembro_mesa WHERE id_miembro = %s'
    cursor.execute(query, (id,))
    cnx.commit()
    
    if cursor.rowcount > 0:
        return 1, "Miembro eliminado exitosamente"
    else:
        return -1, "No se encontró el miembro o no se realizaron cambios"
    
def crear_partido(calle, numero, telefono, codigo_postal, nombre, ci_presidente, ci_vicepresidente):
    '''
    argega un nuevo partido político
    '''
    try:
        query = '''
            INSERT INTO Partido_politico (calle, numero, telefono, codigo_postal, nombre, ci_presidente, ci_vicepresidente)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        values = (calle, numero, telefono, codigo_postal, nombre, ci_presidente, ci_vicepresidente)
        cursor.execute(query, values)

        cnx.commit()
        return 1, "Partido creado exitosamente"

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            return -1, f"El partido '{nombre}' ya fue ingresado."
        else:
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"

def get_partidos_politicos():
    '''
    Obtiene todos los partidos políticos.
    '''
    query = '''
        SELECT pp.id, pp.nombre, pp.calle, pp.numero, pp.telefono, pp.codigo_postal,
               c.nombre AS presidente_nombre, c.apellido AS presidente_apellido,
               v.nombre AS vicepresidente_nombre, v.apellido AS vicepresidente_apellido
        FROM Partido_politico pp
        JOIN Ciudadano c ON pp.ci_presidente = c.ci
        JOIN Ciudadano v ON pp.ci_vicepresidente = v.ci
    '''
    cursor.execute(query)
    result = cursor.fetchall()
    
    if result:
        return result
    return None

def bulk_add_citizens(ciudadanos):
    '''
    Inserta muchos ciudadanos usando executemany.
    '''
    try:
        query = '''
            INSERT IGNORE INTO Ciudadano (ci, nombre, apellido, serie_credencial, nro_credencial, nro_circuito)
            VALUES (%s, %s, %s, %s, %s, %s)
        '''
        cursor.executemany(query, ciudadanos)
        cnx.commit()
        return 1, cursor.rowcount
    except Exception as e:
        return -1, str(e)
    
def bulk_add_circuitos(circuitos):
    '''
    Inserta muchos circuitos usando executemany.
    '''
    try:
        query = '''
            INSERT IGNORE INTO Circuito (nro, es_accesible, id_establecimiento)
            VALUES (%s, %s, %s)
        '''
        cursor.executemany(query, circuitos)
        cnx.commit()
        return 1, cursor.rowcount
    except Exception as e:
        return -1, str(e)

def bulk_add_members(miembros):
    '''
    Inserta muchos miembros de mesa usando executemany.
    '''
    try:
        query = '''
            INSERT IGNORE INTO Miembro_mesa (id_organismo, ci_ciudadano, nro_circuito, id_rol)
            VALUES (%s, %s, %s, %s)
        '''
        cursor.executemany(query, miembros)
        cnx.commit()
        return 1, cursor.rowcount
    except Exception as e:
        return -1, str(e)

def bulk_add_policias(policias):
    '''
    Inserta muchos policías usando executemany.
    '''
    try:
        query = '''
            INSERT IGNORE INTO Policia (id_comisaria, ci_ciudadano, id_establecimiento)
            VALUES (%s, %s, %s)
        '''
        cursor.executemany(query, policias)
        cnx.commit()
        return 1, cursor.rowcount
    except Exception as e:
        return -1, str(e)

def bulk_add_candidatos(candidatos):
    '''
    Inserta muchos candidatos usando executemany.
    '''
    try:
        query = '''
            INSERT IGNORE INTO Candidato (ci_ciudadano)
            VALUES (%s)
        '''
        cursor.executemany(query, candidatos)
        cnx.commit()
        return 1, cursor.rowcount
    except Exception as e:
        return -1, str(e)

def bulk_add_partidos(partidos):
    '''
    Inserta muchos partidos políticos usando executemany.
    '''
    try:
        query = '''
            INSERT IGNORE INTO Partido_politico (calle, numero, telefono, codigo_postal, nombre, ci_presidente, ci_vicepresidente)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.executemany(query, partidos)
        cnx.commit()
        return 1, cursor.rowcount
    except Exception as e:
        return -1, str(e)
    
def get_citizen(ci):
    '''
    Obtiene los datos de un ciudadano por su CI.
    '''
    query = '''
        SELECT 
            c.nombre,
            c.apellido,
            c.serie_credencial,
            c.nro_circuito,
            c.nro_credencial,
            EXISTS (
                SELECT 1 FROM Registro_votacion rv WHERE rv.ci_ciudadano = c.ci
            ) AS voto_realizado
        FROM Ciudadano c
        WHERE c.ci = %s
    '''
    cursor.execute(query, (ci,))
    result = cursor.fetchone()
    result['voto_realizado'] = result['voto_realizado'] == 1
    
    if result:
        return result
    return None

def get_citizen_by_cc(cc):
    '''
    Obtiene los datos de un ciudadano por su CC.
    '''
    serie_credencial = cc[:3].upper()  
    nro_credencial = cc[3:] 
    
    query = '''
        SELECT 
            c.nombre,
            c.apellido,
            c.serie_credencial,
            c.nro_circuito,
            c.nro_credencial,
            EXISTS (
                SELECT 1 FROM Registro_votacion rv WHERE rv.ci_ciudadano = c.ci
            ) AS voto_realizado
        FROM Ciudadano c
        WHERE c.serie_credencial = %s AND c.nro_credencial = %s
    '''
    cursor.execute(query, (serie_credencial, nro_credencial))
    result = cursor.fetchone()
    result['voto_realizado'] = result['voto_realizado'] == 1
    
    if result:
        return result
    return None

def get_citizens_by_member_circuit(member_id):
    query = '''
        SELECT 
            c.nombre,
            c.apellido,
            c.serie_credencial,
            c.nro_circuito,
            c.nro_credencial,
            c.ci,
            EXISTS (
                SELECT 1 FROM Registro_votacion rv WHERE rv.ci_ciudadano = c.ci
            ) AS voto_realizado
        FROM Ciudadano c 
        JOIN Miembro_mesa m ON c.nro_circuito = m.nro_circuito
        WHERE m.id_miembro = %s
    '''
    cursor.execute(query, (member_id,))    
    result = cursor.fetchall()
    
    if result:
        return result
    return None

def crear_papeleta(descripcion):
    '''
    
    '''
    query = ''' INSERT INTO Papeleta (descripcion) VALUES (%s)'''
    cursor.execute(query, (descripcion,))
    a =cursor.lastrowid
    print(">>>>>: ",a)
    return a
    
    

def crear_lista(id_partido, descripcion, nro_lista, id_candidato_apoyado, id_departamento):
    '''
    Crea una nueva lista electoral.
    '''
    try:
        id_papeleta = crear_papeleta(descripcion)
        if id_papeleta is None:
            return -1, "Error al crear la papeleta"
        
        # Insertar la lista en la tabla Lista
        query = '''
        INSERT INTO Lista (nro, id_candidato_apoyado, id_papeleta, id_partido_politico, id_departamento)
        VALUES (%s, %s, %s, %s, %s)
        '''
        values = (nro_lista, id_candidato_apoyado, id_papeleta, id_partido, id_departamento)
        cursor.execute(query, values)
        cnx.commit()
        return 1, ":ista creada exitosamente"

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            return -1, f"La lista '{descripcion}' ya fue ingresada."
        else:
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"
    
def agregar_candidato_a_lista(nro_lista, id_candidato, id_tipo, posicion):
    '''
    Agrega un candidato a una lista en la tabla Integrantes_de_lista.
    Maneja errores de duplicados por restricciones UNIQUE o PK.
    '''
    try:        
        query = '''
            INSERT INTO Integrantes_de_lista (id_candidato, nro_lista, id_tipo, posicion)
            VALUES (%s, %s, %s, %s)
        '''
        values = (id_candidato, nro_lista, id_tipo, posicion)
        cursor.execute(query, values)
        cnx.commit()
        return 1, "Candidato agregado a la lista exitosamente"
    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            return -1, "Ya existe un candidato con ese id en la lista, o la posición ya está ocupada."
        else:
            return -1, f"Error de integridad: {str(e)}"
    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"
    
def get_listas():
    '''
    Obtiene todas las listas electorales.
    '''
    query = '''
        SELECT pa.id AS id_papeleta, l.nro, pa.descripcion AS descripcion, p.nombre AS partido, 
               ciu.nombre AS nombre_candidato, ciu.apellido AS apellido_candidato, d.nombre AS departamento
        FROM Lista l
        JOIN Partido_politico p ON l.id_partido_politico = p.id
        JOIN Papeleta pa ON l.id_papeleta = pa.id
        JOIN Candidato c ON l.id_candidato_apoyado = c.id
        JOIN Ciudadano ciu ON c.ci_ciudadano = ciu.ci
        JOIN Departamento d ON l.id_departamento = d.id;
    '''
    cursor.execute(query)
    result = cursor.fetchall()
    
    if result:
        return result
    return None

def get_integrantes_lista(nro):
    query = '''
    SELECT ciu.nombre AS nombre_candidato, ciu.apellido AS apellido_candidato,
        t.descripcion AS puesto
    FROM Integrantes_de_lista i
    JOIN Tipo_candidato t ON i.id_tipo = t.id
    JOIN Candidato c ON i.id_candidato = c.id
    JOIN Ciudadano ciu ON c.ci_ciudadano = ciu.ci
    WHERE i.nro_lista = %s ORDER BY posicion'''
    cursor.execute(query, (nro,))
    result = cursor.fetchall()
    if result:
        return result
    return None

def delete_lista(nro):
    '''
    Elimina una lista electoral por su nro.
    '''
    try:
        # Primero, eliminamos los integrantes de la lista
        query = 'DELETE FROM Integrantes_de_lista WHERE nro_lista = %s'
        cursor.execute(query, (nro,))
        
        # Luego, eliminamos la lista
        query = 'DELETE FROM Lista WHERE nro = %s'
        cursor.execute(query, (nro,))
        
        cnx.commit()
        
        if cursor.rowcount > 0:
            return 1, "Lista eliminada exitosamente"
        else:
            return -1, "No se encontró la lista o no se realizaron cambios"
    
    except IntegrityError as e:
        return -1, f"Error de integridad: {str(e)}"
    
    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"

def crear_consulta(descripcion, id_color):
    '''
    Crea una nueva consulta.
    '''
    try:
        id_papeleta = crear_papeleta(descripcion)
        if id_papeleta is None:
            return -1, "Error al crear la papeleta"
        
        query = 'INSERT INTO Consulta (id_papeleta, id_color) VALUES (%s, %s)'
        values = (id_papeleta, id_color)
        cursor.execute(query, values)

        cnx.commit()
        return 1, "Consulta creada exitosamente"

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            return -1, f"La consulta '{descripcion}' ya fue ingresada."
        else:
            return -1, f"Error de integridad: {str(e)}"

    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"
    

def get_consultas():
    '''
    Obtiene todas las consultas.
    '''
    query = '''
        SELECT c.id, p.descripcion AS descripcion_papeleta, co.decripcion AS color
        FROM Consulta c
        JOIN Papeleta p ON c.id_papeleta = p.id
        JOIN Color co ON c.id_color = co.id
    '''
    cursor.execute(query)
    result = cursor.fetchall()
    
    if result:
        return result
    return None

def get_consulta(id):
    '''
    Obtiene una consulta por su id.
    '''
    query = '''
        SELECT c.id, p.descripcion AS descripcion_papeleta, co.decripcion AS color
        FROM Consulta c
        JOIN Papeleta p ON c.id_papeleta = p.id
        JOIN Color co ON c.id_color = co.id
        WHERE c.id = %s
    '''
    cursor.execute(query, (id,))
    result = cursor.fetchone()
    
    if result:
        return result
    return None

def delete_consulta(id):
    '''
    Elimina una consulta por su id.
    '''
    try:        
        print("entra aca")
        query = "SELECT id_papeleta FROM Consulta WHERE id = %s"
        cursor.execute(query, (id,))
        id_papeleta = cursor.fetchone()
        if not id_papeleta:
            return -1, "No se encontró la consulta o no se realizaron cambios"
        
        # Luego, eliminamos la consulta
        query = 'DELETE FROM Consulta WHERE id = %s'
        cursor.execute(query, (id,))
        
        query = 'DELETE FROM Papeleta WHERE id = %s'
        cursor.execute(query, (id_papeleta['id_papeleta'],))
        
        cnx.commit()
        
        if cursor.rowcount > 0:
            return 1, "Consulta eliminada exitosamente"
        else:
            return -1, "No se encontró la consulta o no se realizaron cambios"
    
    except IntegrityError as e:
        return -1, f"Error de integridad: {str(e)}"
    
    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"
    
def registrar_ciudadano(ci_ciudadano, nro_circuito):
    fecha_hora = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        query = '''
            INSERT IGNORE INTO Registro_votacion (ci_ciudadano, fecha_hora, nro_circuito)
            VALUES (%s, %s, %s)
        '''
        cursor.execute(query, (ci_ciudadano, fecha_hora, nro_circuito))
        cnx.commit()
        if cursor.rowcount == 0:
            return -1, "El ciudadano ya ha votado en este circuito"
        return 1, "Ciudadano registrado exitosamente"
        
    except IntegrityError as e:
        return -1, f"Error de integridad: {str(e)}"
    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"
        
    
    
def registrar_voto(votos, ci_ciudadano):
    circuito = votos[0]['nro_circuito']
    return registrar_ciudadano(ci_ciudadano, circuito)

def insertar_votos(votos_temporales):
    '''
    Inserta los votos en la tabla Registro_votacion.
    '''
    try:
        query = '''
            INSERT INTO Voto (id_estado, es_observado, nro_circuito, id_papeleta)
            VALUES (%s, %s, %s, %s, %s)
        '''
        values = []
        for current_votos in votos_temporales:
            print(current_votos)
            for voto in current_votos:
                values.append((voto['id_estado'], voto['es_observado'], voto['nro_circuito'], voto['id_papeleta']))
        print("valores a insertar: ", values)
        cursor.executemany(query, values)
        cnx.commit()
        
        return 1, "Votos insertados exitosamente"
    
    except IntegrityError as e:
        return -1, f"Error de integridad: {str(e)}"
    
    except Exception as e:
        return -1, f"Error inesperado: {str(e)}"
        
    
def obtener_resultado_final(id_miembro):
    # 1. Obtener circuito
    cursor.execute("SELECT nro_circuito FROM Miembro_mesa WHERE id_miembro = %s", (id_miembro,))
    row = cursor.fetchone()
    if not row:
        return {"error": "Miembro no encontrado"}
    circuito = row["nro_circuito"]
    
    # primero hay que verificar que el circuito esté cerrado
    query = "SELECT 1 FROM Circuito WHERE nro = %s AND es_cerrado = 1 AND se_abrio = 1"
    cursor.execute(query, (circuito,))
    if cursor.fetchone() is None:
        return -1, {"error": "El circuito no está cerrado o no se ha abierto"}

    # 2. Total votantes
    cursor.execute("SELECT COUNT(*) AS totalVotantes FROM Ciudadano WHERE nro_circuito = %s", (circuito,))
    total = cursor.fetchone()["totalVotantes"]

    # 3. Total que votaron
    cursor.execute("SELECT COUNT(*) AS votaron FROM Voto WHERE nro_circuito = %s", (circuito,))
    votaron = cursor.fetchone()["votaron"]

    # 4. Votos observados
    cursor.execute("SELECT COUNT(*) AS votosObservados FROM Voto WHERE nro_circuito = %s AND es_observado = 1", (circuito,))
    observados = cursor.fetchone()["votosObservados"]

    # 5. Votos por lista
    cursor.execute("""
        SELECT L.nro AS lista, COUNT(*) AS votos
        FROM Voto V
        JOIN Papeleta P ON V.id_papeleta = P.id
        JOIN Lista L ON P.id = L.id_papeleta
        WHERE V.nro_circuito = %s
        GROUP BY L.nro
    """, (circuito,))
    votos_lista = cursor.fetchall()
    
    # 6. Votos a favor por Consulta
    cursor.execute("""
        SELECT P.descripcion, COUNT(*) AS cantidad_votos
        FROM Voto V
        JOIN Papeleta P ON V.id_papeleta = P.id
        JOIN Consulta C ON P.id = C.id_papeleta
        WHERE V.nro_circuito = %s
        GROUP BY C.id
    """, (circuito,))
    votos_consulta = cursor.fetchall()
    
    return 1, {
        "totalVotantes": total,
        "votaron": votaron,
        "votosPorLista": votos_lista,
        "votosObservados": observados,
        "votosAFavorConsulta": votos_consulta
    }
    

def validar_circuito_cerrado(nro_circuito):
    query = "SELECT 1 FROM Circuito WHERE nro = %s AND es_cerrado = 1 AND se_abrio = 1"
    cursor.execute(query, (nro_circuito,))
    if cursor.fetchone() is None:
        return False
    return True

def eleccion_finalizada():
    query = '''
    SELECT COUNT(*) AS pendientes
    FROM Circuito
    WHERE se_abrio = 0 OR es_cerrado = 0;
    '''
    cursor.execute(query)
    
    pendientes = cursor.fetchone().get('pendientes', 0)
    return pendientes == 0

def obtener_votos_por_lista_con_porcentaje(nro_circuito=None):
    # Armar filtro dinámico
    where_clause = ""
    params = []

    if nro_circuito is not None:
        if validar_circuito_cerrado(nro_circuito):
            where_clause = "WHERE V.nro_circuito = %s"
            params = [nro_circuito]
        else:
            return -1, "El circuito debe cerrar para ver los resultados"
    
    if not eleccion_finalizada():
        return -1, "La elección debe finalizar para ver los resultados"
    
    # Total de votos
    cursor.execute(f"SELECT COUNT(*) AS total FROM Voto V {where_clause}", params)
    total_votos = cursor.fetchone()["total"]

    if total_votos == 0:
        return -1, "No se registraron votos."
        
    query = f'''
         SELECT
                P.descripcion AS lista,
                L.nro AS numero_lista,
                PP.nombre AS partido,
                COUNT(V.id) AS votos
            FROM Lista L
            JOIN Papeleta P ON L.id_papeleta = P.id
            JOIN Partido_politico PP ON L.id_partido_politico = PP.id
            LEFT JOIN Voto V ON V.id_papeleta = P.id
            {where_clause}
            GROUP BY L.nro, L.id_departamento;

    '''

    # Votos por lista
    cursor.execute(query, params)

    resultados = cursor.fetchall()

    for r in resultados:
        porcentaje = (r["votos"] / total_votos) * 100
        r["porcentaje"] = f"{porcentaje:.2f}%"

    return 1, resultados

def get_organismos_publicos():
    query = '''SELECT * FROM Organismo_publico'''
    cursor.execute(query)
    result = cursor.fetchall()
    if result:
        return result
    return None

def obtener_votos_por_partido(nro_circuito=None):
    where_clause = ""
    params = []

    if nro_circuito is not None:
        if validar_circuito_cerrado(nro_circuito):
            where_clause = "WHERE V.nro_circuito = %s"
            params = [nro_circuito]
        else:
            return -1, "El circuito debe cerrar para ver los resultados"
    
    if not eleccion_finalizada():
        return -1, "La elección debe finalizar para ver los resultados"

    # Total de votos válidos (en ese circuito o global)
    cursor.execute(f"SELECT COUNT(*) AS total FROM Voto V {where_clause}", params)
    total_votos = cursor.fetchone()["total"]

    if total_votos == 0:
        return -1, "No se registraron votos."

    # Votos agrupados por partido
    cursor.execute(f"""
        SELECT
            PP.nombre AS partido,
            COUNT(V.id) AS votos
        FROM Partido_politico PP
        JOIN Lista L ON L.id_partido_politico = PP.id
        JOIN Papeleta P ON L.id_papeleta = P.id
        LEFT JOIN Voto V ON V.id_papeleta = P.id 
        {where_clause}
        GROUP BY PP.nombre;

    """, params)

    resultados = cursor.fetchall()

    for r in resultados:
        porcentaje = (r["votos"] / total_votos) * 100
        r["porcentaje"] = f"{porcentaje:.2f}%"

    return 1, resultados

def obtener_votos_por_candidato(nro_circuito=None):
    cursor = cnx.cursor(dictionary=True)

    if nro_circuito is not None:
        if not validar_circuito_cerrado(nro_circuito):
            return -1, "El circuito debe estar cerrado para ver los resultados"
       
    if not eleccion_finalizada():
        return -1, "La elección debe finalizar para ver los resultados"
        
    params = [nro_circuito, nro_circuito] if nro_circuito is not None else [None, None]

    # Total de votos (válidos) en ese circuito o global
    cursor.execute("""
        SELECT COUNT(*) AS total FROM Voto V
        WHERE (%s IS NULL OR V.nro_circuito = %s)
    """, params)
    total_votos = cursor.fetchone()["total"]

    if total_votos == 0:
        return -1, "No se registraron votos."

    # Votos por candidato
    cursor.execute("""
        SELECT
            PP.nombre AS partido,
            CONCAT(C.apellido, ' ', C.nombre) AS candidato,
            COUNT(V.id) AS votos
        FROM Lista L
        JOIN Papeleta P ON L.id_papeleta = P.id
        JOIN Partido_politico PP ON L.id_partido_politico = PP.id
        JOIN Candidato CD ON L.id_candidato_apoyado = CD.id
        JOIN Ciudadano C ON CD.ci_ciudadano = C.ci
        LEFT JOIN Voto V ON V.id_papeleta = P.id
            AND (%s IS NULL OR V.nro_circuito = %s)
        GROUP BY PP.nombre, C.apellido, C.nombre, CD.id;    
    """, params)

    resultados = cursor.fetchall()

    for r in resultados:
        porcentaje = (r["votos"] / total_votos) * 100
        r["porcentaje"] = f"{porcentaje:.2f}%"

    return 1, resultados
