// models/index.js - VERSION FINALE
import './core/res.company.js';
import './core/res.groups.js';
import './core/ir.model.access.js';
import './core/res.currency.js';
import './core/uom.js';
import './core/product.js';
import './core/res.partner.js';
import './core/res.users.js';

import './sales/crm.lead.js'; 
import './sales/sale.order.js';
import './accounting/account.move.js';
import './stock/stock.picking.js';
import './hr/hr.employee.js';
import './mrp/mrp.production.js';

import { registry } from '../lib/odoo-core/registry.js';
console.log(`[Models] Total: ${registry.getAll().length} modèles ->`, registry.getAll());