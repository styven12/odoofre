// models/core/res.currency.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const ResCurrency = Model('res.currency')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // XAF, EUR, USD
      symbol: new fields.String({ required: true }),
      rate: new fields.Number({ default: 1 }),
    };
  }
);