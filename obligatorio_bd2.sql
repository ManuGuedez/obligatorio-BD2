CREATE DATABASE obligatorio_bd2;

USE obligatorio_bd2;

CREATE TABLE Rol_usuario(  -- para poder distiguir por ej. admin, miembro de mesa y ciudadano común
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion_rol VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(20) NOT NULL UNIQUE,
    contraseña VARCHAR(30) NOT NULL,
    id_rol_usuario INT,
    FOREIGN KEY (id_rol_usuario) REFERENCES Rol_usuario(id)
);


CREATE TABLE Departamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20)
);

CREATE TABLE Ciudad(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20),
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES Departamento(id)
);

CREATE TABLE Zona(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20),
    id_ciudad INT,
    FOREIGN KEY (id_ciudad) REFERENCES Ciudad(id)
);

CREATE TABLE Establecimiento(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20),
    tipo VARCHAR(15),
    direccion VARCHAR(20),
    id_zona INT,
    FOREIGN KEY (id_zona) REFERENCES Zona(id)
);

CREATE TABLE Circuito (
    nro INT PRIMARY KEY,
    es_accesible BOOL,
    id_establecimiento INT,
    es_cerrado BOOL DEFAULT TRUE,
    se_abrio BOOL DEFAULT FALSE,
    FOREIGN KEY (id_establecimiento) REFERENCES Establecimiento(id)
);

CREATE TABLE Ciudadano (
    ci INT PRIMARY KEY,
    nombre VARCHAR(15),
    apellido VARCHAR(15),
    serie_credencial VARCHAR(10),
    nro_circuito INT,
    FOREIGN KEY (nro_circuito) REFERENCES Circuito(nro)
);

CREATE TABLE Usuario_ciudadano ( -- asocia los ciudadanos a un usuario, esto sirve para votar
    id_usuario INT UNIQUE,
    ci_ciudadano INT UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (ci_ciudadano) REFERENCES Ciudadano(ci)
);

CREATE TABLE Comisaria(
    id INT PRIMARY KEY AUTO_INCREMENT,
    calle VARCHAR(20),
    numero INT,
    codigo_postal INT
);

CREATE TABLE Policia(
    id_policia INT PRIMARY KEY AUTO_INCREMENT,
    id_comisaria INT,
    ci_ciudadano INT,
    id_establecimiento INT,
    FOREIGN KEY (id_comisaria) REFERENCES Comisaria(id),
    FOREIGN KEY (ci_ciudadano) REFERENCES Ciudadano(ci),
    FOREIGN KEY (id_establecimiento) REFERENCES Establecimiento(id)
);

CREATE TABLE Rol_mesa(
  id INT PRIMARY KEY AUTO_INCREMENT,
  rol VARCHAR(15),
  descripcion VARCHAR(20)
);

CREATE TABLE Organismo_publico(
    id_organismo INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(20)
);

CREATE TABLE Miembro_mesa(
    id_miembro INT PRIMARY KEY AUTO_INCREMENT,
    id_organismo INT,
    ci_ciudadano INT,
    nro_circuito INT,
    id_rol INT,
    FOREIGN KEY (id_organismo) REFERENCES Organismo_publico(id_organismo),
    FOREIGN KEY (ci_ciudadano) REFERENCES Ciudadano(ci),
    FOREIGN KEY (nro_circuito) REFERENCES Circuito(nro),
    FOREIGN KEY (id_rol) REFERENCES Rol_mesa (id)
);

CREATE TABLE Candidato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ci_ciudadano INT,
    FOREIGN KEY (ci_ciudadano) REFERENCES Ciudadano(ci)
);

CREATE TABLE Papeleta(
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(20)
);

CREATE TABLE Partido_politico(
    id INT PRIMARY KEY AUTO_INCREMENT,
    calle VARCHAR(30),
    numero INT,
    telefono VARCHAR(15),
    codigo_postal INT,
    nombre VARCHAR(20),
    ci_presidente INT,
    ci_vicepresidente INT,
    FOREIGN KEY (ci_presidente) REFERENCES Ciudadano(ci),
    FOREIGN KEY (ci_vicepresidente) REFERENCES Ciudadano(ci)
);

CREATE TABLE Lista(
    nro INT PRIMARY KEY,
    id_candidato_apoyado INT,
    id_papeleta INT,
    id_partido_politico INT,
    id_departamento INT,
    FOREIGN KEY (id_candidato_apoyado) REFERENCES Candidato(id),
    FOREIGN KEY (id_papeleta) REFERENCES Papeleta(id),
    FOREIGN KEY (id_partido_politico) REFERENCES Partido_politico(id),
    FOREIGN KEY (id_departamento) REFERENCES Departamento(id)
);

CREATE TABLE Ballotage(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_presidente INT,
    id_vicepresidente INT,
    id_papeleta INT,
    FOREIGN KEY (id_presidente) REFERENCES Candidato(id),
    FOREIGN KEY (id_vicepresidente) REFERENCES Candidato(id),
    FOREIGN KEY (id_papeleta) REFERENCES Papeleta(id)
);

CREATE TABLE Color (
    id INT PRIMARY KEY AUTO_INCREMENT,
    decripcion VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE Consulta(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_color INT,
    id_papeleta INT,
    FOREIGN KEY (id_papeleta) REFERENCES Papeleta(id),
    FOREIGN KEY (id_color) REFERENCES Color(id)
);

CREATE TABLE Estado_voto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(20) -- blanco, anulado o emitido
);

CREATE TABLE Voto(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_estado INT,
    es_observado BOOL, -- puede calcularse si el voto se registra en un circuito al que el ciudadano no fue asignado
    fecha_hora DATETIME,
    nro_circuito INT,
    id_papeleta INT,
    FOREIGN KEY (id_papeleta) REFERENCES Papeleta(id),
    FOREIGN KEY (nro_circuito) REFERENCES Circuito(nro),
    FOREIGN KEY (id_estado) REFERENCES Estado_voto(id)
);

CREATE TABLE Tipo_candidato(
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE Integrantes_de_lista (
    id_candidato INT,
    nro_lista INT,
    id_tipo INT,
    posicion INT,
    FOREIGN KEY (id_candidato) REFERENCES Candidato(id),
    FOREIGN KEY (nro_lista) REFERENCES Lista(nro),
    FOREIGN KEY (id_tipo) REFERENCES Tipo_candidato(id),
    UNIQUE (nro_lista, posicion)
);

CREATE TABLE Registro_votacion (
    ci_ciudadano INT,
    fecha_hora DATETIME,
    nro_circuito INT,
    FOREIGN KEY (ci_ciudadano) REFERENCES Ciudadano(ci),
    FOREIGN KEY (nro_circuito) REFERENCES Circuito(nro)
);

-- este no lo puedo usar con el nuevo coso.
ALTER TABLE Usuario ADD COLUMN salt VARCHAR(128);
ALTER TABLE Usuario MODIFY COLUMN contraseña VARCHAR(128);

