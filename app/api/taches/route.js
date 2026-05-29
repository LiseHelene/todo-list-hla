import { auth }                             from "@/auth";
import { getTaches, createTache, initDB }   from "@/lib/db";
import { creerEvenementOutlook, notifierTeams, setOutlookEventId } from "@/lib/graph";
import { setOutlookEventId as saveEventId } from "@/lib/db";

// Assurer que la table existe au premier appel
let dbPret = false;
async function ensureDB() {
  if (!dbPret) { await initDB(); dbPret = true; }
}

// GET /api/taches — liste toutes les tâches
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  await ensureDB();
  const taches = await getTaches();
  return Response.json(taches);
}

// POST /api/taches — crée une nouvelle tâche
export async function POST(request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  await ensureDB();
  const body = await request.json();
  const { titre, avocat, priorite, deadline, description, email } = body;

  if (!titre?.trim()) return Response.json({ error: "Titre requis" }, { status: 400 });
  if (!avocat)        return Response.json({ error: "Avocat requis" }, { status: 400 });

  // 1. Enregistrer en base de données
  const tache = await createTache({
    titre: titre.trim(),
    avocat,
    priorite: priorite || "normale",
    deadline,
    description,
    email,
    createdBy: session.user?.email,
  });

  // 2. Créer un événement Outlook si deadline présente (en arrière-plan, sans bloquer)
  if (deadline && session.accessToken) {
    creerEvenementOutlook(session.accessToken, { ...tache, deadline })
      .then(eventId => {
        if (eventId) saveEventId(tache.id, eventId);
      })
      .catch(e => console.error("[Outlook] Erreur :", e.message));
  }

  // 3. Notifier Teams si tâche urgente ou haute priorité
  if (["urgente", "haute"].includes(priorite)) {
    notifierTeams(tache).catch(e => console.error("[Teams] Erreur :", e.message));
  }

  return Response.json(tache, { status: 201 });
}
