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
    if not verify_person(data['nombre'], data['apellido'], data['ci']):
        message = f"La persona {data['nombre']} {data['apellido']} no está registrada en la base de datos como ciudadano."
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

        query = 'INSERT INTO Usuario_ciudadano (id_usuario, ci_ciudadano) VALUES (LAST_INSERT_ID(), %s)'
        cursor.execute(query, (data['ci'],))

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
    query = 'SELECT id, contraseña, salt, id_rol_usuario FROM Usuario WHERE nombre_usuario = %s'
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
    query = """SELECT c.ci, c.nombre, c.apellido, r.descripcion_rol FROM Ciudadano c 
                JOIN Usuario_ciudadano uc ON (c.ci = uc.ci_ciudadano)  
                JOIN Usuario u ON (uc.id_usuario = u.id) 
                JOIN Rol_usuario r ON (u.id_rol_usuario = r.id)
                WHERE u.nombre_usuario = %s
                """
    cursor.execute(query, (nombre_usuario,))
    result = cursor.fetchone()
    
    if result:
        return result
    return None