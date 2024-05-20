-- Borrar la base de datos existente
DROP DATABASE IF EXISTS administracionproyectos;

-- Crear la nueva base de datos
CREATE DATABASE administracionproyectos;

-- Seleccionar la nueva base de datos
USE administracionproyectos;

-- Crear la tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'normal')),
    edad INT,
    fechacreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de proyectos
CREATE TABLE proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fechainicio DATE NOT NULL,
    fechafin DATE NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Crear la tabla de tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    plazofinalizacion INT NOT NULL,  -- Plazo en días
    fechacreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_proyecto INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Crear la tabla de archivos_adjuntos
CREATE TABLE archivos_adjuntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombrearchivo VARCHAR(255) NOT NULL,
    tipoarchivo VARCHAR(50) NOT NULL,
    rutaarchivo VARCHAR(255) NOT NULL,
    id_tarea INT NOT NULL,
    FOREIGN KEY (id_tarea) REFERENCES tareas(id)
);

-- Insertar datos de ejemplo en la tabla de usuarios
INSERT INTO usuarios (nombre, apellidos, email, contrasena, rol, edad) VALUES
('admin', 'admin', 'admin@example.com', 'hashedpassword', 'admin', 30),
('user', 'normal', 'user@example.com', 'hashedpassword', 'normal', 25);

-- Insertar datos de ejemplo en la tabla de proyectos
INSERT INTO proyectos (nombre, descripcion, fechainicio, fechafin, id_usuario) VALUES
('proyecto 1', 'descripción del proyecto 1', '2024-06-01', '2024-12-31', 2),
('proyecto 2', 'descripción del proyecto 2', '2024-07-01', '2024-11-30', 2);

-- Insertar datos de ejemplo en la tabla de tareas
INSERT INTO tareas (titulo, descripcion, plazofinalizacion, id_proyecto, id_usuario) VALUES
('tarea 1', 'descripción de la tarea 1', 10, 1, 2),
('tarea 2', 'descripción de la tarea 2', 15, 1, 2);

-- Insertar datos de ejemplo en la tabla de archivos_adjuntos
INSERT INTO archivos_adjuntos (nombrearchivo, tipoarchivo, rutaarchivo, id_tarea) VALUES
('archivo1.pdf', 'pdf', '/ruta/al/archivo1.pdf', 1),
('imagen1.jpg', 'imagen', '/ruta/a/imagen1.jpg', 2);

-- Verificar que los datos se hayan insertado correctamente en la tabla de usuarios
SELECT * FROM usuarios;
