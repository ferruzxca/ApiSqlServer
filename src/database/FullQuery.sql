-- Crear la base de datos
CREATE DATABASE FerruzFlix;
GO

-- Usar la base de datos recién creada
USE FerruzFlix;


-- Crear la tabla Clientes
CREATE TABLE Clientes (
    ClienteID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    CorreoElectronico NVARCHAR(100) UNIQUE NOT NULL,
    FechaNacimiento DATE,
    FechaRegistro DATETIME DEFAULT GETDATE()
);

-- Crear la tabla Suscripciones
CREATE TABLE Suscripciones (
    SuscripcionID INT PRIMARY KEY IDENTITY(1,1),
    ClienteID INT,
    FechaInicio DATETIME NOT NULL,
    FechaFin DATETIME,
    TipoSuscripcion NVARCHAR(50),
    Precio DECIMAL(10, 2),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);


-- Crear la tabla Generos
CREATE TABLE Generos (
    GeneroID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL
);


-- Crear la tabla Peliculas
CREATE TABLE Peliculas (
    PeliculaID INT PRIMARY KEY IDENTITY(1,1),
    Titulo NVARCHAR(200) NOT NULL,
    Director NVARCHAR(100),
    Año INT,
    Duracion INT,  -- Duración en minutos
    Sinopsis NVARCHAR(MAX),
    GeneroID INT,
    FOREIGN KEY (GeneroID) REFERENCES Generos(GeneroID)
);


-- Crear la tabla ClientesPeliculas
CREATE TABLE ClientesPeliculas (
    ClientePeliculaID INT PRIMARY KEY IDENTITY(1,1),
    ClienteID INT,
    PeliculaID INT,
    FechaVista DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID),
    FOREIGN KEY (PeliculaID) REFERENCES Peliculas(PeliculaID)
);


-- Insertar datos en la tabla Clientes
INSERT INTO Clientes (Nombre, Apellido, CorreoElectronico, FechaNacimiento)
VALUES 
('Juan', 'Perez', 'juan.perez@example.com', '1985-05-15'),
('Ana', 'Gomez', 'ana.gomez@example.com', '1990-11-20');


-- Insertar datos en la tabla Suscripciones
INSERT INTO Suscripciones (ClienteID, FechaInicio, FechaFin, TipoSuscripcion, Precio)
VALUES 
(1, '2024-01-01', '2024-12-31', 'Anual', 99.99),
(2, '2024-06-01', '2024-07-01', 'Mensual', 9.99);


-- Insertar datos en la tabla Generos
INSERT INTO Generos (Nombre)
VALUES 
('Acción'),
('Comedia'),
('Drama'),
('Terror'),
('Ciencia Ficción');


-- Insertar datos en la tabla Peliculas
INSERT INTO Peliculas (Titulo, Director, Año, Duracion, Sinopsis, GeneroID)
VALUES 
('Película de Acción', 'Director 1', 2022, 120, 'Sinopsis de la película de acción', 1),
('Película de Comedia', 'Director 2', 2021, 90, 'Sinopsis de la película de comedia', 2);


-- Insertar datos en la tabla ClientesPeliculas
INSERT INTO ClientesPeliculas (ClienteID, PeliculaID)
VALUES 
(1, 1),
(2, 2);