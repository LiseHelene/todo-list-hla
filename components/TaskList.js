'use client';
import { useState } from 'react';
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
  const [filtre, setFiltre]       = useState('toutes');
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

  return (
    <>
      <div className="filtres">
        {FILTRES.map(f => (
          <button
            key={f.key}
            className={`filtre ${filtre === f.key ? 'actif' : ''}`}
            onClick={() => setFiltre(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="liste-taches">
        {tachesFiltrees.length === 0 ? (
          <p className="message-vide">Aucune tâche pour l&apos;instant.</p>
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
