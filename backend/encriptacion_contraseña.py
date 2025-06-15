import hashlib
import os

def encrypt_password(password):
    # Generar una sal aleatoria
    salt = os.urandom(32)  # Sal de 32 bytes (256 bits)

    # Concatenar la sal con la contraseña
    password_bytes = password.encode('utf-8')
    salted_password = salt + password_bytes

    # Crear un hash de la contraseña con sal usando SHA-256
    hashed_password = hashlib.sha256(salted_password).hexdigest()

    return hashed_password, salt

def verify_password(stored_hash, stored_salt, provided_password):
    # Recuperar la sal almacenada y la contraseña proporcionada
    stored_salt = bytes.fromhex(stored_salt)
    provided_password_bytes = provided_password.encode('utf-8')

    # Concatenar la sal con la contraseña proporcionada
    salted_password = stored_salt + provided_password_bytes

    # Crear un hash de la contraseña con sal usando SHA-256
    hashed_password = hashlib.sha256(salted_password).hexdigest()

    # Comparar el hash calculado con el almacenado
    return hashed_password == stored_hash

# Ejemplo de uso:
# Suponiendo que tenemos una contraseña que queremos encriptar y guardar:
password = "amamos_base_de_datos2025"

# Encriptar la contraseña y obtener el hash y la sal
hashed_password, salt = encrypt_password(password)

print("Contraseña encriptada:", hashed_password)
print("Sal (hex):", salt.hex())

# Estos datos obtenidos son los que deberíamos almacenar en la base de datos

# Ejemplo de verificación de contraseña:
# Supongamos que queremos verificar una contraseña ingresada por el usuario
provided_password = "amamos_base_de_datos2025"

# Supongamos que tenemos el hashed_password y salt almacenados en la base de datos
# Aquí es donde recuperaríamos hashed_password y salt de la base de datos
# Y luego verificaríamos la contraseña así:

'''
para poder usarla, tengo que guardar el salt en la base de datos
hacer un select de la contraseña y el salt dado el nombre de usuario y verificar
'''
password_verified = verify_password(hashed_password, salt.hex(), provided_password)

if password_verified:
    print("Contraseña correcta.")
else:
    print("Contraseña incorrecta.")
