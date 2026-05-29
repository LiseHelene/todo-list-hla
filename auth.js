import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

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
    async jwt({ token, account }) {
      if (account) {
        token.accessToken  = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt    = account.expires_at;
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
