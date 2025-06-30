import mysql.connector as mysql
from mysql.connector.errors import IntegrityError
import encriptacion_contraseña as encrypt

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
    query = '''SELECT m.id_miembro as id, u.contraseña, u.salt, u.id_rol_usuario 
                    FROM Usuario u
                    JOIN Usuario_miembro um ON u.id = um.id_usuario
                    JOIN Miembro_mesa m ON um.id_miembro = m.id_miembro
                    WHERE u.nombre_usuario = %s'''
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
    values.append(id)
    cursor.execute(query, values)
    cnx.commit()
    
    if cursor.rowcount > 0:
        return 1, "Circuito actualizado exitosamente"
    else:
        return -1, "No se encontró el circuito o no se realizaron cambios"
    
def delete_circuito(id):
    '''
    elimina un circuito por su id
    '''
    query = 'DELETE FROM Circuito WHERE nro = %s'
    cursor.execute(query, (id,))
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
    query = 'SELECT * FROM Policia WHERE id_policia = %s'
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
    query = 'SELECT * FROM Candidato'
    cursor.execute(query)
    result = cursor.fetchall()
    if result:
        return result
    return None

def get_candidato(id):
    '''
    obtiene un candidato por su id
    '''
    query = 'SELECT * FROM Candidato WHERE id = %s'
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
    return None

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