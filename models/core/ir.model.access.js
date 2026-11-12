// models/core/ir.model.access.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const IrModelAccess = Model('ir.model.access')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      group_id: new fields.Relation('res.groups'),
      model_name: new fields.String({ required: true }), // ex: 'sale.order'
      perm_read: new fields.Boolean({ default: true }),
      perm_create: new fields.Boolean({ default: false }),
      perm_write: new fields.Boolean({ default: false }),
      perm_unlink: new fields.Boolean({ default: false }),
    };
  }
);