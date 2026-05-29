'use client';
import { useState } from "react";

export default function ImportCalendrier({ onImporter }) {
  const [ouvert,     setOuvert]     = useState(false);
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [message,    setMessage]    = useState("");

  async function chargerEvenements() {
    setChargement(true);
    setMessage("");
    const res = await fetch("/api/microsoft/calendar");
    if (!res.ok) { setMessage("Impossible de charger le calendrier."); setChargement(false); return; }
    const data = await res.json();
    setEvenements(data);
    setChargement(false);
    setOuvert(true);
  }

  async function importer(ev) {
    const res = await fetch("/api/microsoft/calendar", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(ev),
    });
    if (res.ok) {
      const tache = await res.json();
      onImporter(tache);
      setEvenements(prev => prev.filter(e => e.id !== ev.id));
      setMessage("✓ Événement importé comme tâche.");
    }
  }

  return (
    <div className="import-calendrier">
      <button className="btn-import-cal" onClick={chargerEvenements} disabled={chargement}>
        {chargement ? "Chargement…" : "📅 Importer depuis Outlook"}
      </button>
      {message && <p className="import-message">{message}</p>}
      {ouvert && evenements.length > 0 && (
        <div className="import-liste">
          <p className="import-titre">Événements Outlook (30 prochains jours)</p>
          {evenements.map(ev => (
            <div key={ev.id} className="import-item">
              <div className="import-item-info">
                <span className="import-item-titre">{ev.subject}</span>
                <span className="import-item-date">
                  {ev.start?.dateTime
                    ? new Date(ev.start.dateTime).toLocaleDateString("fr-FR")
                    : ""}
                </span>
              </div>
              <button className="btn-import-item" onClick={() => importer(ev)}>
                + Importer
              </button>
            </div>
          ))}
        </div>
      )}
      {ouvert && evenements.length === 0 && !chargement && (
        <p className="import-vide">Aucun événement à importer.</p>
      )}
    </div>
  );
}
