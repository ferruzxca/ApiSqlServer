import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const getUrlImg = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT UrlImg FROM Url");
  res.json(result.recordset);
};
