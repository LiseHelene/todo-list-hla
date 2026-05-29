'use client';
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="login-conteneur">
      <div className="login-carte">
        <div className="login-logo">⚖️</div>
        <h1>Huglo Lepage Avocats</h1>
        <p className="login-sous-titre">Gestionnaire de tâches</p>
        <div className="login-separateur" />
        <p className="login-description">
          Connectez-vous avec votre compte Microsoft du cabinet pour accéder à l&apos;application.
        </p>
        <button
          className="btn-microsoft"
          onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/" })}
        >
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Se connecter avec Microsoft
        </button>
        <p className="login-footer">
          Accès réservé aux collaborateurs du cabinet
        </p>
      </div>
    </div>
  );
}
