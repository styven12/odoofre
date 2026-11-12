// lib/odoo-core/security.js
import { pool } from './db.js';

export async function can({ user, modelName, action }) {
  // action = 'read', 'create', 'write', 'unlink'
  if (!user || !user.group_id) return false;
  if (user.is_admin) return true; // admin peut tout

  const [rows] = await pool.query(
    `SELECT * FROM ir_model_access WHERE group_id = ? AND model_name = ?`,
    [user.group_id, modelName]
  );
  if (rows.length === 0) return false;
  return rows[0][`perm_${action}`] === 1;
}