// lib/odoo-core/registry.js
class Registry {
  constructor() {
    this.models = new Map();
  }

  add(name, modelClass) {
    // Si le modèle existe déjà, c'est un _inherit -> on fusionne
    if (this.models.has(name)) {
      const oldModel = this.models.get(name);
      // Fusion des _fields
      modelClass._fields = { ...oldModel._fields, ...modelClass._fields };
      console.log(`[Registry] Héritage: ${name} étendu ->`, Object.keys(modelClass._fields));
    } else {
      console.log(`[Registry] Nouveau modèle: ${name}`);
    }
    this.models.set(name, modelClass);
  }

  get(name) {
    return this.models.get(name);
  }

  getAll() {
    return Array.from(this.models.keys());
  }

  getAllModels() {
    return this.models;
  }
}

export const registry = new Registry();