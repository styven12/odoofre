// models/hr/hr.employee.js
import { BaseModel, Model } from '../../lib/odoo-core/model.js';
import { fields } from '../../lib/odoo-core/fields.js';

export const HrDepartment = Model('hr.department')(
  class extends BaseModel {
    static _fields = { name: new fields.String({ required: true }) }
  }
);

export const HrEmployee = Model('hr.employee')(
  class extends BaseModel {
    static _fields = {
      name: new fields.String({ required: true }),
      department_id: new fields.Relation('hr.department'),
      job_title: new fields.String(),
      work_email: new fields.String(),
      user_id: new fields.Relation('res.users'),
    };
  }
);

export const HrLeave = Model('hr.leave')(
  class extends BaseModel {
    static _fields = {
      employee_id: new fields.Relation('hr.employee', { required: true }),
      date_from: new fields.String(),
      date_to: new fields.String(),
      state: new fields.String({ default: 'draft' }),
      leave_type: new fields.String({ default: 'paid' }),
    };
  }
);