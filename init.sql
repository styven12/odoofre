-- ============================
-- 1. CREATION DES TABLES
-- ============================
CREATE DATABASE IF NOT EXISTS my_odoo;
USE my_odoo;

-- CORE
CREATE TABLE IF NOT EXISTS res_company (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  currency_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS res_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS ir_model_access (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  group_id INT,
  model_name VARCHAR(255) NOT NULL,
  perm_read BOOLEAN DEFAULT 1,
  perm_create BOOLEAN DEFAULT 0,
  perm_write BOOLEAN DEFAULT 0,
  perm_unlink BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS res_currency (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(255) NOT NULL,
  rate DECIMAL(15,2) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS uom (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS product_category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS product_template (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) DEFAULT 'stockable',
  list_price DECIMAL(15,2) DEFAULT 0,
  cost_price DECIMAL(15,2) DEFAULT 0,
  uom_id INT,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS res_partner (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(255),
  is_customer BOOLEAN DEFAULT 1,
  is_supplier BOOLEAN DEFAULT 0,
  street VARCHAR(255),
  city VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS res_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  login VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  partner_id INT,
  group_id INT,
  is_admin BOOLEAN DEFAULT 0,
  active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

-- SALES + CRM
CREATE TABLE IF NOT EXISTS crm_stage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  sequence DECIMAL(15,2) DEFAULT 1,
  is_won BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS crm_lead (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  partner_id INT,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  expected_revenue DECIMAL(15,2) DEFAULT 0,
  probability DECIMAL(15,2) DEFAULT 10,
  stage VARCHAR(255) DEFAULT 'new',
  user_id INT,
  source VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS pricelist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  currency_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS sale_order (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  partner_id INT,
  date_order VARCHAR(255),
  amount_total DECIMAL(15,2) DEFAULT 0,
  state VARCHAR(255) DEFAULT 'draft',
  pricelist_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS sale_order_line (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  order_id INT,
  product_id INT,
  quantity DECIMAL(15,2) DEFAULT 1,
  price_unit DECIMAL(15,2) DEFAULT 0,
  price_subtotal DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

-- ACCOUNTING
CREATE TABLE IF NOT EXISTS account_journal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS account_account (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL,
  account_type VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS account_move (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  move_type VARCHAR(255) NOT NULL,
  partner_id INT,
  invoice_date VARCHAR(255),
  amount_total DECIMAL(15,2) DEFAULT 0,
  amount_tax DECIMAL(15,2) DEFAULT 0,
  state VARCHAR(255) DEFAULT 'draft',
  journal_id INT,
  payment_state VARCHAR(255) DEFAULT 'not_paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS account_move_line (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  move_id INT,
  account_id INT,
  partner_id INT,
  debit DECIMAL(15,2) DEFAULT 0,
  credit DECIMAL(15,2) DEFAULT 0,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

-- STOCK
CREATE TABLE IF NOT EXISTS stock_location (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  location_type VARCHAR(255) DEFAULT 'internal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS stock_picking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  picking_type VARCHAR(255) NOT NULL,
  location_id INT,
  location_dest_id INT,
  partner_id INT,
  state VARCHAR(255) DEFAULT 'draft',
  origin VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS stock_move (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  picking_id INT,
  product_id INT,
  quantity DECIMAL(15,2) DEFAULT 0,
  location_id INT,
  location_dest_id INT,
  state VARCHAR(255) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS stock_quant (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  product_id INT,
  location_id INT,
  quantity DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

-- HR + MRP
CREATE TABLE IF NOT EXISTS hr_department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS hr_employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  department_id INT,
  job_title VARCHAR(255),
  work_email VARCHAR(255),
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS hr_leave (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  employee_id INT,
  date_from VARCHAR(255),
  date_to VARCHAR(255),
  state VARCHAR(255) DEFAULT 'draft',
  leave_type VARCHAR(255) DEFAULT 'paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS mrp_bom (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  product_id INT,
  product_qty DECIMAL(15,2) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS mrp_bom_line (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  bom_id INT,
  product_id INT,
  product_qty DECIMAL(15,2) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

CREATE TABLE IF NOT EXISTS mrp_production (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  product_id INT,
  product_qty DECIMAL(15,2) DEFAULT 1,
  bom_id INT,
  state VARCHAR(255) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(company_id)
);

-- ============================
-- 2. INSERTION DES DONNEES DE BASE
-- ============================

-- 2 sociétés pour tester l'isolation
INSERT INTO res_company (id, company_id, name, email) VALUES (1, 1, 'Ma Boite Test', 'contact@maboite.com');
INSERT INTO res_company (id, company_id, name, email) VALUES (2, 2, 'Deuxieme Societe', 'contact@deuxieme.com');

-- Devises
INSERT INTO res_currency (company_id, name, symbol, rate) VALUES (1, 'XAF', 'FCFA', 1);
INSERT INTO res_currency (company_id, name, symbol, rate) VALUES (1, 'EUR', '€', 655.96);
INSERT INTO res_currency (company_id, name, symbol, rate) VALUES (1, 'USD', '$', 600);

-- Unités
INSERT INTO uom (company_id, name, symbol) VALUES (1, 'Unité', 'pcs'), (1, 'Kilogramme', 'kg'), (1, 'Heure', 'h');

-- Groupes
INSERT INTO res_groups (id, company_id, name, full_name) VALUES (1, 1, 'admin', 'Administrateur');
INSERT INTO res_groups (id, company_id, name, full_name) VALUES (2, 1, 'sales_user', 'Ventes / Utilisateur');
INSERT INTO res_groups (id, company_id, name, full_name) VALUES (3, 1, 'account_user', 'Comptabilité / Utilisateur');

-- Droits d'accès pour sales_user (lecture + création sur ventes et CRM)
INSERT INTO ir_model_access (company_id, name, group_id, model_name, perm_read, perm_create, perm_write, perm_unlink) VALUES
(1, 'Sales CRM', 2, 'crm.lead', 1, 1, 1, 0),
(1, 'Sales Order', 2, 'sale.order', 1, 1, 1, 0),
(1, 'Sales Partner', 2, 'res.partner', 1, 1, 1, 0),
(1, 'Sales Product', 2, 'product.template', 1, 0, 0, 0);

-- Droits pour account_user
INSERT INTO ir_model_access (company_id, name, group_id, model_name, perm_read, perm_create, perm_write, perm_unlink) VALUES
(1, 'Account Move', 3, 'account.move', 1, 1, 1, 0),
(1, 'Account Partner', 3, 'res.partner', 1, 0, 0, 0);

-- Journaux comptables
INSERT INTO account_journal (company_id, name, type, code) VALUES (1, 'Ventes', 'sale', 'VEN'), (1, 'Achats', 'purchase', 'ACH'), (1, 'Banque', 'bank', 'BQ');

-- Plan comptable de base
INSERT INTO account_account (company_id, name, code, account_type) VALUES
(1, 'Clients', '411', 'asset'),
(1, 'Fournisseurs', '401', 'liability'),
(1, 'Ventes', '701', 'income'),
(1, 'Achats', '601', 'expense'),
(1, 'Banque', '512', 'asset');

-- Catégories produits
INSERT INTO product_category (company_id, name) VALUES (1, 'Services'), (1, 'Produits');

-- Stock locations
INSERT INTO stock_location (company_id, name, location_type) VALUES (1, 'WH/Stock', 'internal'), (1, 'WH/Customers', 'customer'), (1, 'WH/Suppliers', 'supplier');

-- Stages CRM
INSERT INTO crm_stage (company_id, name, sequence, is_won) VALUES (1, 'Nouveau', 1, 0), (1, 'Qualifié', 2, 0), (1, 'Proposition', 3, 0), (1, 'Gagné', 4, 1);

-- Admin user : login admin@test.com / mot de passe admin123
-- Hash bcrypt de 'admin123' : $2a$10$wJvQvZzQZzQZzQZzQZzQOeXAMPLE - remplace par le tien généré avec bcryptjs
INSERT INTO res_users (company_id, name, login, password_hash, group_id, is_admin) VALUES
(1, 'Admin', 'admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 1);

-- Client de démo pour tester l'isolation (company 1 uniquement)
INSERT INTO res_partner (company_id, name, email, is_customer) VALUES (1, 'Client Demo', 'client@demo.com', 1);
INSERT INTO product_template (company_id, name, list_price, cost_price, type) VALUES (1, 'Prestation Conseil', 50000, 10000, 'service');
