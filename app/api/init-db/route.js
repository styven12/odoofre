import '../../../models/index.js';
import { buildSchema } from '../../../lib/odoo-core/schema-builder.js';
import { getUserFromReq } from '../../../lib/odoo-core/security.js';
import { pool } from '../../../lib/odoo-core/db.js';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

function isLocalRequest(req) {
  const host = new URL(req.url).hostname.toLowerCase();
  return ['localhost', '127.0.0.1', '::1'].includes(host);
}

export async function GET(req) {
  if (!isLocalRequest(req)) return Response.json({ error: 'Initialisation disponible uniquement en local' }, { status: 403 });
  try {
    await buildSchema();
    await pool.query(
      `INSERT IGNORE INTO res_company (id, company_id, name, email) VALUES (1, 1, 'Ma société', '')`
    );
    await pool.query(
      `INSERT IGNORE INTO res_groups (id, company_id, name, full_name) VALUES (1, 1, 'admin', 'Administrateur')`
    );
    return Response.json({ ok: true, message: 'Schéma initialisé', next: '/api/seed-admin' });
  } catch (error) {
    console.error('[init-db] Échec:', error.message);
    return Response.json({ error: 'Initialisation impossible. Vérifie la configuration MySQL.' }, { status: 500 });
  }
}

export async function POST(req) {
  const user = getUserFromReq(req, jwt);
  if (!user) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  if (!user.is_admin) return Response.json({ error: 'Accès réservé à l’administrateur' }, { status: 403 });
  try {
    await buildSchema();
    return Response.json({ ok: true, message: 'Schéma vérifié' });
  } catch (error) {
    console.error('[init-db] Échec:', error.message);
    return Response.json({ error: 'Vérification du schéma impossible' }, { status: 500 });
  }
}
