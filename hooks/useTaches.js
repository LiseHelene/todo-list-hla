'use client';
import { useState, useEffect } from 'react';

export function useTaches() {
  const [taches, setTaches] = useState([]);

  // Charger les tâches depuis le localStorage au démarrage
  useEffect(() => {
    const sauvegardees = localStorage.getItem('taches-huglo');
    if (sauvegardees) {
      setTaches(JSON.parse(sauvegardees));
    }
  }, []);

  // Sauvegarder automatiquement à chaque changement
  useEffect(() => {
    if (taches.length >= 0) {
      localStorage.setItem('taches-huglo', JSON.stringify(taches));
    }
  }, [taches]);

  function ajouterTache({ titre, avocat, priorite, deadline, description, email }) {
    const nouvelle = {
      id: Date.now(),
      titre,
      avocat,
      priorite,
      deadline,
      description,
      email,
      terminee: false,
      dateCreation: new Date().toISOString(),
    };
    setTaches(prev => [nouvelle, ...prev]);
  }

  function toggleTerminee(id) {
    setTaches(prev =>
      prev.map(t => t.id === id ? { ...t, terminee: !t.terminee } : t)
    );
  }

  function supprimerTache(id) {
    setTaches(prev => prev.filter(t => t.id !== id));
  }

  // Statistiques calculées
  const stats = {
    total:     taches.filter(t => !t.terminee).length,
    urgentes:  taches.filter(t => t.priorite === 'urgente' && !t.terminee).length,
    retard:    taches.filter(t => estEnRetard(t) && !t.terminee).length,
    terminees: taches.filter(t => t.terminee).length,
  };

  return { taches, ajouterTache, toggleTerminee, supprimerTache, stats };
}

// Utilitaires exportés pour réutilisation dans les composants
export function estEnRetard(tache) {
  if (!tache.deadline || tache.terminee) return false;
  const auj = new Date(); auj.setHours(0, 0, 0, 0);
  const dl  = new Date(tache.deadline); dl.setHours(0, 0, 0, 0);
  return dl < auj;
}

export function procheDeadline(deadline) {
  if (!deadline) return false;
  const auj = new Date(); auj.setHours(0, 0, 0, 0);
  const dl  = new Date(deadline); dl.setHours(0, 0, 0, 0);
  const diff = (dl - auj) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 3;
}

export function formaterDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function labelPriorite(p) {
  return { urgente: '🔴 Urgente', haute: '🟠 Haute', normale: '🔵 Normale' }[p] || p;
}
