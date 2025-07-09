// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string;
      email?: string;
      accessToken?: string;
      center?: string;
      resetSenha?: boolean
    };
  }

  interface User {
    center?: string;
    accessToken?: string;
    resetSenha?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    center?: string;
    resetSenha?: boolean
  }
}
