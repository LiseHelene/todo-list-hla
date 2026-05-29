const { useState, useEffect, useMemo, useRef } = React;
const { LoginScreen, SignupScreen, ProfileScreen, UserMenu } = window;

const AVOCATS = [
  "Me Corinne Lepage",
  "Me Christian Huglo",
  "Me Guillaume Cornu",
  "Me Arielle Guillaumot",
  "Me Léa Brière",
];

const PRIORITIES = [
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute priorité" },
  { value: "urgente", label: "Urgente" },
];

const STORE_KEY = "hl_taches_v1";
const USER_KEY = "hl_user_v1";

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function deriveName(email) {
  const local = (email || "").split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!local) return "Utilisateur";
  return local.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

const SEED = [
  {
    id: "t1",
    titre: "Préparer les conclusions — dossier ICPE Métaux du Rhône",
    avocat: "Me Corinne Lepage",
    priorite: "urgente",
    echeance: addDays(2),
    description: "Réponse au mémoire de la préfecture avant audience au tribunal administratif.",
    email: "c.lepage@huglo-lepage.fr",
    done: false,
  },
  {
    id: "t2",
    titre: "Note de synthèse — reporting de durabilité (CSRD)",
    avocat: "Me Guillaume Cornu",
    priorite: "haute",
    echeance: addDays(6),
    description: "Cadrage du devoir de vigilance pour le client industriel ; livrable attendu en comité.",
    email: "",
    done: false,
  },
  {
    id: "t3",
    titre: "Audit conformité sols pollués — site Seveso",
    avocat: "Me Arielle Guillaumot",
    priorite: "normale",
    echeance: addDays(-1),
    description: "Vérification des servitudes et de la traçabilité des terres excavées.",
    email: "",
    done: false,
  },
  {
    id: "t4",
    titre: "Veille réglementaire — énergies renouvelables (ENR)",
    avocat: "Me Léa Brière",
    priorite: "normale",
    echeance: addDays(-4),
    description: "Mise à jour de la lettre mensuelle de l'énergie.",
    email: "",
    done: true,
  },
];

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return SEED;
}

const isOverdue = (t) => !t.done && t.echeance && t.echeance < todayISO();

const fmtDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
};

// ---------------- Reminder ----------------
function Reminder({ onClose }) {
  return (
    <div className="reminder">
      <span className="tick"></span>
      <span>Rappel : fin de mois approche — pensez à la <strong>facturation</strong>.</span>
      <button className="close" onClick={onClose} aria-label="Fermer">×</button>
    </div>
  );
}

// ---------------- Header ----------------
function Masthead({ user, onProfile, onLogout }) {
  const date = useMemo(
    () => new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    []
  );
  return (
    <header className="masthead">
      <div className="corner-hatch hatch-light"></div>
      <div className="corner-block"></div>
      <div className="brand">
        <div className="logo-slot-wrap">
          <image-slot id="hl-logo" style={{ width: "56px", height: "56px" }} shape="rect" fit="contain" placeholder="Logo"></image-slot>
        </div>
        <div className="brand-text">
          <h1 className="firm">Cabinet Huglo&nbsp;Lepage</h1>
          <div className="sub">Gestionnaire de tâches</div>
        </div>
      </div>
      <div className="masthead-right">
        {user && <UserMenu user={user} onProfile={onProfile} onLogout={onLogout} />}
        <div className="date">{date}</div>
      </div>
    </header>
  );
}

// ---------------- Stats ----------------
function Stats({ tasks }) {
  const total = tasks.length;
  const urgentes = tasks.filter((t) => t.priorite === "urgente" && !t.done).length;
  const retard = tasks.filter((t) => isOverdue(t)).length;
  const terminees = tasks.filter((t) => t.done).length;

  const cards = [
    { num: total, name: "Total", glyph: "outline" },
    { num: urgentes, name: "Urgentes", glyph: "solid" },
    { num: retard, name: "En retard", glyph: "hatched" },
    { num: terminees, name: "Terminées", glyph: "check" },
  ];

  return (
    <div className="stats">
      {cards.map((c, i) => (
        <div className={"stat" + (c.num > 0 && (c.name === "Urgentes" || c.name === "En retard") ? " active-metric" : "")} key={i}>
          <span className={"glyph " + c.glyph + (c.glyph === "hatched" ? " hatch-mid" : "")}></span>
          <div className="num">{c.num}</div>
          <div className="name">{c.name}</div>
        </div>
      ))}
    </div>
  );
}

// ---------------- Form ----------------
const EMPTY_FORM = { titre: "", avocat: "", priorite: "normale", echeance: "", description: "", email: "" };

function TaskForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.titre.trim()) errs.titre = true;
    if (!form.avocat) errs.avocat = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onAdd({ ...form, id: "t" + Date.now(), done: false });
    setForm(EMPTY_FORM);
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <span className="sq"></span>
        <span className="label">Ajouter une tâche</span>
        <span className="rule"></span>
      </div>
      <form className="form-grid" onSubmit={submit}>
        <div className="field">
          <label>Titre de la tâche <span className="req">*</span></label>
          <input
            value={form.titre}
            onChange={set("titre")}
            placeholder="Ex : Préparer conclusions dossier Dupont"
            style={errors.titre ? { borderColor: "var(--green)" } : null}
          />
        </div>
        <div className="field">
          <label>Assigné à <span className="req">*</span></label>
          <select value={form.avocat} onChange={set("avocat")} style={errors.avocat ? { borderColor: "var(--green)" } : null}>
            <option value="">— Choisir un avocat —</option>
            {AVOCATS.map((a) => (<option key={a} value={a}>{a}</option>))}
          </select>
        </div>
        <div className="field">
          <label>Priorité <span className="req">*</span></label>
          <select value={form.priorite} onChange={set("priorite")}>
            {PRIORITIES.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
          </select>
        </div>
        <div className="field">
          <label>Date limite</label>
          <input type="date" value={form.echeance} onChange={set("echeance")} />
        </div>
        <div className="field full">
          <label>Description <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optionnel)</span></label>
          <textarea value={form.description} onChange={set("description")} placeholder="Détails complémentaires sur le dossier…"></textarea>
        </div>
        <div className="field full">
          <label>E-mail pour rappel <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optionnel)</span></label>
          <input type="email" value={form.email} onChange={set("email")} placeholder="avocat@huglo-lepage.fr" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary"><span className="plus">+</span> Ajouter la tâche</button>
          <span className="form-hint">Les champs marqués d'un&nbsp;<span style={{ color: "var(--green)" }}>*</span>&nbsp;sont requis.</span>
        </div>
      </form>
    </section>
  );
}

// ---------------- Filters ----------------
function Filters({ active, setActive, counts }) {
  const items = [
    { key: "toutes", label: "Toutes", count: counts.toutes },
    { key: "urgentes", label: "Urgentes", count: counts.urgentes },
    { key: "haute", label: "Haute priorité", count: counts.haute },
    { key: "normales", label: "Normales", count: counts.normales },
    { key: "terminees", label: "Terminées", count: counts.terminees },
    { key: "retard", label: "En retard", count: counts.retard },
  ];
  return (
    <div className="filters">
      {items.map((it) => (
        <button
          key={it.key}
          className={"chip" + (active === it.key ? " active" : "")}
          onClick={() => setActive(it.key)}
        >
          {it.label}
          <span className="count">{it.count}</span>
        </button>
      ))}
    </div>
  );
}

// ---------------- Task item ----------------
function CheckIcon() {
  return (<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function UndoIcon() {
  return (<svg viewBox="0 0 16 16" fill="none"><path d="M4 7H10.5a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 4.5L3.5 7 6 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function TrashIcon() {
  return (<svg viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4.5V3.2c0-.4.3-.7.7-.7h1.6c.4 0 .7.3.7.7v1.3M5 4.5l.5 8c0 .5.4.9.9.9h3.2c.5 0 .9-.4.9-.9l.5-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

function TaskItem({ t, onToggle, onDelete }) {
  const overdue = isOverdue(t);
  const priLabel = PRIORITIES.find((p) => p.value === t.priorite)?.label || "Normale";
  return (
    <div className={"task pri-" + t.priorite + (t.done ? " completed" : "")}>
      <div className="pri-rail"></div>
      <div className="body">
        <div className="row1">
          <div className="title">{t.titre}</div>
          <span className={"tag " + t.priorite}>{t.priorite === "haute" ? "Haute" : priLabel}</span>
        </div>
        <div className="meta">
          {t.avocat && (<span className="m"><span className="dot"></span>{t.avocat}</span>)}
          {t.echeance && (
            <span className={"m" + (overdue ? " overdue" : "")}>
              <span className="dot" style={overdue ? { background: "var(--green-deep)" } : null}></span>
              {overdue ? "En retard — " : "Échéance "}{fmtDate(t.echeance)}
            </span>
          )}
          {t.done && (<span className="m" style={{ color: "var(--green-mid)" }}>✓ Terminée</span>)}
        </div>
        {t.description && (<div className="desc">{t.description}</div>)}
      </div>
      <div className="actions">
        <button className="icon-btn done-btn" title={t.done ? "Rouvrir" : "Marquer terminée"} onClick={() => onToggle(t.id)}>
          {t.done ? <UndoIcon /> : <CheckIcon />}
        </button>
        <button className="icon-btn" title="Supprimer" onClick={() => onDelete(t.id)}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

// ---------------- Empty ----------------
function Empty({ filter }) {
  const msg = filter === "toutes"
    ? "Aucune tâche pour le moment. Ajoutez-en une via le formulaire ci-dessus."
    : "Aucune tâche ne correspond à ce filtre.";
  return (
    <div className="empty">
      <div className="eh tl hatch-mid"></div>
      <div className="eh br hatch-mid"></div>
      <div className="etitle">Liste vide</div>
      <div className="etext">{msg}</div>
    </div>
  );
}

// ---------------- App ----------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#2D5C4E",
  "density": "regular",
  "fields": "outline",
  "radius": 6,
  "grid": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState("toutes");
  const [showReminder, setShowReminder] = useState(true);

  // ---- auth / routing ----
  const [user, setUser] = useState(loadUser);
  const [view, setView] = useState(loadUser() ? "app" : "login");

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }, [user]);

  const signIn = ({ email, name, role, sso }) => {
    const u = {
      email,
      name: name || deriveName(email),
      role: role || "Avocat collaborateur",
      sso: !!sso,
    };
    setUser(u);
    setView("app");
  };
  const signInMicrosoft = () => signIn({ email: "c.lepage@huglo-lepage.fr", name: "Me Corinne Lepage", role: "Avocate associée", sso: true });
  const handleLogout = () => { setUser(null); setView("login"); };
  const updateProfile = (patch) => setUser((u) => ({ ...u, ...patch }));
  const toggleSSO = () => setUser((u) => ({ ...u, sso: !u.sso }));

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(tasks)); } catch (e) {}
  }, [tasks]);

  // apply tweaks to root
  useEffect(() => {
    document.documentElement.style.setProperty("--green", t.primary);
    document.documentElement.setAttribute("data-density", t.density);
    document.documentElement.setAttribute("data-fields", t.fields);
    document.documentElement.style.setProperty("--radius", t.radius + "px");
    document.body.classList.toggle("grid-on", !!t.grid);
  }, [t.primary, t.density, t.fields, t.radius, t.grid]);

  const addTask = (task) => setTasks((arr) => [task, ...arr]);
  const toggleTask = (id) => setTasks((arr) => arr.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const deleteTask = (id) => setTasks((arr) => arr.filter((x) => x.id !== id));

  const counts = useMemo(() => ({
    toutes: tasks.length,
    urgentes: tasks.filter((x) => x.priorite === "urgente" && !x.done).length,
    haute: tasks.filter((x) => x.priorite === "haute" && !x.done).length,
    normales: tasks.filter((x) => x.priorite === "normale" && !x.done).length,
    terminees: tasks.filter((x) => x.done).length,
    retard: tasks.filter((x) => isOverdue(x)).length,
  }), [tasks]);

  const visible = useMemo(() => {
    switch (filter) {
      case "urgentes": return tasks.filter((x) => x.priorite === "urgente" && !x.done);
      case "haute": return tasks.filter((x) => x.priorite === "haute" && !x.done);
      case "normales": return tasks.filter((x) => x.priorite === "normale" && !x.done);
      case "terminees": return tasks.filter((x) => x.done);
      case "retard": return tasks.filter((x) => isOverdue(x));
      default: return tasks;
    }
  }, [tasks, filter]);

  // sort: not done first, then by priority, then overdue
  const ordered = useMemo(() => {
    const w = { urgente: 0, haute: 1, normale: 2 };
    return [...visible].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (w[a.priorite] ?? 3) - (w[b.priorite] ?? 3);
    });
  }, [visible]);

  // ---- render ----
  let content;
  if (!user) {
    content = view === "signup" ? (
      <SignupScreen onSignup={signIn} onMicrosoft={signInMicrosoft} goLogin={() => setView("login")} />
    ) : (
      <LoginScreen onLogin={signIn} onMicrosoft={signInMicrosoft} goSignup={() => setView("signup")} />
    );
  } else if (view === "profile") {
    content = (
      <ProfileScreen
        user={user}
        onUpdate={updateProfile}
        onLogout={handleLogout}
        onBack={() => setView("app")}
        onToggleSSO={toggleSSO}
      />
    );
  } else {
    content = (
      <React.Fragment>
        {showReminder && <Reminder onClose={() => setShowReminder(false)} />}
        <div className="page">
          <Masthead user={user} onProfile={() => setView("profile")} onLogout={handleLogout} />
          <Stats tasks={tasks} />
          <TaskForm onAdd={addTask} />

          <div className="section-label">
            <span className="label">Tâches du cabinet</span>
            <span className="rule"></span>
          </div>
          <Filters active={filter} setActive={setFilter} counts={counts} />

          {ordered.length === 0 ? (
            <Empty filter={filter} />
          ) : (
            <div className="tasklist">
              {ordered.map((task) => (
                <TaskItem key={task.id} t={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {content}

      <TweaksPanel>
        <TweakSection label="Identité" />
        <TweakColor label="Couleur principale" value={t.primary}
          options={["#2D5C4E", "#1A3C30", "#3D7A63"]}
          onChange={(v) => setTweak("primary", v)} />
        <TweakToggle label="Grille de fond" value={t.grid}
          onChange={(v) => setTweak("grid", v)} />
        <TweakSection label="Mise en page" />
        <TweakRadio label="Densité" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakRadio label="Champs" value={t.fields}
          options={["outline", "filled"]}
          onChange={(v) => setTweak("fields", v)} />
        <TweakSlider label="Arrondi" value={t.radius} min={0} max={14} unit="px"
          onChange={(v) => setTweak("radius", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
