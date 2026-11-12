// models/core/res.groups.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const ResGroups = Model('res.groups')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // ex: 'admin', 'sales_user', 'account_user'
      full_name: new fields.String(), // ex: 'Ventes / Utilisateur'
    };
  }
);