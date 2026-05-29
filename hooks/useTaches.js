'use client';
import { useState, useEffect, useCallback } from 'react';

export function useTaches() {
  const [taches,    setTaches]    = useState([]);
  const [chargement, setChargement] = useState(true);

  // Charger les tâches depuis l'API au montage
  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const res = await fetch('/api/taches');
      if (res.ok) setTaches(await res.json());
    } catch (e) {
      console.error('Erreur chargement tâches :', e);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  async function ajouterTache(data) {
    const res = await fetch('/api/taches', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (res.ok) {
      const nouvelle = await res.json();
      setTaches(prev => [nouvelle, ...prev]);
    }
  }

  async function toggleTerminee(id) {
    const tache = taches.find(t => t.id === id);
    if (!tache) return;
    const res = await fetch(`/api/taches/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ terminee: !tache.terminee }),
    });
    if (res.ok) {
      const maj = await res.json();
      setTaches(prev => prev.map(t => t.id === id ? maj : t));
    }
  }

  async function supprimerTache(id) {
    const res = await fetch(`/api/taches/${id}`, { method: 'DELETE' });
    if (res.ok) setTaches(prev => prev.filter(t => t.id !== id));
  }

  // Ajouter une tâche importée depuis le calendrier
  function ajouterDepuisCalendrier(tache) {
    setTaches(prev => [tache, ...prev]);
  }

  const stats = {
    total:     taches.filter(t => !t.terminee).length,
    urgentes:  taches.filter(t => t.priorite === 'urgente' && !t.terminee).length,
    retard:    taches.filter(t => estEnRetard(t) && !t.terminee).length,
    terminees: taches.filter(t => t.terminee).length,
  };

  return { taches, chargement, ajouterTache, toggleTerminee, supprimerTache, ajouterDepuisCalendrier, stats };
}

// Utilitaires
export function estEnRetard(tache) {
  if (!tache.deadline || tache.terminee) return false;
  const auj = new Date(); auj.setHours(0,0,0,0);
  const dl  = new Date(tache.deadline + 'T00:00:00'); dl.setHours(0,0,0,0);
  return dl < auj;
}

export function procheDeadline(deadline) {
  if (!deadline) return false;
  const auj  = new Date(); auj.setHours(0,0,0,0);
  const dl   = new Date(deadline + 'T00:00:00'); dl.setHours(0,0,0,0);
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
