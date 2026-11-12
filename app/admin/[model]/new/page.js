import Link from 'next/link';
import '../../../../models/index.js';
import { getPageContext, getRelationOptions, getViewFields } from '../../../../lib/odoo-core/page-context.js';
import { modelLabel } from '../../../../lib/odoo-core/view-labels.js';
import { FormView } from '../../../../components/OdooView.jsx';

export const runtime = 'nodejs';

export default async function NewRecordPage({ params }) {
  const { user, modelName, ModelClass, allowed } = await getPageContext(params.model, 'create');
  if (!ModelClass) return <div className="notice">Ce modèle n’existe pas.</div>;
  if (!allowed) return <div className="notice">Tu n’as pas le droit de créer cet enregistrement.</div>;
  const title = modelLabel(modelName);
  const fields = getViewFields(ModelClass, true);
  const relationOptions = await getRelationOptions(ModelClass, user.company_id, user);
  return <>
    <div className="breadcrumbs"><Link href={`/admin/${params.model}`}>{title}</Link><span>›</span><span className="crumb-current">Nouveau</span></div>
    <div className="page-heading"><div><h1>Créer : {title}</h1><p className="page-subtitle">Renseigne les informations puis enregistre la fiche.</p></div></div>
    <FormView modelName={modelName} fields={fields} relationOptions={relationOptions} />
  </>;
}
