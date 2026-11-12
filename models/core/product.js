// models/core/product.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const ProductTemplate = Model('product.template')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      type: new fields.String({ default: 'stockable' }), // stockable, service
      list_price: new fields.Number({ default: 0 }),
      cost_price: new fields.Number({ default: 0 }),
      uom_id: new fields.Relation('uom'),
      category_id: new fields.Relation('product.category'),
    };
  }
);

export const ProductCategory = Model('product.category')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
    };
  }
);