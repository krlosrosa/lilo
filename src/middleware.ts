// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas (não requerem autenticação)
const PUBLIC_ROUTES = ["/login"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Se a rota for pública, permita o acesso
  if (PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next();
  }

  // Verifica a sessão do usuário
  const session = await auth();

  // Se não houver sessão (usuário não logado), redirecione para /login
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if(session?.user?.resetSenha && path !== "/reset") {
    return NextResponse.redirect(new URL("/reset", request.url));
  }

  // Se estiver autenticado, permita o acesso
  return NextResponse.next();
}

// Configuração para evitar middleware em arquivos estáticos e rotas da API
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};