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

  function soumettre(e) {
    e.preventDefault();
    if (!form.titre.trim()) { setErreur('Veuillez saisir le titre de la tâche.'); return; }
    if (!form.avocat) { setErreur('Veuillez assigner la tâche à un avocat.'); return; }
    onAjouter(form);
    setForm(VIDE);
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <span className="sq"></span>
        <span className="label">Ajouter une tâche</span>
        <span className="rule"></span>
      </div>

      <form className="form-grid" onSubmit={soumettre}>
        <div className="field">
          <label>
            Titre de la tâche <span className="req">*</span>
          </label>
          <input
            name="titre"
            value={form.titre}
            onChange={changer}
            placeholder="Ex : Préparer conclusions dossier Dupont"
            style={erreur && !form.titre.trim() ? { borderColor: "var(--green)" } : undefined}
          />
        </div>

        <div className="field">
          <label>
            Assigné à <span className="req">*</span>
          </label>
          <select
            name="avocat"
            value={form.avocat}
            onChange={changer}
            style={erreur && !form.avocat ? { borderColor: "var(--green)" } : undefined}
          >
            <option value="">-- Choisir un avocat --</option>
            {AVOCATS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="field">
          <label>
            Priorité <span className="req">*</span>
          </label>
          <select name="priorite" value={form.priorite} onChange={changer}>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div className="field">
          <label>Date limite</label>
          <input type="date" name="deadline" value={form.deadline} onChange={changer} />
        </div>

        <div className="field full">
          <label>Description <span className="optional">(optionnel)</span></label>
          <textarea
            name="description"
            value={form.description}
            onChange={changer}
            rows={3}
            placeholder="Détails supplémentaires..."
          />
        </div>

        <div className="field full">
          <label>E-mail pour rappel <span className="optional">(optionnel)</span></label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={changer}
            placeholder="avocat@huglo-lepage.fr"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            <span className="plus">+</span> Ajouter la tâche
          </button>
          {erreur ? (
            <span className="form-hint form-error">{erreur}</span>
          ) : (
            <span className="form-hint">
              Les champs marqués d&apos;un <span className="req">*</span> sont requis.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
