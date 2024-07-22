import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const getSuscripciones = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Suscripciones");
  res.json(result.recordset);
};

export const getSuscripcion = async (req, res) => {
  console.log(req.params.id);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("SuscripcionID", sql.Int, req.params.id)
    .query("SELECT  * FROM Suscripciones WHERE SuscripcionID = @SuscripcionID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Suscripcion no encontrada" });
  }

  return res.json(result.recordset[0]);
};

export const createSuscripcion = async (req, res) => {
  console.log(req.body);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("ClienteID", sql.Int, req.body.ClienteID)
    .input("FechaInicio", sql.Date, req.body.FechaInicio)
    .input("FechaFin", sql.Date, req.body.FechaFin)
    .input("TipoSuscripcion", sql.Int, req.body.TipoSuscripcion)
    .input("Precio", sql.Decimal(10, 2), req.body.Precio)
    .query(
      "INSERT INTO Suscripciones (ClienteID, FechaInicio, FechaFin, TipoSuscripcion, Precio) VALUES (@ClienteID, @FechaInicio, @FechaFin, @TipoSuscripcion, @Precio); SELECT SCOPE_IDENTITY() AS SuscripcionID;"
    );
  console.log(result);
  res.json({
    id: result.recordset[0].GeneroID,
    ClienteID: req.ClienteID,
    FechaInicio: req.body.FechaInicio,
    FechaFin: req.body.FechaFin,
    TipoSuscripcion: req.body.TipoSuscripcion,
    Precio: req.body.Precio,
  });
};

export const updateSuscripcion = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("SuscripcionID", sql.Int, req.params.id)
    .input("ClienteID", sql.Int, req.body.ClienteID)
    .input("FechaInicio", sql.Date, req.body.FechaInicio)
    .input("FechaFin", sql.Date, req.body.FechaFin)
    .input("TipoSuscripcion", sql.Int, req.body.TipoSuscripcion)
    .input("Precio", sql.Decimal(10, 2), req.body.Precio)
    .query(
      "UPDATE Suscripciones SET ClienteID = @ClienteID, FechaInicio = @FechaInicio, FechaFin = @FechaFin, TipoSuscripcion = @TipoSuscripcion, Precio = @Precio WHERE SuscripcionID = @SuscripcionID"
    );

  console.log(result);
  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Suscripcion no encontrada" });
  }
  res.json("Suscripcion Actualizada");
};

export const deleteSuscripcion = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("SuscripcionID", sql.Int, req.params.id)
    .query("DELETE FROM Suscripciones WHERE SuscripcionID = @SuscripcionID");
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Suscripcion no encontrada" });
  }
  return res.json({ message: "Suscripcion eliminada" });
};
