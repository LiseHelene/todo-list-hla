export default function Modal({ onConfirmer, onAnnuler }) {
  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onAnnuler()}>
      <div className="modal-contenu">
        <h3>Supprimer cette tâche ?</h3>
        <p>Cette action est irréversible.</p>
        <div className="modal-boutons">
          <button className="btn-annuler" onClick={onAnnuler}>Annuler</button>
          <button className="btn-confirmer" onClick={onConfirmer}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}
