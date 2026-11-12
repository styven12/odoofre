// lib/odoo-core/db.js
import mysql from 'mysql2/promise';

const dbPort = Number(process.env.DB_PORT || 3306);
if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
  throw new Error('DB_PORT doit être un port valide entre 1 et 65535');
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: dbPort,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'my_odoo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test de connexion
pool.getConnection().then(c => {
  console.log('[DB] MySQL connecté');
  c.release();
}).catch(e => console.error('[DB] Erreur', e.message));
