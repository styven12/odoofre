// lib/odoo-core/schema-builder.js
import { registry } from './registry.js';
import { pool } from './db.js';

export async function buildSchema() {
  console.log('[Schema] Construction...');
  for (const name of registry.getAll()) {
    const ModelClass = registry.get(name);
    const table = ModelClass.tableName;

    // Vérifie si table existe
    let sql = `CREATE TABLE IF NOT EXISTS ${table} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company_id INT NOT NULL,
      `;

    const cols = [];
    for (const [fieldName, fieldDef] of Object.entries(ModelClass._fields)) {
      cols.push(`${fieldName} ${fieldDef.toSQL()}`);
    }
    sql += cols.join(', ');
    sql += `, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX(company_id))`;

    await pool.query(sql);
    console.log(`[Schema] OK: ${table} (${cols.length} colonnes)`);

    // Gère ALTER TABLE si nouveau champ ajouté via _inherit
    // (On essaie d'ajouter chaque colonne, ignore si existe déjà)
    for (const [fieldName, fieldDef] of Object.entries(ModelClass._fields)) {
      try {
        await pool.query(`ALTER TABLE ${table} ADD COLUMN ${fieldName} ${fieldDef.toSQL()}`);
        console.log(`[Schema] Colonne ajoutée: ${table}.${fieldName}`);
      } catch (e) {
        // Colonne existe déjà, on ignore
      }
    }
  }
  console.log('[Schema] Terminé');
}