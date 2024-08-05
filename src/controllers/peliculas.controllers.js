import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const getPeliculas = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Peliculas");
  res.json(result.recordset);
};

export const getPelicula = async (req, res) => {
  console.log(req.params.id);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("PeliculaID", sql.Int, req.params.id)
    .query("SELECT  * FROM Peliculas WHERE PeliculaID = @PeliculaID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Pelicula no encontrada" });
  }

  return res.json(result.recordset[0]);
};

export const createPelicula = async (req, res) => {
  console.log(req.body);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("PeliculaID", sql.Int, req.body.PeliculaID)
    .input("Titulo", sql.NVarChar(200), req.body.Titulo)
    .input("Director", sql.NVarChar(100), req.body.Director)
    .input("Anio", sql.Int, req.body.Anio)
    .input("Duracion", sql.Int, req.body.Duracion)
    .input("Sinopsis", sql.NVarChar(255), req.body.Sinopsis)
    .input("GeneroID", sql.Int, req.body.GeneroID)
    .query(
      "INSERT INTO Peliculas (PeliculaID,Titulo, Director, Anio, Duracion, Sinopsis, GeneroID) VALUES (@PeliculaID, @Titulo, @Director, @Anio, @Duracion, @Sinopsis, @GeneroID);"
    );
  console.log(result);
  res.json({
    PeliculaID: req.body.PeliculaID,
    Titulo: req.body.Titulo,
    Director: req.body.Director,
    Anio: req.body.Anio,
    Duracion: req.body.Duracion,
    Sinopsis: req.body.Sinopsis,
    GeneroID: req.body.GeneroID,
  });
};

export const updatePelicula = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("PeliculaID", sql.Int, req.params.id)
    .input("Titulo", sql.NVarChar(200), req.body.Titulo)
    .input("Director", sql.NVarChar(100), req.body.Director)
    .input("Anio", sql.Int, req.body.Anio)
    .input("Duracion", sql.Int, req.body.Duracion)
    .input("Sinopsis", sql.NVarChar(255), req.body.Sinopsis)
    .input("GeneroID", sql.Int, req.body.GeneroID)
    .query(
      "UPDATE Peliculas SET Titulo = @Titulo, Director = @Director,  Anio = @Anio, Duracion = @Duracion, Sinopsis = @Sinopsis, GeneroID = @GeneroID WHERE PeliculaID = @PeliculaID"
    );

  console.log(result);
  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Pelicula no encontrada" });
  }
  res.json("Pelicula Actualizada");
};

export const deletePelicula = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("PeliculaID", sql.Int, req.params.id)
    .query("DELETE FROM Peliculas WHERE PeliculaID = @PeliculaID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Pelicula no encontrada" });
  }
  return res.json({ message: "Pelicula eliminada" });
};

// Obtener películas historial
export const getHistorialCliente = async (req, res) => {
  try {
    const clienteId = parseInt(req.params.clienteId, 10);

    if (isNaN(clienteId)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("ClienteID", sql.Int, clienteId)
      .query(`
        SELECT c.Nombre, c.Apellido, p.Titulo, v.FechaVista
        FROM Clientes c
        JOIN Visualizaciones v ON c.ClienteID = v.ClienteID
        JOIN Peliculas p ON v.PeliculaID = p.PeliculaID
        WHERE c.ClienteID = @ClienteID
        ORDER BY v.FechaVista DESC
      `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró historial para el cliente" });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error(
      "Error al obtener historial de visualización:",
      error.message
    );
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener película más vista
export const getPeliculaMasVista = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT TOP 1 p.Titulo, COUNT(*) AS Vistas
        FROM Visualizaciones v
        JOIN Peliculas p ON v.PeliculaID = p.PeliculaID
        GROUP BY p.Titulo
        ORDER BY Vistas DESC
      `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron películas vistas" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error al obtener película más vista:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Top 10 Peliculas Mas Vistas
export const getTop10MV = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query(`SELECT TOP 10
          p.PeliculaID,
          p.Titulo,
          p.Director,
          p.Anio,
          p.Duracion,
          p.Sinopsis,
          COUNT(v.CantidadV) AS CantidadVisualizaciones
      FROM 
          Peliculas p
      JOIN 
          Visualizaciones v ON p.PeliculaID = v.PeliculaID
      GROUP BY 
          p.PeliculaID, 
          p.Titulo, 
          p.Director, 
          p.Anio, 
          p.Duracion, 
          p.Sinopsis
      ORDER BY 
          CantidadVisualizaciones DESC;
    `);
  res.json(result.recordset);
};

// Top 10 Peliculas Menos Vistas
export const getTop10MenosV = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query(`SELECT TOP 10
            p.PeliculaID,
            p.Titulo,
            p.Director,
            p.Anio,
            p.Duracion,
            p.Sinopsis,
            COUNT(v.CantidadV) AS CantidadVisualizaciones
        FROM 
            Peliculas p
        JOIN 
            Visualizaciones v ON p.PeliculaID = v.PeliculaID
        GROUP BY 
            p.PeliculaID, 
            p.Titulo, 
            p.Director, 
            p.Anio, 
            p.Duracion, 
            p.Sinopsis
        ORDER BY 
            CantidadVisualizaciones ASC;
      `);
  res.json(result.recordset);
};

Ï;
// Obtener género más visto
export const getGeneroMasVisto = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT TOP 1 g.Nombre AS Genero, COUNT(*) AS Vistas
        FROM Visualizaciones v
        JOIN Peliculas p ON v.PeliculaID = p.PeliculaID
        JOIN Generos g ON p.GeneroID = g.GeneroID
        GROUP BY g.Nombre
        ORDER BY Vistas DESC
      `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el género más visto" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error al obtener género más visto:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener género menos visto
export const getGeneroMenosVisto = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT TOP 1 g.Nombre AS Genero, COUNT(*) AS Vistas
        FROM Visualizaciones v
        JOIN Peliculas p ON v.PeliculaID = p.PeliculaID
        JOIN Generos g ON p.GeneroID = g.GeneroID
        GROUP BY g.Nombre
        ORDER BY Vistas ASC
      `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el género menos visto" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error al obtener género menos visto:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener los dos días con más visualizaciones de películas
export const getDiasMasVistos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT TOP 2 
        DATENAME(WEEKDAY, FechaVista) AS DiaDeLaSemana,  -- Obtener el nombre del día
        COUNT(*) AS Vistas
      FROM Visualizaciones
      GROUP BY DATENAME(WEEKDAY, FechaVista) -- Agrupar por el nombre del día
      ORDER BY Vistas DESC
    `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron días con visualizaciones" });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los días más vistos:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
