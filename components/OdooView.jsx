'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fieldLabel } from '../lib/odoo-core/view-labels.js';

function displayValue(value) {
  if (value === null || value === undefined || value === '') return <span className="id-cell">—</span>;
  if (value === 1 || value === true) return <span className="bool-pill bool-yes">Oui</span>;
  if (value === 0 || value === false) return <span className="bool-pill bool-no">Non</span>;
  return String(value);
}

export function ListView({ modelName, fields, records }) {
  const [query, setQuery] = useState('');
  const fieldNames = Object.keys(fields);
  const visibleRecords = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('fr');
    if (!q) return records;
    return records.filter(record => fieldNames.some(name => String(record[name] ?? '').toLocaleLowerCase('fr').includes(q)));
  }, [fieldNames, query, records]);
  const slug = modelName.replaceAll('.', '-');

  return (
    <>
      <div className="toolbar">
        <label className="search-box"><span>⌕</span><input aria-label="Rechercher" placeholder="Rechercher…" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <button className="secondary-button" type="button" onClick={() => window.location.reload()} title="Actualiser">↻</button>
        <span className="toolbar-label">{visibleRecords.length} enregistrement{visibleRecords.length > 1 ? 's' : ''}</span>
      </div>
      <div className="table-card">
        {visibleRecords.length ? (
          <div className="table-scroll"><table className="data-table"><thead><tr>
            {fieldNames.map(field => <th key={field}>{fieldLabel(field)}</th>)}<th>Référence</th>
          </tr></thead><tbody>
            {visibleRecords.map(record => <tr key={record.id}>
              {fieldNames.map((field, index) => <td key={field}>
                {index === 0 ? <a className="record-link" href={`/admin/${slug}/${record.id}`}>{displayValue(record[field])}</a> : displayValue(record[field])}
              </td>)}
              <td className="id-cell">{record.id}</td>
            </tr>)}
          </tbody></table></div>
        ) : (
          <div className="empty-state"><div className="empty-icon">⌕</div><strong>{query ? 'Aucun résultat' : 'Aucun enregistrement'}</strong><span>{query ? 'Modifie ta recherche pour voir d’autres résultats.' : 'Crée ton premier élément pour commencer.'}</span></div>
        )}
        <div className="record-count">Affichage de {visibleRecords.length} sur {records.length}</div>
      </div>
    </>
  );
}

export function FormView({ modelName, fields, record = null, canDelete = false, relationOptions = {} }) {
  const router = useRouter();
  const editing = Boolean(record);
  const [values, setValues] = useState(() => Object.fromEntries(Object.entries(fields).map(([name, def]) => [name, record?.[name] ?? def.default ?? (def.type === 'BooleanField' ? false : '')])));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const slug = modelName.replaceAll('.', '-');
  const entries = Object.entries(fields).filter(([name]) => !['company_id', 'created_at', 'password_hash'].includes(name));

  async function save(event) {
    event.preventDefault();
    setSaving(true); setError('');
    const vals = {};
    for (const [name, def] of entries) {
      if (name === 'password' && !values[name] && editing) continue;
      let value = values[name];
      if (def.type === 'BooleanField') value = Boolean(value);
      else if (value === '' && ['NumberField', 'RelationField'].includes(def.type)) value = null;
      else if (value !== '' && ['NumberField', 'RelationField'].includes(def.type)) value = Number(value);
      vals[name] = value;
    }
    try {
      const response = await fetch(`/api/model/${slug}`, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { id: record.id, vals } : vals),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Enregistrement impossible');
      router.push(`/admin/${slug}`); router.refresh();
    } catch (err) { setError(err.message || 'Une erreur est survenue'); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!window.confirm('Supprimer cet enregistrement ?')) return;
    const response = await fetch(`/api/model/${slug}?id=${record.id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'Suppression impossible'); return; }
    router.push(`/admin/${slug}`); router.refresh();
  }

  return (
    <form className="form-card" onSubmit={save}>
      <div className="form-card-head"><h2>{editing ? 'Informations' : 'Nouvel enregistrement'}</h2><p>Les champs marqués d’un astérisque sont obligatoires.</p></div>
      <div className="form-grid">{entries.map(([name, def]) => {
        const value = values[name];
        const label = fieldLabel(name);
        if (def.type === 'BooleanField') return <div className="form-field" key={name}><label>{label}</label><label className="checkbox-row"><input type="checkbox" checked={Boolean(value)} onChange={e => setValues(old => ({ ...old, [name]: e.target.checked }))} /> Oui / Non</label></div>;
        const inputType = def.type === 'PasswordField' ? 'password' : ['NumberField', 'RelationField'].includes(def.type) ? 'number' : 'text';
        return <div className="form-field" key={name}><label htmlFor={`field-${name}`}>{label}{def.required && <span className="required-mark">*</span>}</label>
          {def.type === 'TextField' ? <textarea id={`field-${name}`} className="form-input" rows="4" required={Boolean(def.required)} value={value ?? ''} onChange={e => setValues(old => ({ ...old, [name]: e.target.value }))} /> : def.type === 'RelationField' && relationOptions[name]?.length ? <select id={`field-${name}`} className="form-input" required={Boolean(def.required)} value={value ?? ''} onChange={e => setValues(old => ({ ...old, [name]: e.target.value }))}>
            <option value="">— Sélectionner —</option>{relationOptions[name].map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select> : <input id={`field-${name}`} className="form-input" type={inputType} step={def.type === 'NumberField' ? 'any' : undefined} required={Boolean(def.required)} value={value ?? ''} placeholder={def.type === 'RelationField' ? 'Identifiant lié' : ''} onChange={e => setValues(old => ({ ...old, [name]: e.target.value }))} />}
        </div>;
      })}</div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-footer"><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button><button className="secondary-button" type="button" onClick={() => router.back()}>Annuler</button><span className="form-footer-spacer" />{editing && canDelete && <button className="danger-button" type="button" onClick={remove}>Supprimer</button>}</div>
    </form>
  );
}
