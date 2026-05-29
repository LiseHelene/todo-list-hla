'use client';
import { useState } from 'react';

export default function BannerFacturation() {
  const [visible, setVisible] = useState(() => {
    const maintenant  = new Date();
    const dernierJour = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0).getDate();
    const joursRestants = dernierJour - maintenant.getDate();
    return joursRestants <= 5;
  });

  if (!visible) return null;

  return (
    <div className="reminder" role="status">
      <span className="tick"></span>
      <span>
        Rappel : fin de mois approche — pensez à la <strong>facturation</strong>.
      </span>
      <button className="close" onClick={() => setVisible(false)} aria-label="Fermer la bannière">
        ×
      </button>
    </div>
  );
}
