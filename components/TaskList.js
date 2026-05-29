'use client';
import { useMemo, useState } from 'react';
import TaskItem from './TaskItem';
import Modal from './Modal';
import { estEnRetard } from '@/hooks/useTaches';

const FILTRES = [
  { key: 'toutes',   label: 'Toutes' },
  { key: 'urgente',  label: 'Urgentes' },
  { key: 'haute',    label: 'Haute priorité' },
  { key: 'normale',  label: 'Normales' },
  { key: 'terminees',label: 'Terminées' },
  { key: 'retard',   label: 'En retard' },
];

export default function TaskList({ taches, onToggle, onSupprimer }) {
  const [filtre, setFiltre] = useState('toutes');
  const [idASupprimer, setIdASupprimer] = useState(null);

  function filtrerTaches() {
    switch (filtre) {
      case 'urgente':   return taches.filter(t => t.priorite === 'urgente'  && !t.terminee);
      case 'haute':     return taches.filter(t => t.priorite === 'haute'    && !t.terminee);
      case 'normale':   return taches.filter(t => t.priorite === 'normale'  && !t.terminee);
      case 'terminees': return taches.filter(t => t.terminee);
      case 'retard':    return taches.filter(t => estEnRetard(t) && !t.terminee);
      default:          return taches;
    }
  }

  const tachesFiltrees = filtrerTaches();
  const counts = useMemo(() => ({
    toutes: taches.length,
    urgente: taches.filter(t => t.priorite === 'urgente' && !t.terminee).length,
    haute: taches.filter(t => t.priorite === 'haute' && !t.terminee).length,
    normale: taches.filter(t => t.priorite === 'normale' && !t.terminee).length,
    terminees: taches.filter(t => t.terminee).length,
    retard: taches.filter(t => estEnRetard(t) && !t.terminee).length,
  }), [taches]);

  return (
    <>
      <div className="filters">
        {FILTRES.map(f => (
          <button
            key={f.key}
            className={`chip ${filtre === f.key ? 'active' : ''}`}
            onClick={() => setFiltre(f.key)}
          >
            {f.label}
            <span className="count">{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <section className="tasklist">
        {tachesFiltrees.length === 0 ? (
          <div className="empty">
            <div className="eh tl hatch-mid"></div>
            <div className="eh br hatch-mid"></div>
            <div className="etitle">Liste vide</div>
            <div className="etext">Aucune tâche ne correspond à ce filtre.</div>
          </div>
        ) : (
          tachesFiltrees.map(tache => (
            <TaskItem
              key={tache.id}
              tache={tache}
              onToggle={onToggle}
              onSupprimer={id => setIdASupprimer(id)}
            />
          ))
        )}
      </section>

      {idASupprimer && (
        <Modal
          onConfirmer={() => { onSupprimer(idASupprimer); setIdASupprimer(null); }}
          onAnnuler={() => setIdASupprimer(null)}
        />
      )}
    </>
  );
}
