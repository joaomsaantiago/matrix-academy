import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ONLY_PAGES = ["/entrar", "/cadastro"];

/**
 * Renova a sessao do Supabase a cada requisicao e aplica as regras de acesso:
 *  - /membros exige login;
 *  - quem ja esta logado nao precisa ver /entrar nem /cadastro.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Nao coloque codigo entre createServerClient e getClaims.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    // preserva os cookies de sessao renovados
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  if (!isLoggedIn && pathname.startsWith("/membros")) {
    return redirectTo("/entrar");
  }
  if (isLoggedIn && AUTH_ONLY_PAGES.includes(pathname)) {
    return redirectTo("/membros");
  }

  return response;
}
