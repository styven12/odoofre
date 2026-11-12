// lib/odoo-core/fields.js

class BaseField {
  constructor(opts = {}) {
    this.kind = 'StringField';
    this.required = opts.required || false;
    this.default = opts.default;
    this.opts = opts;
  }
  toSQL() { return 'TEXT'; }
}

class StringField extends BaseField {
  constructor(opts = {}) { super(opts); this.kind = 'StringField'; }
  toSQL() { return 'VARCHAR(255)'; }
}
class NumberField extends BaseField {
  constructor(opts = {}) { super(opts); this.kind = 'NumberField'; }
  toSQL() { return 'DECIMAL(15,2)'; }
}
class BooleanField extends BaseField {
  constructor(opts = {}) { super(opts); this.kind = 'BooleanField'; }
  toSQL() { return `BOOLEAN DEFAULT ${this.default ? 1 : 0}`; }
}
class RelationField extends BaseField {
  constructor(comodel, opts = {}) {
    super(opts);
    this.kind = 'RelationField';
    this.comodel = comodel; // ex: 'res.partner'
  }
  toSQL() { return 'INT'; }
}
class TextField extends BaseField {
  constructor(opts = {}) { super(opts); this.kind = 'TextField'; }
  toSQL() { return 'TEXT'; }
}

export const fields = {
  String: StringField,
  Number: NumberField,
  Boolean: BooleanField,
  Relation: RelationField,
  Text: TextField,
};
