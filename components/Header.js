'use client';
import Image from "next/image";
import { signOut } from "next-auth/react";
import logoHla from "../TO DO LIST/uploads/Huglo Lepage Avocats - Gestionnaire de tâches.png";

function initialsFromName(name = "") {
  const cleaned = name.replace(/^Me\s+/i, "").trim();
  if (!cleaned) return "US";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Header({ session }) {
  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const fullName = session?.user?.name || session?.user?.email || "Utilisateur";
  const firstName = fullName.replace(/^Me\s+/i, "").split(/\s+/).filter(Boolean)[0] || "Utilisateur";
  const initials = initialsFromName(fullName);

  return (
    <header className="masthead">
      <div className="corner-hatch hatch-light"></div>
      <div className="corner-block"></div>

      <div className="brand">
        <div className="logo-slot-wrap">
          <Image
            src={logoHla}
            alt="Logo Huglo Lepage Avocats"
            width={56}
            height={56}
            className="logo-image"
            priority
          />
        </div>
        <div className="brand-text">
          <h1 className="firm">Cabinet Huglo Lepage</h1>
          <p className="sub">Gestionnaire de tâches</p>
        </div>
      </div>

      <div className="masthead-right">
        {session?.user && (
          <div className="user-row">
            <div className="user-btn">
              <span className="avatar">{initials}</span>
              <span className="uname">{firstName}</span>
            </div>
            <button
              className="logout-btn"
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Se déconnecter"
            >
              Se déconnecter
            </button>
          </div>
        )}
        <span className="date">{date}</span>
      </div>
    </header>
  );
}
