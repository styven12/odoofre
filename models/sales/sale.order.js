// models/sales/sale.order.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const SaleOrder = Model('sale.order')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // ex: SO001
      partner_id: new fields.Relation('res.partner', { required: true }),
      date_order: new fields.String({ default: () => new Date().toISOString() }),
      amount_total: new fields.Number({ default: 0 }),
      state: new fields.String({ default: 'draft' }), // draft, sent, sale, done, cancelled
      pricelist_id: new fields.Relation('pricelist'),
    };
  }
);

export const SaleOrderLine = Model('sale.order.line')(
  class extends BaseModel {
    static _fields = {
      order_id: new fields.Relation('sale.order', { required: true }),
      product_id: new fields.Relation('product.template', { required: true }),
      quantity: new fields.Number({ default: 1 }),
      price_unit: new fields.Number({ default: 0 }),
      price_subtotal: new fields.Number({ default: 0 }),
    };
  }
);

export const Pricelist = Model('pricelist')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      currency_id: new fields.Relation('res.currency'),
    };
  }
);