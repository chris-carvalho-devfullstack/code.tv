import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // O comentário abaixo desativa o erro do ESLint para a próxima linha
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rotas protegidas normais
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                         request.nextUrl.pathname.startsWith('/conta') ||
                         request.nextUrl.pathname.startsWith('/minha-conta')

  // Nova rota Admin
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Redireciona usuários não logados das rotas protegidas normais
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Lógica de proteção exclusiva do ADMIN
  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Verifica se a role no metadata é admin
    if (user.user_metadata?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/minha-conta' // Redireciona se não for admin
      return NextResponse.redirect(url)
    }
  }

  // Impede que usuário logado acesse login/cadastro
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/minha-conta'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}