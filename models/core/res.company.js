// models/core/res.company.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const ResCompany = Model('res.company')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      logo: new fields.String(),
      email: new fields.String(),
      phone: new fields.String(),
      currency_id: new fields.Relation('res.currency'),
    };
  }
);