import { auth }                  from "@/auth";
import { getEvenementsOutlook }  from "@/lib/graph";
import { createTache, initDB }   from "@/lib/db";

// GET /api/microsoft/calendar — récupérer les événements Outlook des 30 prochains jours
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });
  if (!session.accessToken) return Response.json({ error: "Token Microsoft manquant" }, { status: 403 });

  const evenements = await getEvenementsOutlook(session.accessToken);
  return Response.json(evenements);
}

// POST /api/microsoft/calendar — importer un événement Outlook comme tâche
export async function POST(request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  await initDB();
  const { subject, start, bodyPreview, outlookId } = await request.json();

  const deadline = start?.dateTime ? start.dateTime.split("T")[0] : null;

  const tache = await createTache({
    titre:       subject || "Événement importé",
    avocat:      session.user?.name || "Non assigné",
    priorite:    "normale",
    deadline,
    description: bodyPreview || "",
    email:       session.user?.email || "",
    createdBy:   session.user?.email,
  });

  return Response.json(tache, { status: 201 });
}
