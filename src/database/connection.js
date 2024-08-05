import sql from "mssql";

const dbSetting = {
  server: "localhost",
  database: "Pelis",
  user: "sa",
  password: "Ferr2812$",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSetting);
    return pool;
  } catch (error) {
    console.error("Database conection error: ", error);
  }
};
