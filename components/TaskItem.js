'use client';
import { estEnRetard, procheDeadline, formaterDate, labelPriorite } from '@/hooks/useTaches';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M4 7H10.5a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 4.5L3.5 7 6 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M2.5 4.5h11v7h-11v-7z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.9 5l5.1 3.8L13.1 5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M3 4.5h10M6.5 4.5V3.2c0-.4.3-.7.7-.7h1.6c.4 0 .7.3.7.7v1.3M5 4.5l.5 8c0 .5.4.9.9.9h3.2c.5 0 .9-.4.9-.9l.5-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TaskItem({ tache, onToggle, onSupprimer }) {
  const retard = estEnRetard(tache);
  const proche = procheDeadline(tache.deadline);
  const prioriteAffichee = labelPriorite(tache.priorite).replace(/^[^\s]+\s/, '');

  function envoyerRappelMail() {
    const sujet = encodeURIComponent(`Rappel tâche : ${tache.titre}`);
    const dl    = tache.deadline ? `\nDate limite : ${formaterDate(tache.deadline)}` : '';
    const corps = encodeURIComponent(
      `Bonjour,\n\nRappel concernant la tâche suivante :\n\nTâche : ${tache.titre}\nAssignée à : ${tache.avocat}\nPriorité : ${labelPriorite(tache.priorite)}${dl}\n${tache.description ? '\nDescription : ' + tache.description : ''}\n\nCordialement,\nCabinet Huglo-Lepage`
    );
    window.location.href = `mailto:${tache.email}?subject=${sujet}&body=${corps}`;
  }

  return (
    <article className={`task pri-${tache.priorite}${tache.terminee ? ' completed' : ''}`}>
      <div className="pri-rail"></div>

      <div className="body">
        <div className="row1">
          <div className="title">{tache.titre}</div>
          <span className={`tag ${tache.priorite}`}>{prioriteAffichee}</span>
        </div>

        <div className="meta">
          {tache.avocat && (
            <span className="m">
              <span className="dot"></span>
              {tache.avocat}
            </span>
          )}
          {tache.deadline && (
            <span className={`m${retard && !tache.terminee ? ' overdue' : ''}`}>
              <span className="dot"></span>
              {retard && !tache.terminee ? 'En retard — ' : 'Échéance '}
              {formaterDate(tache.deadline)}
              {proche && !retard && !tache.terminee ? ' (bientôt)' : ''}
            </span>
          )}
          {tache.terminee && <span className="m done">Terminée</span>}
        </div>

        {tache.description && <div className="desc">{tache.description}</div>}
      </div>

      <div className="actions">
        <button
          type="button"
          className="icon-btn done-btn"
          onClick={() => onToggle(tache.id)}
          title={tache.terminee ? 'Marquer non terminée' : 'Marquer terminée'}
        >
          {tache.terminee ? <UndoIcon /> : <CheckIcon />}
        </button>
        {tache.email && (
          <button
            type="button"
            className="icon-btn"
            onClick={envoyerRappelMail}
            title="Envoyer un rappel par mail"
          >
            <MailIcon />
          </button>
        )}
        <button
          type="button"
          className="icon-btn"
          onClick={() => onSupprimer(tache.id)}
          title="Supprimer"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}
