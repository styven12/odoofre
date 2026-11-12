import Link from 'next/link';
import '../../../../models/index.js';
import { getPageContext, getRelationOptions, getViewFields } from '../../../../lib/odoo-core/page-context.js';
import { can } from '../../../../lib/odoo-core/security.js';
import { modelLabel } from '../../../../lib/odoo-core/view-labels.js';
import { FormView } from '../../../../components/OdooView.jsx';

export const runtime = 'nodejs';

export default async function EditRecordPage({ params }) {
  const { user, modelName, ModelClass, allowed } = await getPageContext(params.model, 'write');
  if (!ModelClass) return <div className="notice">Ce modèle n’existe pas.</div>;
  if (!allowed) return <div className="notice">Tu n’as pas le droit de modifier cet enregistrement.</div>;
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return <div className="notice">Identifiant invalide.</div>;
  const [record] = await ModelClass.search({ company_id: user.company_id, domain: [['id', '=', id]] });
  if (!record) return <div className="notice">Cet enregistrement n’existe pas dans ta société.</div>;
  const title = modelLabel(modelName);
  const canDelete = await can({ user, modelName, action: 'unlink' });
  const fields = getViewFields(ModelClass);
  const relationOptions = await getRelationOptions(ModelClass, user.company_id, user);
  return <>
    <div className="breadcrumbs"><Link href={`/admin/${params.model}`}>{title}</Link><span>›</span><span className="crumb-current">{record.name || `${title} #${record.id}`}</span></div>
    <div className="page-heading"><div><h1>{record.name || `${title} #${record.id}`}</h1><p className="page-subtitle">Fiche {title.toLocaleLowerCase('fr')} · Référence {record.id}</p></div><Link className="secondary-button" href={`/admin/${params.model}`}>← Retour à la liste</Link></div>
    <div className="detail-grid"><FormView modelName={modelName} fields={fields} record={{ ...record }} canDelete={canDelete} relationOptions={relationOptions} />
      <aside className="detail-aside"><h3>À propos de cette fiche</h3><p>Les informations enregistrées sont rattachées à la société active. Les droits de modification et de suppression dépendent de ton profil.</p></aside>
    </div>
  </>;
}
