import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const getGeneros = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Generos");
  res.json(result.recordset);
};

export const getGenero = async (req, res) => {
  console.log(req.params.id);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("GeneroID", sql.Int, req.params.id)
    .query("SELECT  * FROM Generos WHERE GeneroID = @GeneroID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Genero no encontrado" });
  }

  return res.json(result.recordset[0]);
};

export const createGenero = async (req, res) => {
  console.log(req.body);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("Nombre", sql.NVarChar(100), req.body.Nombre)
    .query(
      "INSERT INTO Generos (Nombre) VALUES (@Nombre); SELECT SCOPE_IDENTITY() AS GenroID;"
    );
  console.log(result);
  res.json({
    id: result.recordset[0].GeneroID,
    Nombre: req.body.Nombre,
  });
};

export const updateGenero = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("OldGeneroID", sql.Int, req.params.id)
      .input("NewGeneroID", sql.Int, req.body.NewGeneroID)
      .input("Nombre", sql.NVarChar(100), req.body.Nombre)
      .query("UPDATE Generos SET GeneroID = @NewGeneroID, Nombre = @Nombre WHERE GeneroID = @OldGeneroID");

    console.log(result);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Género no encontrado" });
    }

    res.json({ message: "Género actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el género" });
  }
};


export const deleteGenero = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("GeneroID", sql.Int, req.params.id)
    .query("DELETE FROM Generos WHERE GeneroID = @GeneroID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Genero no encontrado" });
  }
  return res.json({ message: "Genero eliminado" });
};