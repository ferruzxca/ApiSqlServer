import { getConnection } from "../database/connection.js";
import sql from "mssql";

// Todas Suscripciones
export const getSuscripciones = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Suscripciones");
  res.json(result.recordset);
};

// Una Suscripcion
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

// Crear Suscripcion
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

// Actualizar Suscripcion
export const updateSuscripcion = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("SuscripcionID", sql.Int, req.params.id)
    .input("ClienteID", sql.Int, req.body.ClienteID)
    .input("FechaInicio", sql.Date, req.body.FechaInicio)
    .input("FechaFin", sql.Date, req.body.FechaFin)
    .input("TipoSuscripcion", sql.NVarChar(50), req.body.TipoSuscripcion)
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

// Borrar suscripcion
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

// Editar tipo de suscripción
export const updateTipoSuscripcion = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("SuscripcionID", sql.Int, req.params.id)
    .input("Precio", sql.Decimal(10, 2), req.body.Precio)
    .input("NuevoTipo", sql.NVarChar(50), req.body.TipoSuscripcion).query(`
        UPDATE Suscripciones
        SET TipoSuscripcion = @NuevoTipo, Precio = @Precio
        WHERE SuscripcionID = @SuscripcionID
      `);
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res
      .status(404)
      .json({ message: "No se encontró la suscripción a actualizar" });
  }

  res.json({ message: "Tipo de suscripción actualizado correctamente" });
};

// Calculo costo anual de una suscripcion anual
export const calcularCostoAnual = async (req, res) => {
  console.log(req.params.id);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("SuscripcionID", sql.Int, req.params.id).query(`
        SELECT 
          SuscripcionID, 
          TipoSuscripcion,
          Precio,
          CASE 
            WHEN TipoSuscripcion LIKE '%Mensual%' THEN Precio * 12 
            WHEN TipoSuscripcion LIKE '%Trimestral%' THEN Precio * 3
            WHEN TipoSuscripcion LIKE '%Anual%' THEN Precio
            ELSE 0
          END AS CostoAnual
        FROM Suscripciones
        WHERE SuscripcionID = @SuscripcionID;
      `);
  console.log(result);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Suscripcion no encontrada" });
  }

  return res.json(result.recordset[0]);
};

// Ahorro anual
export const ahorroAnual = async (req, res) => {
  try {
    console.log(req.params.id);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("SuscripcionID", sql.Int, req.params.id).query(`
        SELECT 
          SuscripcionID, 
          TipoSuscripcion,
          Precio,
          CASE 
            WHEN TipoSuscripcion LIKE '%Mensual%' THEN Precio * 12 
            WHEN TipoSuscripcion LIKE '%Trimestral%' THEN Precio * 4
            WHEN TipoSuscripcion LIKE '%Anual%' THEN Precio
            ELSE 0
          END AS CostoAnual,
          CASE 
            WHEN TipoSuscripcion LIKE '%Mensual%' THEN 
                (SELECT TOP 1 Precio FROM Suscripciones 
                 WHERE TipoSuscripcion LIKE '%Anual%' 
                 AND TipoSuscripcion LIKE '%' + REPLACE(TipoSuscripcion, 'Mensual', '') + '%') - (Precio * 12)
            WHEN TipoSuscripcion LIKE '%Trimestral%' THEN 
                (SELECT TOP 1 Precio FROM Suscripciones 
                 WHERE TipoSuscripcion LIKE '%Anual%' 
                 AND TipoSuscripcion LIKE '%' + REPLACE(TipoSuscripcion, 'Trimestral', '') + '%') - (Precio * 4)
            WHEN TipoSuscripcion LIKE '%Anual%' THEN 0
            ELSE 0
          END AS Ahorro
        FROM Suscripciones
        WHERE SuscripcionID = @SuscripcionID;
      `);
    console.log(result);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Suscripcion no encontrada" });
    }

    const subscription = result.recordset[0];
    const response = {
      SuscripcionID: subscription.SuscripcionID,
      TipoSuscripcion: subscription.TipoSuscripcion,
      Precio: subscription.Precio,
      CostoAnual: subscription.CostoAnual,
      Ahorro: subscription.Ahorro,
      Mensaje:
        subscription.Ahorro > 0
          ? `¡Puedes ahorrar $${subscription.Ahorro.toFixed(
              2
            )} al contratar el plan Anual!`
          : "Ya estás en el plan más económico.",
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
