import { auth }                                    from "@/auth";
import { toggleTache, deleteTache }                from "@/lib/db";
import { supprimerEvenementOutlook }               from "@/lib/graph";

// PATCH /api/taches/[id] — marquer terminée / non terminée
export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { terminee } = await request.json();
  const tache = await toggleTache(Number(params.id), terminee);
  return Response.json(tache);
}

// DELETE /api/taches/[id] — supprimer une tâche
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const tache = await deleteTache(Number(params.id));

  // Supprimer l'événement Outlook associé si présent
  if (tache?.outlook_event_id && session.accessToken) {
    supprimerEvenementOutlook(session.accessToken, tache.outlook_event_id)
      .catch(e => console.error("[Outlook] Erreur suppression :", e.message));
  }

  return Response.json({ ok: true });
}
