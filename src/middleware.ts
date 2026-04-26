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

  const pathname = request.nextUrl.pathname;

  // 1. ROTAS PROTEGIDAS NORMAIS
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/conta') ||
                           pathname.startsWith('/minha-conta')

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. ROTA ADMIN (BLINDAGEM ZERO TRUST)
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // 🛡️ Segurança: Usamos o e-mail do dono em vez de user_metadata
    // Substitua pelo seu e-mail real de administrador
    const adminEmail = process.env.ADMIN_EMAIL;

    if (user.email !== adminEmail) {
      const url = request.nextUrl.clone()
      url.pathname = '/minha-conta' // Redireciona usuários comuns abelhudos
      return NextResponse.redirect(url)
    }
  }

  // 3. BLOQUEIO DE PÁGINAS PÚBLICAS PARA LOGADOS
  // Corrigido de /signup para /cadastro
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/cadastro')
  
  if (user && isAuthRoute) {
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