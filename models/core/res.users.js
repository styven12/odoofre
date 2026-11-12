// models/core/res.users.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const ResUsers = Model('res.users')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      login: new fields.String({ required: true }), // email
      password_hash: new fields.String({ required: true }),
      partner_id: new fields.Relation('res.partner'),
      group_id: new fields.Relation('res.groups'),
      is_admin: new fields.Boolean({ default: false }),
      active: new fields.Boolean({ default: true }),
    };
  }
);