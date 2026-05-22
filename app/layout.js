import "./globals.css";

export const metadata = {
  title: "Cabinet Huglo-Lepage — Gestionnaire de tâches",
  description: "Application de gestion des tâches du cabinet Huglo-Lepage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
