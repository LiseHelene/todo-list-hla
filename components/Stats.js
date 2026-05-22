export default function Stats({ stats }) {
  return (
    <div className="stats">
      <div className="stat-carte">
        <span className="stat-nombre">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-carte urgent">
        <span className="stat-nombre">{stats.urgentes}</span>
        <span className="stat-label">Urgentes</span>
      </div>
      <div className="stat-carte retard">
        <span className="stat-nombre">{stats.retard}</span>
        <span className="stat-label">En retard</span>
      </div>
      <div className="stat-carte terminees">
        <span className="stat-nombre">{stats.terminees}</span>
        <span className="stat-label">Terminées</span>
      </div>
    </div>
  );
}
