// lib/odoo-core/model.js
import { pool } from './db.js';
import { registry } from './registry.js';

export class BaseModel {
  static _name = '';
  static _fields = {};

  // Convertit 'res.partner' -> 'res_partner'
  static get tableName() {
    return this._name.replace(/\./g, '_');
  }

  // search avec isolation company_id OBLIGATOIRE (Option B)
  static async search({ company_id, domain = [] }) {
    if (!company_id) throw new Error('company_id requis');
    const allowed = new Set(['id', ...Object.keys(this._fields)]);
    const clauses = ['company_id = ?'];
    const values = [company_id];
    for (const term of domain) {
      if (!Array.isArray(term) || term.length !== 3) throw new Error('Domaine invalide');
      const [field, operator, value] = term;
      if (!allowed.has(field) || !['=', '!=', '>', '>=', '<', '<=', 'like'].includes(operator)) {
        throw new Error('Champ ou opérateur de recherche invalide');
      }
      clauses.push(`\`${field}\` ${operator === 'like' ? 'LIKE' : operator} ?`);
      values.push(value);
    }
    const [rows] = await pool.query(
      `SELECT * FROM \`${this.tableName}\` WHERE ${clauses.join(' AND ')} ORDER BY id DESC LIMIT 500`,
      values
    );
    return rows;
  }

  static async create({ company_id, vals }) {
    if (!company_id) throw new Error('company_id requis');
    const data = { ...vals, company_id };
    for (const key of Object.keys(vals)) {
      if (!Object.hasOwn(this._fields, key)) throw new Error(`Champ inconnu: ${key}`);
    }
    if (Object.keys(vals).length === 0) throw new Error('Aucune donnée à créer');
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(',');

    const [result] = await pool.query(
      `INSERT INTO \`${this.tableName}\` (${keys.map(k => `\`${k}\``).join(',')}) VALUES (${placeholders})`,
      values
    );
    return { id: result.insertId, ...data };
  }

  static async write({ id, company_id, vals }) {
    const keys = Object.keys(vals);
    if (!id || !company_id || keys.length === 0) throw new Error('Identifiant, société et champs requis');
    for (const key of keys) {
      if (!Object.hasOwn(this._fields, key)) throw new Error(`Champ inconnu: ${key}`);
    }
    const sets = keys.map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(
      `UPDATE \`${this.tableName}\` SET ${sets} WHERE id = ? AND company_id = ?`,
      [...keys.map(k => vals[k]), id, company_id]
    );
  }

  static async unlink({ id, company_id }) {
    await pool.query(`DELETE FROM ${this.tableName} WHERE id = ? AND company_id = ?`, [id, company_id]);
  }
}

// Décorateur Model('nom') ou Model('nouveau', 'ancien') pour _inherit
export function Model(name, inheritName) {
  return function (cls) {
    if (inheritName) {
      // Mode _inherit : on garde le nom de l'ancien modèle
      cls._name = inheritName;
      // La fusion se fera dans registry.add()
    } else {
      cls._name = name;
    }
    registry.add(cls._name, cls);
    return cls;
  };
}
