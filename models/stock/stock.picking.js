// models/stock/stock.picking.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const StockLocation = Model('stock.location')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // WH/Stock, WH/Customers
      location_type: new fields.String({ default: 'internal' }), // internal, customer, supplier
    };
  }
);

export const StockPicking = Model('stock.picking')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }), // WH/OUT/0001
      picking_type: new fields.String({ required: true }), // incoming, outgoing, internal
      location_id: new fields.Relation('stock.location'),
      location_dest_id: new fields.Relation('stock.location'),
      partner_id: new fields.Relation('res.partner'),
      state: new fields.String({ default: 'draft' }), // draft, assigned, done
      origin: new fields.String(), // ex: SO001
    };
  }
);

export const StockMove = Model('stock.move')(
  class extends BaseModel {
    static _fields = {
      picking_id: new fields.Relation('stock.picking'),
      product_id: new fields.Relation('product.template'),
      quantity: new fields.Number({ default: 0 }),
      location_id: new fields.Relation('stock.location'),
      location_dest_id: new fields.Relation('stock.location'),
      state: new fields.String({ default: 'draft' }),
    };
  }
);

export const StockQuant = Model('stock.quant')(
  class extends BaseModel {
    static _fields = {
      product_id: new fields.Relation('product.template', { required: true }),
      location_id: new fields.Relation('stock.location', { required: true }),
      quantity: new fields.Number({ default: 0 }),
    };
  }
);
