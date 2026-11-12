import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { can } from '../../lib/odoo-core/security.js';
import { pool } from '../../lib/odoo-core/db.js';

const sections = [
  { title: 'Applications', links: [
    ['res-partner', 'Contacts', 'C'], ['crm-lead', 'CRM', '✦'],
    ['sale-order', 'Ventes', '↗'], ['account-move', 'Facturation', '€'],
    ['stock-picking', 'Inventaire', '▦'], ['hr-employee', 'Employés', '♙'],
    ['mrp-production', 'Fabrication', '⚙'],
  ]},
  { title: 'Raccourcis', links: [
    ['product-template', 'Produits', '◇'], ['account-account', 'Plan comptable', '≡'],
    ['crm-stage', 'Étapes CRM', '◷'], ['stock-quant', 'Niveaux de stock', '▤'],
  ]},
  { title: 'Configuration', links: [
    ['res-company', 'Sociétés', '▣'], ['res-users', 'Utilisateurs', '♧'],
    ['res-groups', 'Groupes', '◉'], ['ir-model-access', 'Droits d’accès', '⌑'],
    ['res-currency', 'Devises', '$'], ['uom', 'Unités de mesure', '↔'],
    ['product-category', 'Catégories produits', '◫'], ['pricelist', 'Listes de prix', '▤'],
    ['account-journal', 'Journaux', '▧'], ['stock-location', 'Emplacements', '⌖'],
    ['hr-department', 'Départements', '♧'], ['mrp-bom', 'Nomenclatures', '⚒'],
  ]},
];

export default async function AdminLayout({ children, params }) {
  const token = cookies().get('session')?.value;
  if (!token || !process.env.JWT_SECRET) redirect('/login');
  let user;
  try { user = jwt.verify(token, process.env.JWT_SECRET); }
  catch { redirect('/login'); }
  const active = params?.model || 'res-partner';
  const [[companyRows], [userRows], canManageUsers] = await Promise.all([
    pool.query('SELECT name FROM res_company WHERE id = ? AND company_id = ? LIMIT 1', [user.company_id, user.company_id]),
    pool.query('SELECT name FROM res_users WHERE id = ? AND company_id = ? LIMIT 1', [user.user_id, user.company_id]),
    can({ user, modelName: 'res.users', action: 'read' }),
  ]);
  const userName = userRows[0]?.name || 'Utilisateur';
  const initials = userName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const companyName = companyRows[0]?.name || `Société ${user.company_id}`;
  const visibleSections = await Promise.all(sections.map(async section => ({
    ...section,
    links: (await Promise.all(section.links.map(async link => {
      const allowed = await can({ user, modelName: link[0].replaceAll('-', '.'), action: 'read' });
      return allowed ? link : null;
    }))).filter(Boolean),
  })));
  const visibleLinks = visibleSections.flatMap(section => section.links);

  return (
    <div className="odoo-shell">
      <header className="topbar">
        <Link className="brand" href="/admin/res-partner"><span className="brand-mark">O</span><span>MiniOdoo</span></Link>
        <span className="top-divider" />
        <div className="top-context"><strong>Applications</strong><span>›</span><span>{visibleLinks.find(link => link[0] === active)?.[1] || 'Espace de travail'}</span></div>
        <div className="top-spacer" />
        <div className="company-chip"><span className="company-dot" />{companyName}</div>
        {canManageUsers && <Link className="top-action" href="/admin/res-users">Administration</Link>}
        <span className="avatar" title={userName}>{initials}</span>
        <a className="top-action" href="/api/auth/logout">Quitter</a>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          {visibleSections.filter(section => section.links.length).map(section => (
            <div key={section.title}>
              <div className={section.title === 'Applications' ? 'side-caption' : 'side-section'}>{section.title}</div>
              {section.links.map(([slug, label, icon]) => (
                <Link key={slug} href={`/admin/${slug}`} title={label} aria-label={label} className={`side-link ${active === slug ? 'active' : ''}`}>
                  <span className="side-icon">{icon}</span><span>{label}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="side-bottom">MiniOdoo · espace de gestion</div>
        </aside>
        <main className="main-area"><div className="page-wrap">{children}</div></main>
      </div>
    </div>
  );
}
