export default function Stats({ stats }) {
  const cards = [
    { value: stats.total, label: "Total", glyph: "outline" },
    { value: stats.urgentes, label: "Urgentes", glyph: "solid", highlighted: stats.urgentes > 0 },
    { value: stats.retard, label: "En retard", glyph: "hatched", highlighted: stats.retard > 0 },
    { value: stats.terminees, label: "Terminées", glyph: "check" },
  ];

  return (
    <div className="stats">
      {cards.map((card) => (
        <div
          className={`stat${card.highlighted ? " active-metric" : ""}`}
          key={card.label}
        >
          <span className={`glyph ${card.glyph}${card.glyph === "hatched" ? " hatch-mid" : ""}`}></span>
          <span className="num">{card.value}</span>
          <span className="name">{card.label}</span>
        </div>
      ))}
    </div>
  );
}
