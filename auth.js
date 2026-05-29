import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { createServerSupabase } from "./lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId:     process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId:     process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          // Scopes nécessaires : profil + calendrier Outlook
          scope: "openid profile email offline_access Calendars.ReadWrite",
        },
      },
    }),
  ],
  callbacks: {
    // Stocker le token d'accès Microsoft dans le JWT (pour appeler Graph API)
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken  = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt    = account.expires_at;
      }
      
      // Synchroniser l'utilisateur avec Supabase
      if (user || account) {
        try {
          const supabase = createServerSupabase();
          const email = token.email || user?.email;
          const name = token.name || user?.name;
          
          // Upsert utilisateur dans Supabase
          const { error } = await supabase
            .from('users')
            .upsert(
              {
                email,
                name,
                azure_id: user?.id,
                last_login: new Date().toISOString(),
              },
              { onConflict: 'email' }
            );
          
          if (error) {
            console.error('Erreur sync Supabase:', error);
          }
        } catch (err) {
          console.error('Erreur lors de la synchronisation Supabase:', err);
        }
      }
      
      return token;
    },
    // Exposer le token d'accès dans la session côté client
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
