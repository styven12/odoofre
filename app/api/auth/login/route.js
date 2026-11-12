import { pool } from '../../../../lib/odoo-core/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    if (!process.env.JWT_SECRET) return Response.json({ error: 'JWT_SECRET manquant dans la configuration' }, { status: 500 });
    const { login, password, company_id } = await req.json();
    if (!login || !password || !Number.isInteger(Number(company_id))) {
      return Response.json({ error: 'Identifiants et société requis' }, { status: 400 });
    }
    const [users] = await pool.query(
      'SELECT id, company_id, name, login, password_hash, group_id, is_admin FROM res_users WHERE login = ? AND company_id = ? AND active = 1 LIMIT 1',
      [login, Number(company_id)]
    );
    if (!users.length || !(await bcrypt.compare(password, users[0].password_hash))) {
      return Response.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }
    const user = users[0];
    const token = jwt.sign(
      { user_id: user.id, company_id: user.company_id, group_id: user.group_id, is_admin: Boolean(user.is_admin) },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    const response = Response.json({ user: { id: user.id, name: user.name, login: user.login, company_id: user.company_id } });
    response.headers.append('Set-Cookie', `session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    return response;
  } catch (error) {
    console.error('[auth] Échec de connexion:', error.message);
    return Response.json({ error: 'Connexion impossible' }, { status: 500 });
  }
}
