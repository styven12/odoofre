// models/sales/crm.lead.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const CrmLead = Model('crm.lead')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // ex: Opportunité Société ABC
      partner_id: new fields.Relation('res.partner'), // client lié
      contact_name: new fields.String(),
      email: new fields.String(),
      phone: new fields.String(),
      expected_revenue: new fields.Number({ default: 0 }),
      probability: new fields.Number({ default: 10 }), // 10% au début
      stage: new fields.String({ default: 'new' }), // new, qualified, proposition, won, lost
      user_id: new fields.Relation('res.users'), // commercial assigné
      source: new fields.String(), // site web, salon, bouche à oreille
      description: new fields.Text(),
    };
  }
);

export const CrmStage = Model('crm.stage')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // Nouveau, Qualifié, Proposition, Gagné
      sequence: new fields.Number({ default: 1 }),
      is_won: new fields.Boolean({ default: false }),
    };
  }
);