// models/mrp/mrp.production.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const MrpBom = Model('mrp.bom')(
  class extends BaseModel {
    static _fields = {
      product_id: new fields.Relation('product.template', { required: true }),
      product_qty: new fields.Number({ default: 1 }),
    };
  }
);

export const MrpBomLine = Model('mrp.bom.line')(
  class extends BaseModel {
    static _fields = {
      bom_id: new fields.Relation('mrp.bom', { required: true }),
      product_id: new fields.Relation('product.template', { required: true }),
      product_qty: new fields.Number({ default: 1 }),
    };
  }
);

export const MrpProduction = Model('mrp.production')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      product_id: new fields.Relation('product.template', { required: true }),
      product_qty: new fields.Number({ default: 1 }),
      bom_id: new fields.Relation('mrp.bom'),
      state: new fields.String({ default: 'draft' }), // draft, confirmed, done
    };
  }
);