import mysql.connector as mysql
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
    query = 'SELECT 1 FROM Persona WHERE ci = %s AND nombre = %s AND apellido = %s'
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

def register_user(data, role_name='miembro de mesa'): # por ahora se piensa como que solo se pueden registrar miembros de mesa
    '''
    se espera que data tenga los siguientes campos:
        - nombre_usuario
        - password
        - ci
        - nombre
        - apellido
    '''
    if not verify_person(data['nombre'], data['apellido'], data['ci']):
        message = f"La persona {data['nombre']} {data['apellido']} ya está tiene una cuenta registrada"
        return -1, message
    
    hashed_password, salt = encrypt.encrypt_password(data['password'])
    
    current_role_id = get_role_id(role_name) # sustituir por el nombre que le pongamos en la bd
    if current_role_id is None:
        message = f"El rol '{role_name}' no existe en la base de datos"
        return -1, message
    
    query = 'INSERT INTO Usuario (nombre_usuario, contraseña, salt, ci, id_rol_usuario) VALUES (%s, %s, %s, %s, %s)'
    values = (data['nombre_usuario'], hashed_password, salt.hex(), data['ci'], current_role_id)
    cursor.execute(query, values)
    result = cursor.rowcount
    
    if result > 0:
        message = "Usuario registrado exitosamente"
    else:
        message = "Error al registrar el usuario"
    
    # confirma los cambios en la base de datos
    cnx.commit()
    
    return result, message   
    

def login_user(nombre_usuario, password):
    '''
    verifica si el usuario existe y si la contraseña es correcta
    retorna el ci del usuario y el id del rol si es correcto, None en caso contrario
    '''
    query = 'SELECT ci, contraseña, salt, id_rol_usuario FROM Usuario WHERE nombre_usuario = %s'
    cursor.execute(query, (nombre_usuario,))
    result = cursor.fetchone()
    
    if not result:
        return -1, "Hubo un error al iniciar sesión, ingrese nuevamente las credenciales" 
        
    stored_hash = result['contraseña']
    stored_salt = result['salt']
    
    if encrypt.verify_password(stored_hash, stored_salt, password):
        return 1, "Inicio de sesión exitoso"
    
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