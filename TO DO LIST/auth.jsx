const { useState: useStateA, useMemo: useMemoA } = React;

// ---- shared helpers ----
function initialsOf(name) {
  if (!name) return "?";
  const parts = name.replace(/^Me\s+/i, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ROLES = [
  "Avocat associé",
  "Avocate associée",
  "Avocat collaborateur",
  "Avocate collaboratrice",
  "Juriste",
  "Assistant(e) juridique",
];

// ---- Microsoft logo (third-party SSO provider mark) ----
function MicrosoftLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function AuthLogoBlock() {
  return (
    <div className="auth-top">
      <div className="corner-hatch hatch-light"></div>
      <div className="corner-block"></div>
      <div className="auth-logo-wrap">
        <image-slot id="hl-logo" style={{ width: "44px", height: "44px" }} shape="rect" fit="contain" placeholder="Logo"></image-slot>
      </div>
      <div>
        <div className="firm">Cabinet Huglo&nbsp;Lepage</div>
        <div className="sub">Gestionnaire de tâches</div>
      </div>
    </div>
  );
}

// ---------------- Login ----------------
function LoginScreen({ onLogin, onMicrosoft, goSignup }) {
  const [email, setEmail] = useStateA("");
  const [pwd, setPwd] = useStateA("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onLogin({ email: email.trim() });
  };

  return (
    <div className="auth-stage">
      <div className="auth-card">
        <AuthLogoBlock />
        <div className="auth-body">
          <div className="auth-title">Connexion</div>
          <div className="auth-lead">Accédez à l'espace de suivi des dossiers et des tâches du cabinet.</div>

          <button type="button" className="ms-btn" onClick={onMicrosoft}>
            <MicrosoftLogo /> Se connecter avec Microsoft
          </button>

          <div className="divider">ou avec votre e-mail</div>

          <form className="auth-form" onSubmit={submit}>
            <div className="field">
              <label>Adresse e-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom.nom@huglo-lepage.fr" />
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="forgot"><button type="button" className="text-link">Mot de passe oublié ?</button></div>
            <button type="submit" className="btn-primary btn-block">Se connecter</button>
          </form>

          <div className="auth-switch">
            Pas encore de compte ? <button className="text-link" onClick={goSignup}>Créer un compte</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Signup ----------------
function SignupScreen({ onSignup, onMicrosoft, goLogin }) {
  const [form, setForm] = useStateA({ name: "", email: "", role: "", pwd: "" });
  const [accept, setAccept] = useStateA(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !accept) return;
    onSignup({ name: form.name.trim(), email: form.email.trim(), role: form.role || "Collaborateur" });
  };

  return (
    <div className="auth-stage">
      <div className="auth-card">
        <AuthLogoBlock />
        <div className="auth-body">
          <div className="auth-title">Créer un compte</div>
          <div className="auth-lead">Rejoignez l'espace collaboratif du cabinet Huglo&nbsp;Lepage Avocats.</div>

          <button type="button" className="ms-btn" onClick={onMicrosoft}>
            <MicrosoftLogo /> S'inscrire avec Microsoft
          </button>

          <div className="divider">ou renseignez vos informations</div>

          <form className="auth-form" onSubmit={submit}>
            <div className="field">
              <label>Nom complet</label>
              <input value={form.name} onChange={set("name")} placeholder="Ex : Me Camille Renard" />
            </div>
            <div className="field">
              <label>Adresse e-mail professionnelle</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="prenom.nom@huglo-lepage.fr" />
            </div>
            <div className="field">
              <label>Fonction</label>
              <select value={form.role} onChange={set("role")}>
                <option value="">— Sélectionner une fonction —</option>
                {ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
              </select>
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <input type="password" value={form.pwd} onChange={set("pwd")} placeholder="8 caractères minimum" />
            </div>
            <label className="check-row">
              <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
              <span>J'accepte la charte d'usage interne et la politique de confidentialité du cabinet.</span>
            </label>
            <button type="submit" className="btn-primary btn-block">Créer mon compte</button>
          </form>

          <div className="auth-switch">
            Déjà un compte ? <button className="text-link" onClick={goLogin}>Se connecter</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- User menu (masthead) ----------------
function IconUser() { return (<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.2" r="2.6" stroke="currentColor" strokeWidth="1.4" /><path d="M3 13.2c0-2.4 2.2-3.8 5-3.8s5 1.4 5 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function IconGear() { return (<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" /><path d="M8 1.5v1.7M8 12.8v1.7M14.5 8h-1.7M3.2 8H1.5M12.6 3.4l-1.2 1.2M4.6 11.4l-1.2 1.2M12.6 12.6l-1.2-1.2M4.6 4.6L3.4 3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function IconLogout() { return (<svg viewBox="0 0 16 16" fill="none"><path d="M10 3.2H4.2c-.6 0-1 .4-1 1v7.6c0 .6.4 1 1 1H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M7.8 8h6M11.6 5.6L14 8l-2.4 2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function IconChevron() { return (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="chev"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>); }

function UserMenu({ user, onProfile, onLogout }) {
  const [open, setOpen] = useStateA(false);
  const firstName = (user.name || user.email).replace(/^Me\s+/i, "").split(/\s+/)[0];
  return (
    <div className="user-menu" onMouseLeave={() => setOpen(false)}>
      <button className="user-btn" onClick={() => setOpen((o) => !o)}>
        <span className="avatar">{initialsOf(user.name || user.email)}</span>
        <span className="uname">{firstName}</span>
        <IconChevron />
      </button>
      {open && (
        <div className="menu-dropdown">
          <div className="menu-head">
            <div className="mn">{user.name || "Compte"}</div>
            <div className="me">{user.email}</div>
          </div>
          <button className="menu-item" onClick={() => { setOpen(false); onProfile(); }}><IconUser /> Mon profil</button>
          <button className="menu-item" onClick={() => { setOpen(false); onProfile(); }}><IconGear /> Gérer le compte</button>
          <button className="menu-item danger" onClick={onLogout}><IconLogout /> Se déconnecter</button>
        </div>
      )}
    </div>
  );
}

// ---------------- Profile / manage ----------------
function ProfileScreen({ user, onUpdate, onLogout, onBack, onToggleSSO }) {
  const [name, setName] = useStateA(user.name || "");
  const [role, setRole] = useStateA(user.role || "");
  const [saved, setSaved] = useStateA(false);

  const save = (e) => {
    e.preventDefault();
    onUpdate({ name: name.trim() || user.name, role });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="page">
      <div className="profile-topbar">
        <button className="back-link" onClick={onBack}>
          <svg viewBox="0 0 16 16" fill="none"><path d="M10 3.5L5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Retour aux tâches
        </button>
        <span className="label">Profil &amp; compte</span>
      </div>

      <section className="profile-hero">
        <div className="corner-hatch hatch-light"></div>
        <div className="corner-block"></div>
        <div className="big-avatar">{initialsOf(user.name || user.email)}</div>
        <div>
          <div className="ph-name">{user.name || "Utilisateur"}</div>
          <div className="ph-mail">{user.email}</div>
          <span className="role-badge">{user.role || "Collaborateur"}</span>
        </div>
      </section>

      {/* Informations personnelles */}
      <section className="panel">
        <div className="panel-head">
          <span className="sq"></span>
          <span className="label">Informations personnelles</span>
          <span className="rule"></span>
        </div>
        <form className="form-grid" onSubmit={save}>
          <div className="field">
            <label>Nom complet</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
          </div>
          <div className="field">
            <label>Fonction</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">— Sélectionner —</option>
              {ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>
          <div className="field full">
            <label>Adresse e-mail</label>
            <input value={user.email} disabled style={{ background: "#F1ECE2", color: "var(--muted)", cursor: "not-allowed" }} />
          </div>
          <div className="form-actions">
            <div className="save-bar">
              <button type="submit" className="btn-primary">Enregistrer les modifications</button>
              {saved && <span className="saved-note">✓ Modifications enregistrées</span>}
            </div>
          </div>
        </form>
      </section>

      {/* Connexion & sécurité */}
      <section className="panel">
        <div className="panel-head">
          <span className="sq"></span>
          <span className="label">Connexion &amp; sécurité</span>
          <span className="rule"></span>
        </div>

        <div className="kv-row sso-row">
          <div className="sso-info">
            <div className="sso-tile"><MicrosoftLogo size={22} /></div>
            <div className="sso-txt">
              <div className="t1">Microsoft 365</div>
              {user.sso ? (
                <div className="sso-status on"><span className="sdot"></span>Connecté — {user.email}</div>
              ) : (
                <div className="sso-status off"><span className="sdot"></span>Non connecté</div>
              )}
            </div>
          </div>
          <button className={"btn-outline" + (user.sso ? " danger" : "")} onClick={onToggleSSO}>
            {user.sso ? "Déconnecter" : "Connecter"}
          </button>
        </div>

        <div className="kv-row">
          <div className="sso-info">
            <div className="sso-tile">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="1.2" stroke="var(--green)" strokeWidth="1.5" /><path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke="var(--green)" strokeWidth="1.5" /></svg>
            </div>
            <div className="sso-txt">
              <div className="t1">Mot de passe</div>
              <div className="t2">Dernière modification il y a 3 mois</div>
            </div>
          </div>
          <button className="btn-outline">Modifier</button>
        </div>

        <div className="kv-row">
          <div className="sso-info">
            <div className="sso-tile">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5l5.5 2v4c0 3.4-2.3 6.4-5.5 7.5C6.8 14.9 4.5 11.9 4.5 8.5v-4l5.5-2z" stroke="var(--green)" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7.7 9.8l1.6 1.6 3-3.4" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="sso-txt">
              <div className="t1">Double authentification</div>
              <div className="t2">Gérée par Microsoft 365</div>
            </div>
          </div>
          <span className="sso-status on" style={{ marginTop: 0 }}><span className="sdot"></span>Active</span>
        </div>

        <div className="profile-actions">
          <button className="btn-outline danger" onClick={onLogout}>Se déconnecter</button>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { LoginScreen, SignupScreen, ProfileScreen, UserMenu, initialsOf });
