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
    .input("Titulo", sql.NVarChar(200), req.body.Titulo)
    .input("Director", sql.NVarChar(100), req.body.Director)
    .input("Anio", sql.Int, req.body.Anio)
    .input("Duracion", sql.Int, req.body.Duracion)
    .input("Sinopsis", sql.NVarChar(255), req.body.Sinopsis)
    .input("GeneroID", sql.Int, req.body.GeneroID)
    .query(
      "INSERT INTO Peliculas (Titulo, Director, Anio, Duracion, Sinopsis, GeneroID) VALUES (@Titulo, @Director, @Anio, @Duracion, @Sinopsis, @GeneroID); SELECT SCOPE_IDENTITY() AS PeliculaID;"
    );
  console.log(result);
  res.json({
    id: result.recordset[0].PeliculaID,
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
  res.json("Prlicula Actualizada");
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
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ClienteID", sql.Int, req.params.clienteId).query(`
        SELECT c.Nombre, c.Apellido, p.Titulo, v.FechaVista
        FROM Clientes c
        JOIN Visualizaciones v ON c.ClienteID = v.ClienteID
        JOIN Peliculas p ON v.PeliculaID = p.PeliculaID
        WHERE c.ClienteID = @ClienteID
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

// Obtener top 10 películas más vistas
export const getTop10PeliculasMasVistas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT TOP 10 p.Titulo, COUNT(*) AS Vistas
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

    res.json(result.recordset);
  } catch (error) {
    console.error(
      "Error al obtener top 10 películas más vistas:",
      error.message
    );
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener top 10 películas menos vistas
export const getTop10PeliculasMenosVistas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT TOP 10 p.Titulo, COUNT(*) AS Vistas
        FROM Visualizaciones v
        JOIN Peliculas p ON v.PeliculaID = p.PeliculaID
        GROUP BY p.Titulo
        ORDER BY Vistas ASC
      `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron películas vistas" });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error(
      "Error al obtener top 10 películas menos vistas:",
      error.message
    );
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

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
        SELECT TOP 2 CONVERT(date, FechaVista) AS Fecha, COUNT(*) AS Vistas
        FROM Visualizaciones
        GROUP BY CONVERT(date, FechaVista)
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
