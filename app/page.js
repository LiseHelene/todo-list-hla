import { auth }       from "@/auth";
import LoginPage      from "@/components/LoginPage";
import TodoApp        from "@/components/TodoApp";

export default async function Page() {
  const session = await auth();

  // Pas connecté → page de connexion
  if (!session) return <LoginPage />;

  // Connecté → application
  return <TodoApp session={session} />;
}
