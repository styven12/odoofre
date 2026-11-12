import Link from 'next/link';
import '../../../models/index.js';
import { getPageContext, getViewFields } from '../../../lib/odoo-core/page-context.js';
import { modelLabel } from '../../../lib/odoo-core/view-labels.js';
import { can } from '../../../lib/odoo-core/security.js';
import { ListView } from '../../../components/OdooView.jsx';

const descriptions = {
  'res.partner': 'Gère tes clients, fournisseurs et contacts depuis un seul endroit.',
  'crm.lead': 'Suis tes prospects et les opportunités commerciales.',
  'sale.order': 'Prépare et retrouve les commandes de tes clients.',
  'account.move': 'Consulte les factures clients, fournisseurs et écritures.',
  'stock.picking': 'Suis les opérations de réception, livraison et transfert.',
  'hr.employee': 'Centralise les informations de tes collaborateurs.',
  'mrp.production': 'Suis les ordres de fabrication de tes produits.',
  'product.template': 'Retrouve les articles et services de ton catalogue.',
};

export const runtime = 'nodejs';

export default async function AdminModelPage({ params }) {
  const { user, modelName, ModelClass, allowed } = await getPageContext(params.model, 'read');
  if (!ModelClass) return <div className="notice">Ce modèle n’existe pas dans le registre MiniOdoo.</div>;
  if (!allowed) return <div className="notice">Tu n’as pas le droit de consulter {fieldLabel(modelName)}.</div>;
  const records = await ModelClass.search({ company_id: user.company_id });
  const fields = getViewFields(ModelClass);
  const title = modelLabel(modelName);
  const canCreate = await can({ user, modelName, action: 'create' });

  return (
    <>
      <div className="breadcrumbs"><Link href="/admin/res-partner">Applications</Link><span>›</span><span className="crumb-current">{title}</span></div>
      <div className="page-heading">
        <div><h1>{title}</h1><p className="page-subtitle">{descriptions[modelName] || `Consulte et gère les ${title.toLocaleLowerCase('fr')} de ta société.`}</p></div>
        {canCreate && <Link className="primary-button" href={`/admin/${params.model}/new`}><span>＋</span> Nouveau</Link>}
      </div>
      <ListView modelName={modelName} fields={fields} records={records.map(record => ({ ...record }))} />
    </>
  );
}
