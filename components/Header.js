'use client';
import { signOut } from "next-auth/react";

export default function Header({ session }) {
  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="header">
      <div className="logo">⚖️</div>
      <div>
        <h1>Huglo Lepage Avocats</h1>
        <p className="sous-titre">Gestionnaire de tâches</p>
      </div>
      <div className="header-droite">
        <span className="date-header">{date}</span>
        {session?.user && (
          <div className="user-info">
            <span className="user-nom">{session.user.name || session.user.email}</span>
            <button
              className="btn-deconnexion"
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Se déconnecter"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
