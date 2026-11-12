const fieldLabels = {
  name: 'Nom', full_name: 'Nom complet', email: 'E-mail', phone: 'Téléphone', is_customer: 'Client',
  is_supplier: 'Fournisseur', street: 'Rue', city: 'Ville', login: 'Identifiant', group_id: 'Groupe',
  is_admin: 'Administrateur', active: 'Actif', password: 'Mot de passe', partner_id: 'Contact',
  contact_name: 'Nom du contact', expected_revenue: 'Revenu prévu', probability: 'Probabilité',
  stage: 'Étape', user_id: 'Commercial', source: 'Source', description: 'Description', sequence: 'Ordre',
  is_won: 'Gagné', date_order: 'Date de commande', amount_total: 'Total', state: 'Statut', pricelist_id: 'Liste de prix',
  order_id: 'Commande', product_id: 'Produit', quantity: 'Quantité', price_unit: 'Prix unitaire', price_subtotal: 'Sous-total',
  currency_id: 'Devise', type: 'Type', list_price: 'Prix de vente', cost_price: 'Coût', uom_id: 'Unité de mesure',
  category_id: 'Catégorie', move_type: 'Type de pièce', invoice_date: 'Date de facture', amount_tax: 'Taxes',
  journal_id: 'Journal', payment_state: 'Paiement', move_id: 'Pièce comptable', account_id: 'Compte', debit: 'Débit',
  credit: 'Crédit', code: 'Code', account_type: 'Type de compte', location_type: 'Type d’emplacement',
  picking_type: 'Type d’opération', location_id: 'Emplacement source', location_dest_id: 'Emplacement destination',
  origin: 'Origine', picking_id: 'Transfert', bom_id: 'Nomenclature', product_qty: 'Quantité prévue',
  department_id: 'Département', job_title: 'Fonction', work_email: 'E-mail professionnel', employee_id: 'Employé',
  date_from: 'Date de début', date_to: 'Date de fin', leave_type: 'Type de congé', logo: 'Logo',
  model_name: 'Modèle', perm_read: 'Lire', perm_create: 'Créer', perm_write: 'Modifier', perm_unlink: 'Supprimer',
  symbol: 'Symbole', rate: 'Taux',
};

const modelTitles = {
  'res.company': 'Sociétés', 'res.groups': 'Groupes d’utilisateurs', 'ir.model.access': 'Droits d’accès',
  'res.currency': 'Devises', uom: 'Unités de mesure', 'product.template': 'Articles',
  'product.category': 'Catégories d’articles', 'res.partner': 'Contacts', 'res.users': 'Utilisateurs',
  'crm.lead': 'Pistes', 'crm.stage': 'Étapes CRM', 'sale.order': 'Commandes clients',
  'sale.order.line': 'Lignes de commande', pricelist: 'Listes de prix', 'account.move': 'Factures et écritures',
  'account.move.line': 'Lignes comptables', 'account.journal': 'Journaux', 'account.account': 'Comptes',
  'stock.location': 'Emplacements', 'stock.picking': 'Transferts', 'stock.move': 'Mouvements de stock',
  'stock.quant': 'Niveaux de stock', 'hr.department': 'Départements', 'hr.employee': 'Employés',
  'hr.leave': 'Congés', 'mrp.bom': 'Nomenclatures', 'mrp.bom.line': 'Composants de nomenclature',
  'mrp.production': 'Ordres de fabrication',
};

export function fieldLabel(name) {
  return fieldLabels[name] || name.replaceAll('_', ' ').replace(/^./, character => character.toUpperCase());
}

export function modelLabel(name) {
  return modelTitles[name] || fieldLabel(name.split('.').pop());
}
