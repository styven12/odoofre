'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ login: '', password: '', company_id: '1' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Connexion impossible');
      window.location.assign('/admin/res-partner');
    } catch (err) { setError(err.message || 'Connexion impossible'); setLoading(false); }
  }

  return (
    <div className="login-page">
      <section className="login-art">
        <a href="/login" className="login-logo"><span className="login-mark">O</span><span>MiniOdoo</span></a>
        <div className="login-art-title"><h1>Tout le travail.<br />Au même endroit.</h1><p>Contacts, ventes, facturation, stock et équipe réunis dans un espace de travail simple.</p></div>
        <div className="login-art-foot">Gestion d’entreprise · Espace sécurisé</div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <h2>Content de te revoir</h2><p className="login-intro">Connecte-toi à l’espace de travail de ton entreprise.</p>
          <form className="login-form" onSubmit={submit}>
            <label>Adresse e-mail<input autoComplete="username" type="email" placeholder="nom@entreprise.com" value={form.login} onChange={e => setForm({ ...form, login: e.target.value })} required /></label>
            <label>Mot de passe<input autoComplete="current-password" type="password" placeholder="Ton mot de passe" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label>
            <label>Identifiant de société<input type="number" min="1" value={form.company_id} onChange={e => setForm({ ...form, company_id: e.target.value })} required /></label>
            {error && <div className="login-error" role="alert">{error}</div>}
            <button className="login-submit" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'} <span aria-hidden="true">→</span></button>
          </form>
          <p className="login-footnote">Besoin d’aide ? Contacte l’administrateur de ton entreprise.</p>
        </div>
      </section>
    </div>
  );
}
