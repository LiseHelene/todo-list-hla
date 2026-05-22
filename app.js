// ================================================
//   CABINET HUGLO-LEPAGE — GESTIONNAIRE DE TÂCHES
// ================================================

let taches = JSON.parse(localStorage.getItem('taches-huglo') || '[]');
let idASupprimer = null;
let filtreActuel = 'toutes';

// ---------- INITIALISATION ----------

document.addEventListener('DOMContentLoaded', () => {
  afficherDate();
  verifierFinDeMois();
  demanderPermissionNotifications();
  rendreTaches();
  verifierRappels();
  // Vérifier les rappels toutes les heures
  setInterval(verifierRappels, 60 * 60 * 1000);
});

function afficherDate() {
  const el = document.getElementById('date-aujourdhui');
  const maintenant = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = maintenant.toLocaleDateString('fr-FR', options);
}

// ---------- AJOUTER UNE TÂCHE ----------

function ajouterTache() {
  const titre       = document.getElementById('titre').value.trim();
  const avocat      = document.getElementById('avocat').value;
  const priorite    = document.getElementById('priorite').value;
  const deadline    = document.getElementById('deadline').value;
  const description = document.getElementById('description').value.trim();
  const email       = document.getElementById('email-notif').value.trim();

  if (!titre) {
    alert('Veuillez saisir le titre de la tâche.');
    document.getElementById('titre').focus();
    return;
  }
  if (!avocat) {
    alert('Veuillez assigner la tâche à un avocat.');
    document.getElementById('avocat').focus();
    return;
  }

  const nouvelleTache = {
    id:          Date.now(),
    titre,
    avocat,
    priorite,
    deadline,
    description,
    email,
    terminee:    false,
    dateCreation: new Date().toISOString()
  };

  taches.unshift(nouvelleTache);
  sauvegarder();
  reinitialiserFormulaire();
  rendreTaches();
}

function reinitialiserFormulaire() {
  document.getElementById('titre').value       = '';
  document.getElementById('avocat').value      = '';
  document.getElementById('priorite').value    = 'normale';
  document.getElementById('deadline').value    = '';
  document.getElementById('description').value = '';
  document.getElementById('email-notif').value = '';
}

// ---------- AFFICHAGE DES TÂCHES ----------

function rendreTaches() {
  const liste = document.getElementById('liste-taches');
  const messageVide = document.getElementById('message-vide');
  const tachesFiltrees = filtrerTaches();

  liste.innerHTML = '';
  majStatistiques();

  if (tachesFiltrees.length === 0) {
    messageVide.classList.remove('hidden');
    return;
  }
  messageVide.classList.add('hidden');

  tachesFiltrees.forEach(tache => {
    const el = creerElementTache(tache);
    liste.appendChild(el);
  });
}

function creerElementTache(tache) {
  const div = document.createElement('div');
  const retard = estEnRetard(tache);
  const classes = [
    'tache',
    `priorite-${tache.priorite}`,
    tache.terminee ? 'terminee' : '',
    retard && !tache.terminee ? 'en-retard' : ''
  ].filter(Boolean).join(' ');

  div.className = classes;
  div.setAttribute('data-id', tache.id);

  const badgePriorite = `<span class="badge badge-${tache.priorite}">${labelPriorite(tache.priorite)}</span>`;
  const badgeAvocat   = `<span class="badge badge-avocat">👤 ${tache.avocat}</span>`;
  const badgeDeadline = tache.deadline
    ? `<span class="badge badge-deadline ${retard && !tache.terminee ? 'retard' : procheDeadline(tache.deadline) && !tache.terminee ? 'proche' : ''}">
        📅 ${formaterDate(tache.deadline)}${retard && !tache.terminee ? ' ⚠ EN RETARD' : procheDeadline(tache.deadline) && !tache.terminee ? ' ⚡ Bientôt' : ''}
       </span>`
    : '';

  div.innerHTML = `
    <div class="tache-checkbox ${tache.terminee ? 'coche' : ''}" onclick="toggleTerminee(${tache.id})" title="${tache.terminee ? 'Marquer non terminée' : 'Marquer terminée'}">
      ${tache.terminee ? '✓' : ''}
    </div>
    <div class="tache-contenu">
      <div class="tache-titre">${escapeHtml(tache.titre)}</div>
      ${tache.description ? `<div class="tache-description">${escapeHtml(tache.description)}</div>` : ''}
      <div class="tache-meta">
        ${badgePriorite}
        ${badgeAvocat}
        ${badgeDeadline}
      </div>
    </div>
    <div class="tache-actions">
      ${tache.email ? `<button class="btn-action btn-mail" onclick="envoyerRappelMail(${tache.id})" title="Envoyer un rappel par mail">✉️</button>` : ''}
      <button class="btn-action btn-supprimer" onclick="demanderSuppression(${tache.id})" title="Supprimer">🗑️</button>
    </div>
  `;

  return div;
}

// ---------- ACTIONS SUR LES TÂCHES ----------

function toggleTerminee(id) {
  const tache = taches.find(t => t.id === id);
  if (tache) {
    tache.terminee = !tache.terminee;
    sauvegarder();
    rendreTaches();
  }
}

function demanderSuppression(id) {
  idASupprimer = id;
  document.getElementById('modal-suppression').classList.remove('hidden');
}

function fermerModal() {
  idASupprimer = null;
  document.getElementById('modal-suppression').classList.add('hidden');
}

function confirmerSuppression() {
  taches = taches.filter(t => t.id !== idASupprimer);
  sauvegarder();
  rendreTaches();
  fermerModal();
}

// ---------- FILTRES ----------

function filtrer(type, bouton) {
  filtreActuel = type;
  document.querySelectorAll('.filtre').forEach(b => b.classList.remove('actif'));
  bouton.classList.add('actif');
  rendreTaches();
}

function filtrerTaches() {
  switch (filtreActuel) {
    case 'urgente':   return taches.filter(t => t.priorite === 'urgente' && !t.terminee);
    case 'haute':     return taches.filter(t => t.priorite === 'haute'   && !t.terminee);
    case 'normale':   return taches.filter(t => t.priorite === 'normale' && !t.terminee);
    case 'terminees': return taches.filter(t => t.terminee);
    case 'retard':    return taches.filter(t => estEnRetard(t) && !t.terminee);
    default:          return taches;
  }
}

// ---------- STATISTIQUES ----------

function majStatistiques() {
  document.getElementById('stat-total').textContent     = taches.filter(t => !t.terminee).length;
  document.getElementById('stat-urgentes').textContent  = taches.filter(t => t.priorite === 'urgente' && !t.terminee).length;
  document.getElementById('stat-retard').textContent    = taches.filter(t => estEnRetard(t) && !t.terminee).length;
  document.getElementById('stat-terminees').textContent = taches.filter(t => t.terminee).length;
}

// ---------- RAPPELS PAR MAIL ----------

function envoyerRappelMail(id) {
  const tache = taches.find(t => t.id === id);
  if (!tache || !tache.email) return;

  const sujet   = encodeURIComponent(`Rappel tâche : ${tache.titre}`);
  const deadline = tache.deadline ? `\nDate limite : ${formaterDate(tache.deadline)}` : '';
  const corps   = encodeURIComponent(
    `Bonjour,\n\nRappel concernant la tâche suivante :\n\nTâche : ${tache.titre}\nAssignée à : ${tache.avocat}\nPriorité : ${labelPriorite(tache.priorite)}${deadline}\n${tache.description ? '\nDescription : ' + tache.description : ''}\n\nCordialement,\nCabinet Huglo-Lepage`
  );

  window.location.href = `mailto:${tache.email}?subject=${sujet}&body=${corps}`;
}

// ---------- RAPPELS AUTOMATIQUES (NOTIFICATIONS NAVIGATEUR) ----------

function demanderPermissionNotifications() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function verifierRappels() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);
  const demain = new Date(aujourd_hui);
  demain.setDate(demain.getDate() + 1);

  taches.forEach(tache => {
    if (tache.terminee || !tache.deadline) return;

    const dl = new Date(tache.deadline);
    dl.setHours(0, 0, 0, 0);

    // Rappel si deadline = aujourd'hui
    if (dl.getTime() === aujourd_hui.getTime()) {
      new Notification(`⚠ Échéance aujourd'hui — Cabinet Huglo-Lepage`, {
        body: `"${tache.titre}" est à rendre aujourd'hui (${tache.avocat}).`,
        icon: ''
      });
    }
    // Rappel si deadline = demain
    else if (dl.getTime() === demain.getTime()) {
      new Notification(`📅 Rappel demain — Cabinet Huglo-Lepage`, {
        body: `"${tache.titre}" est à rendre demain (${tache.avocat}).`,
        icon: ''
      });
    }
  });
}

// ---------- FIN DE MOIS - FACTURATION ----------

function verifierFinDeMois() {
  const maintenant  = new Date();
  const dernierJour = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0).getDate();
  const joursRestants = dernierJour - maintenant.getDate();

  // Afficher le rappel dans les 5 derniers jours du mois
  if (joursRestants <= 5) {
    document.getElementById('banniere-facturation').classList.remove('hidden');

    // Notification navigateur si autorisée
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💰 Rappel facturation — Cabinet Huglo-Lepage', {
        body: `Il reste ${joursRestants} jour(s) avant la fin du mois. Pensez à la facturation !`
      });
    }
  }
}

// ---------- UTILITAIRES ----------

function estEnRetard(tache) {
  if (!tache.deadline || tache.terminee) return false;
  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);
  const dl = new Date(tache.deadline);
  dl.setHours(0, 0, 0, 0);
  return dl < aujourd_hui;
}

function procheDeadline(deadline) {
  if (!deadline) return false;
  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diffJours = (dl - aujourd_hui) / (1000 * 60 * 60 * 24);
  return diffJours >= 0 && diffJours <= 3;
}

function formaterDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function labelPriorite(p) {
  return { urgente: '🔴 Urgente', haute: '🟠 Haute', normale: '🔵 Normale' }[p] || p;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sauvegarder() {
  localStorage.setItem('taches-huglo', JSON.stringify(taches));
}

// Fermer modal en cliquant dehors
document.addEventListener('click', e => {
  const modal = document.getElementById('modal-suppression');
  if (e.target === modal) fermerModal();
});

// Ajouter avec Entrée sur le champ titre
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('titre').addEventListener('keydown', e => {
    if (e.key === 'Enter') ajouterTache();
  });
});
