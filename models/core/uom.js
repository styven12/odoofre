// models/core/uom.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const Uom = Model('uom')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // kg, pcs, heure
      symbol: new fields.String(),
    };
  }
);
