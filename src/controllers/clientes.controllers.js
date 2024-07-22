import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const getClientes = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Clientes");
  res.json(result.recordset);
};

export const getCliente = async (req, res) => {
  console.log(req.params.id);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("ClienteID", sql.Int, req.params.id)
    .query("SELECT  * FROM Clientes WHERE ClienteID = @ClienteID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  return res.json(result.recordset[0]);
};

export const createCliente = async (req, res) => {
  console.log(req.body);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("Nombre", sql.NVarChar(100), req.body.Nombre)
    .input("Apellido", sql.NVarChar(100), req.body.Apellido)
    .input("CorreoElectronico", sql.NVarChar(100), req.body.CorreoElectronico)
    .input("FechaNacimiento", sql.Date, req.body.FechaNacimiento)
    .input("FechaRegistro", sql.DateTime, req.body.FechaRegistro)
    .query(
      "INSERT INTO Clientes (Nombre, Apellido, CorreoElectronico, FechaNacimiento, FechaRegistro) VALUES (@Nombre, @Apellido, @Correoelectronico, @FechaNacimiento, @FechaRegistro); SELECT SCOPE_IDENTITY() AS ClienteID;"
    );
  console.log(result);
  res.json({
    id: result.recordset[0].ClienteID,
    Nombre: req.body.Nombre,
    Apellido: req.body.Apellido,
    CorreoElectronico: req.body.CorreoElectronico,
    FechaNacimiento: req.body.FechaNacimiento,
    FechaRegistro: req.body.FechaRegistro,
  });
};

export const updateCliente = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("ClienteID", sql.Int, req.params.id)
    .input("Nombre", sql.NVarChar(200), req.body.Nombre)
    .input("Apellido", sql.NVarChar(100), req.body.Apellido)
    .input("CorreoElectronico", sql.Int, req.body.CorreoElectronico)
    .input("FechaNacimineto", sql.Int, req.body.FechaNacimiento)
    .input("FechaRegistro", sql.NVarChar(255), req.body.FechaRegistro)
    .query(
      "UPDATE Clientes SET Nombre = @Nombre, Apellido = @Apellido, CorreoElectronico = @CorreoElectronico, FechaNacimiento = @FechaNacimiento, FechaRegistro = @FechaRegistro WHERE ClienteID = @ClienteID"
    );

  console.log(result);
  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }
  res.json("Cliente Actualizado");
};

export const deleteCliente = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("ClienteID", sql.Int, req.params.id)
    .query("DELETE FROM Clientes WHERE ClienteID = @ClienteID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }
  return res.json({ message: "Cliente eliminado" });
};
