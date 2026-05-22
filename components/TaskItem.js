'use client';
import { estEnRetard, procheDeadline, formaterDate, labelPriorite } from '@/hooks/useTaches';

export default function TaskItem({ tache, onToggle, onSupprimer }) {
  const retard = estEnRetard(tache);
  const proche = procheDeadline(tache.deadline);

  function envoyerRappelMail() {
    const sujet = encodeURIComponent(`Rappel tâche : ${tache.titre}`);
    const dl    = tache.deadline ? `\nDate limite : ${formaterDate(tache.deadline)}` : '';
    const corps = encodeURIComponent(
      `Bonjour,\n\nRappel concernant la tâche suivante :\n\nTâche : ${tache.titre}\nAssignée à : ${tache.avocat}\nPriorité : ${labelPriorite(tache.priorite)}${dl}\n${tache.description ? '\nDescription : ' + tache.description : ''}\n\nCordialement,\nCabinet Huglo-Lepage`
    );
    window.location.href = `mailto:${tache.email}?subject=${sujet}&body=${corps}`;
  }

  const classes = [
    'tache',
    `priorite-${tache.priorite}`,
    tache.terminee ? 'terminee' : '',
    retard && !tache.terminee ? 'en-retard' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div
        className={`tache-checkbox ${tache.terminee ? 'coche' : ''}`}
        onClick={() => onToggle(tache.id)}
        title={tache.terminee ? 'Marquer non terminée' : 'Marquer terminée'}
      >
        {tache.terminee ? '✓' : ''}
      </div>

      <div className="tache-contenu">
        <div className="tache-titre">{tache.titre}</div>
        {tache.description && <div className="tache-description">{tache.description}</div>}
        <div className="tache-meta">
          <span className={`badge badge-${tache.priorite}`}>{labelPriorite(tache.priorite)}</span>
          <span className="badge badge-avocat">👤 {tache.avocat}</span>
          {tache.deadline && (
            <span className={`badge badge-deadline ${retard && !tache.terminee ? 'retard' : proche && !tache.terminee ? 'proche' : ''}`}>
              📅 {formaterDate(tache.deadline)}
              {retard && !tache.terminee ? ' ⚠ EN RETARD' : proche && !tache.terminee ? ' ⚡ Bientôt' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="tache-actions">
        {tache.email && (
          <button className="btn-action btn-mail" onClick={envoyerRappelMail} title="Envoyer un rappel par mail">
            ✉️
          </button>
        )}
        <button className="btn-action btn-supprimer" onClick={() => onSupprimer(tache.id)} title="Supprimer">
          🗑️
        </button>
      </div>
    </div>
  );
}
