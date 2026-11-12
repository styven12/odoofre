// models/accounting/account.move.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

// Chez Odoo, facture client, facture fournisseur, écriture = MÊME modèle
export const AccountMove = Model('account.move')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // INV/2024/0001
      move_type: new fields.String({ required: true }), // out_invoice (client), in_invoice (fournisseur), entry (écriture)
      partner_id: new fields.Relation('res.partner'),
      invoice_date: new fields.String(),
      amount_total: new fields.Number({ default: 0 }),
      amount_tax: new fields.Number({ default: 0 }),
      state: new fields.String({ default: 'draft' }), // draft, posted, cancelled
      journal_id: new fields.Relation('account.journal'),
      payment_state: new fields.String({ default: 'not_paid' }), // not_paid, paid
    };
  }
);

export const AccountMoveLine = Model('account.move.line')(
  class extends BaseModel {
    static _fields = {
      move_id: new fields.Relation('account.move', { required: true }),
      account_id: new fields.Relation('account.account'),
      partner_id: new fields.Relation('res.partner'),
      debit: new fields.Number({ default: 0 }),
      credit: new fields.Number({ default: 0 }),
      name: new fields.String(),
    };
  }
);

export const AccountJournal = Model('account.journal')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      type: new fields.String({ required: true }), // sale, purchase, bank, general
      code: new fields.String({ required: true }), // VEN, ACH, BQ
    };
  }
);

export const AccountAccount = Model('account.account')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      code: new fields.String({ required: true }), // 401, 411, 701
      account_type: new fields.String({ required: true }), // asset, liability, income, expense
    };
  }
);