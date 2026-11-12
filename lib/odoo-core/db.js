// lib/odoo-core/db.js
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
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