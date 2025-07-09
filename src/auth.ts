import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(process.env.URL_LOGIN as string, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          
          if (!res.ok) return null;

          const user = await res.json();

          if (user?.accessToken) {
            return {
              id: user.id || user.email || "user",
              name: user.name,
              center: user.center,
              accessToken: user.accessToken,
              resetSenha: user.resetSenha
            };
          }

          return null;
        } catch (err) {
          console.error("Erro ao autenticar:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 8 horas em segundos
    updateAge: 30 * 60, // Atualiza a sessão a cada 30 minutos se o usuário estiver ativo
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.center = user.center;
        token.resetSenha = user.resetSenha
      }
      return token;
    },

    async session({ session, token }) {
      const typedToken = token as {
        accessToken?: string;
        name?: string;
        center?: string;
        resetSenha?: boolean
      };

      session.user.accessToken = typedToken.accessToken;
      session.user.name = typedToken.name;
      session.user.center = typedToken.center;
      session.user.resetSenha = typedToken.resetSenha

      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl; // redireciona para página inicial ("/")
    },
  },

  pages: {
    signIn: "/login",
  },
});
