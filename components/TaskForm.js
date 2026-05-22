'use client';
import { useState } from 'react';

const AVOCATS = [
  'Me Huglo', 'Me Lepage', 'Me Martin',
  'Me Dubois', 'Me Bernard', 'Tout le cabinet',
];

const VIDE = { titre: '', avocat: '', priorite: 'normale', deadline: '', description: '', email: '' };

export default function TaskForm({ onAjouter }) {
  const [form, setForm] = useState(VIDE);
  const [erreur, setErreur] = useState('');

  function changer(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErreur('');
  }

  function soumettre() {
    if (!form.titre.trim()) { setErreur('Veuillez saisir le titre de la tâche.'); return; }
    if (!form.avocat)       { setErreur('Veuillez assigner la tâche à un avocat.'); return; }
    onAjouter(form);
    setForm(VIDE);
  }

  return (
    <section className="carte formulaire-section">
      <h2>Ajouter une tâche</h2>
      {erreur && <p className="erreur">{erreur}</p>}
      <div className="grille-formulaire">
        <div className="champ">
          <label>Titre de la tâche *</label>
          <input
            name="titre" value={form.titre} onChange={changer}
            placeholder="Ex : Préparer conclusions dossier Dupont"
            onKeyDown={e => e.key === 'Enter' && soumettre()}
          />
        </div>
        <div className="champ">
          <label>Assigné à *</label>
          <select name="avocat" value={form.avocat} onChange={changer}>
            <option value="">-- Choisir un avocat --</option>
            {AVOCATS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="champ">
          <label>Priorité *</label>
          <select name="priorite" value={form.priorite} onChange={changer}>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente 🔴</option>
          </select>
        </div>
        <div className="champ">
          <label>Date limite</label>
          <input type="date" name="deadline" value={form.deadline} onChange={changer} />
        </div>
        <div className="champ champ-large">
          <label>Description (optionnel)</label>
          <textarea name="description" value={form.description} onChange={changer}
            rows={2} placeholder="Détails supplémentaires..." />
        </div>
        <div className="champ champ-large">
          <label>E-mail pour rappel (optionnel)</label>
          <input type="email" name="email" value={form.email} onChange={changer}
            placeholder="avocat@huglo-lepage.fr" />
        </div>
      </div>
      <button className="btn-ajouter" onClick={soumettre}>+ Ajouter la tâche</button>
    </section>
  );
}
