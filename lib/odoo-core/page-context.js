import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { registry } from './registry.js';
import { can } from './security.js';

export async function getPageContext(modelSlug, action) {
  const token = cookies().get('session')?.value;
  if (!token || !process.env.JWT_SECRET) redirect('/login');
  let user;
  try { user = jwt.verify(token, process.env.JWT_SECRET); }
  catch { redirect('/login'); }

  const modelName = modelSlug.replace(/-/g, '.');
  const ModelClass = registry.get(modelName);
  if (!ModelClass) return { user, modelName, ModelClass: null, allowed: false };
  const allowed = await can({ user, modelName, action });
  return { user, modelName, ModelClass, allowed };
}

export function getViewFields(ModelClass, includePassword = false) {
  const fields = Object.fromEntries(Object.entries(ModelClass._fields).map(([name, field]) => [name, {
    type: field.kind,
    required: Boolean(field.required),
    default: typeof field.default === 'function' ? null : field.default ?? null,
    comodel: field.comodel || null,
  }]));
  if (includePassword && ModelClass._name === 'res.users') {
    fields.password = { type: 'PasswordField', required: true, default: '' };
  }
  return fields;
}

export async function getRelationOptions(ModelClass, companyId, user) {
  const entries = Object.entries(ModelClass._fields).filter(([, field]) => field.kind === 'RelationField' && field.comodel);
  const options = await Promise.all(entries.map(async ([name, field]) => {
    const RelatedModel = registry.get(field.comodel);
    if (!RelatedModel || !(await can({ user, modelName: field.comodel, action: 'read' }))) return [name, []];
    const rows = await RelatedModel.search({ company_id: companyId });
    return [name, rows.slice(0, 200).map(row => ({ id: row.id, label: row.name || row.code || `${field.comodel} ${row.id}` }))];
  }));
  return Object.fromEntries(options);
}

