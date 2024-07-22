// src/routers/loginRouter.js
import { Router } from 'express';
import { getConnection } from '../database/connection.js';
import sql from 'mssql';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const pool = await getConnection();
  const result = await pool
    .request()
    .input('username', sql.NVarChar, username)
    .input('password', sql.NVarChar, password)
    .query('SELECT * FROM login WHERE nombre = @username AND password = @password');

  if (result.recordset.length > 0) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

export default router;
