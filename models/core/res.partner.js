// models/core/res.partner.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const ResPartner = Model('res.partner')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      email: new fields.String(),
      phone: new fields.String(),
      is_customer: new fields.Boolean({ default: true }),
      is_supplier: new fields.Boolean({ default: false }),
      street: new fields.String(),
      city: new fields.String(),
    };
  }
);