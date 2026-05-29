import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Huglo Lepage Avocats — Gestionnaire de tâches",
  description: "Application de gestion des tâches du cabinet Huglo Lepage Avocats",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
