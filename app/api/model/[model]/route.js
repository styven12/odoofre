import '../../../../models/index.js';
import { registry } from '../../../../lib/odoo-core/registry.js';
import { can, getUserFromReq } from '../../../../lib/odoo-core/security.js';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

function resolveModel(req, params) {
  const modelName = params.model.replace(/-/g, '.');
  const ModelClass = registry.get(modelName);
  return { modelName, ModelClass };
}

export async function GET(req, { params }) {
  const { modelName, ModelClass } = resolveModel(req, params);
  if (!ModelClass) return Response.json({ error: 'Modèle inconnu' }, { status: 404 });
  const user = getUserFromReq(req, jwt);
  if (!user) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  if (!(await can({ user, modelName, action: 'read' }))) return Response.json({ error: 'Accès refusé' }, { status: 403 });
  try {
    const domain = new URL(req.url).searchParams.get('domain');
    const records = await ModelClass.search({ company_id: user.company_id, domain: domain ? JSON.parse(domain) : [] });
    return Response.json(records);
  } catch (error) {
    return Response.json({ error: error.message || 'Recherche impossible' }, { status: 400 });
  }
}

export async function POST(req, { params }) {
  const { modelName, ModelClass } = resolveModel(req, params);
  if (!ModelClass) return Response.json({ error: 'Modèle inconnu' }, { status: 404 });
  const user = getUserFromReq(req, jwt);
  if (!user) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  if (!(await can({ user, modelName, action: 'create' }))) return Response.json({ error: 'Accès refusé' }, { status: 403 });
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Données invalides');
    if (modelName === 'res.users') {
      if (!body.password || typeof body.password !== 'string') throw new Error('Mot de passe requis');
      const bcrypt = await import('bcrypt');
      body.password_hash = await bcrypt.hash(body.password, 12);
      delete body.password;
    }
    return Response.json(await ModelClass.create({ company_id: user.company_id, vals: body }), { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || 'Création impossible' }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  const { modelName, ModelClass } = resolveModel(req, params);
  if (!ModelClass) return Response.json({ error: 'Modèle inconnu' }, { status: 404 });
  const user = getUserFromReq(req, jwt);
  if (!user) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  if (!(await can({ user, modelName, action: 'write' }))) return Response.json({ error: 'Accès refusé' }, { status: 403 });
  try {
    const { id, vals } = await req.json();
    await ModelClass.write({ id: Number(id), company_id: user.company_id, vals });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Modification impossible' }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { modelName, ModelClass } = resolveModel(req, params);
  if (!ModelClass) return Response.json({ error: 'Modèle inconnu' }, { status: 404 });
  const user = getUserFromReq(req, jwt);
  if (!user) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  if (!(await can({ user, modelName, action: 'unlink' }))) return Response.json({ error: 'Accès refusé' }, { status: 403 });
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: 'Identifiant invalide' }, { status: 400 });
  await ModelClass.unlink({ id, company_id: user.company_id });
  return Response.json({ ok: true });
}
