'use client';
import { useState, useEffect } from 'react';

export default function BannerFacturation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const maintenant  = new Date();
    const dernierJour = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0).getDate();
    const joursRestants = dernierJour - maintenant.getDate();
    if (joursRestants <= 5) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="banniere-facturation">
      <span>
        📄 Rappel : fin de mois approche — pensez à la <strong>facturation</strong> !
      </span>
      <button onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}
