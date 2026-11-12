import bcrypt from 'bcrypt';
import { pool } from '../../../lib/odoo-core/db.js';

export const runtime = 'nodejs';

function isLocalRequest(req) {
  const host = new URL(req.url).name.toLowerCase();
  return ['localhost', '127.0.0.1', '::1'].includes(host);
}

export async function GET(req) {
  if (!isLocalRequest(req)) return Response.json({ error: 'Création du compte disponible uniquement en local' }, { status: 403 });
  const login = 'admin@test.com';
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 12);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [companies] = await connection.query('SELECT id FROM res_company WHERE id = 1 AND company_id = 1 LIMIT 1');
    const [groups] = await connection.query('SELECT id FROM res_groups WHERE id = 1 AND company_id = 1 LIMIT 1');
    if (!companies.length || !groups.length) {
      await connection.rollback();
      return Response.json({ error: 'Lance /api/init-db avant de créer le compte.' }, { status: 409 });
    }

    const [users] = await connection.query(
      'SELECT id FROM res_users WHERE login = ? AND company_id = 1 LIMIT 1 FOR UPDATE',
      [login]
    );
    if (users.length) {
      await connection.query(
        'UPDATE res_users SET name = ?, password_hash = ?, group_id = 1, is_admin = 1, active = 1 WHERE id = ? AND company_id = 1',
        ['Administrateur', passwordHash, users[0].id]
      );
    } else {
      await connection.query(
        'INSERT INTO res_users (company_id, name, login, password_hash, group_id, is_admin, active) VALUES (1, ?, ?, ?, 1, 1, 1)',
        ['Administrateur', login, passwordHash]
      );
    }
    await connection.commit();
    return Response.json({ ok: true, message: 'Compte administrateur prêt', login, password });
  } catch (error) {
    await connection.rollback();
    console.error('[seed-admin] Échec:', error.message);
    return Response.json({ error: 'Création du compte impossible' }, { status: 500 });
  } finally {
    connection.release();
  }
}
