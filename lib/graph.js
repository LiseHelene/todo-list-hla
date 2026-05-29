// Helpers pour Microsoft Graph API (Outlook Calendar + Teams)
const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

// ── OUTLOOK CALENDAR ─────────────────────────────────────────

/**
 * Crée un événement dans le calendrier Outlook de l'utilisateur connecté.
 * Retourne l'ID de l'événement créé (pour pouvoir le supprimer plus tard).
 */
export async function creerEvenementOutlook(accessToken, tache) {
  if (!accessToken || !tache.deadline) return null;

  const body = {
    subject:  `[HLA] ${tache.titre}`,
    body: {
      contentType: "HTML",
      content: `
        <p><strong>Tâche :</strong> ${tache.titre}</p>
        <p><strong>Assignée à :</strong> ${tache.avocat}</p>
        <p><strong>Priorité :</strong> ${tache.priorite}</p>
        ${tache.description ? `<p><strong>Description :</strong> ${tache.description}</p>` : ""}
        <p><em>Créé depuis le gestionnaire de tâches Huglo Lepage Avocats</em></p>
      `,
    },
    start: { dateTime: `${tache.deadline}T09:00:00`, timeZone: "Europe/Paris" },
    end:   { dateTime: `${tache.deadline}T10:00:00`, timeZone: "Europe/Paris" },
    reminderMinutesBeforeStart: 60,
    isReminderOn: true,
    categories: ["Huglo Lepage"],
  };

  const res = await fetch(`${GRAPH_BASE}/me/events`, {
    method:  "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("[Graph] Erreur création événement :", await res.text());
    return null;
  }

  const data = await res.json();
  return data.id;
}

/**
 * Supprime un événement Outlook par son ID.
 */
export async function supprimerEvenementOutlook(accessToken, eventId) {
  if (!accessToken || !eventId) return;

  await fetch(`${GRAPH_BASE}/me/events/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * Récupère les événements Outlook des 30 prochains jours.
 */
export async function getEvenementsOutlook(accessToken) {
  if (!accessToken) return [];

  const now   = new Date().toISOString();
  const dans30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const res = await fetch(
    `${GRAPH_BASE}/me/calendarView?startDateTime=${now}&endDateTime=${dans30}&$select=id,subject,start,end,bodyPreview&$orderby=start/dateTime&$top=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.value || [];
}

// ── TEAMS ────────────────────────────────────────────────────

/**
 * Envoie une notification Teams via un webhook entrant (Incoming Webhook).
 * TEAMS_WEBHOOK_URL doit être configuré dans les variables d'environnement.
 */
export async function notifierTeams(tache) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (!webhookUrl) return;

  const couleur = { urgente: "FF0000", haute: "E67E22", normale: "2D4A3E" }[tache.priorite] || "2D4A3E";
  const deadline = tache.deadline
    ? new Date(tache.deadline).toLocaleDateString("fr-FR")
    : "Non définie";

  // Adaptive Card Teams
  const payload = {
    type: "message",
    attachments: [{
      contentType: "application/vnd.microsoft.card.adaptive",
      content: {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
          {
            type: "TextBlock",
            text: "📋 Nouvelle tâche assignée",
            weight: "Bolder",
            size: "Medium",
            color: "Accent",
          },
          {
            type: "FactSet",
            facts: [
              { title: "Tâche",    value: tache.titre },
              { title: "Assignée à", value: tache.avocat },
              { title: "Priorité",  value: tache.priorite.toUpperCase() },
              { title: "Deadline",  value: deadline },
            ],
          },
          ...(tache.description ? [{
            type: "TextBlock",
            text: tache.description,
            wrap: true,
            isSubtle: true,
          }] : []),
        ],
        msteams: { width: "Full" },
      },
    }],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("[Teams] Erreur webhook :", e.message);
  }
}
