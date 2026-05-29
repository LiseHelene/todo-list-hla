'use client';
import Image from "next/image";
import { signIn } from "next-auth/react";
import logoHla from "../TO DO LIST/uploads/Huglo Lepage Avocats - Gestionnaire de tâches.png";

export default function LoginPage() {
  return (
    <div className="auth-stage">
      <div className="auth-card">
        <div className="auth-top">
          <div className="corner-hatch hatch-light"></div>
          <div className="corner-block"></div>
          <div className="auth-logo-wrap">
            <Image
              src={logoHla}
              alt="Logo Huglo Lepage Avocats"
              width={44}
              height={44}
              className="logo-image"
              priority
            />
          </div>
          <div>
            <div className="firm">Cabinet Huglo Lepage</div>
            <div className="sub">Gestionnaire de tâches</div>
          </div>
        </div>

        <div className="auth-body">
          <div className="auth-title">Connexion</div>
          <div className="auth-lead">
            Connectez-vous avec votre compte Microsoft du cabinet pour accéder à l&apos;application.
          </div>

          <div className="divider">accès sécurisé</div>

          <button
            className="ms-btn"
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

          <p className="auth-switch">
            Accès réservé aux collaborateurs du cabinet
          </p>
        </div>
      </div>
    </div>
  );
}
