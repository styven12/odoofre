import { pool } from './db.js';

const actions = new Set(['read', 'create', 'write', 'unlink']);

export async function can({ user, modelName, action }) {
  if (!user || !actions.has(action)) return false;
  if (user.is_admin === true || user.is_admin === 1) return true;
  if (!user.group_id || !user.company_id) return false;

  const [rows] = await pool.query(
    `SELECT perm_${action} AS allowed FROM ir_model_access
     WHERE company_id = ? AND group_id = ? AND model_name = ? LIMIT 1`,
    [user.company_id, user.group_id, modelName]
  );
  return rows.length > 0 && Boolean(rows[0].allowed);
}

export function getUserFromReq(req, jwt) {
  const authorization = req.headers.get('authorization') || '';
  const bearer = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const token = bearer || req.cookies?.get('session')?.value;
  if (!token) return null;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user?.user_id && user?.company_id ? user : null;
  } catch {
    return null;
  }
}
