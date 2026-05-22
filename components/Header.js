export default function Header() {
  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="header">
      <div className="logo">⚖️</div>
      <div>
        <h1>Cabinet Huglo-Lepage</h1>
        <p className="sous-titre">Gestionnaire de tâches</p>
      </div>
      <div className="date-header">{date}</div>
    </header>
  );
}
