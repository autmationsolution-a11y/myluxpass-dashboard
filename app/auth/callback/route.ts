The redirect loop you are experiencing on dashboard.myluxpass.com is a classic PKCE handshake failure.

When using the Next.js App Router, the "Magic Link" provides a code that must be exchanged for a session on the server before the browser hits your protected /dashboard route. If the /auth/callback route fails to write the cookies correctly (or uses a different cookie configuration than the Middleware), the Middleware sees an unauthenticated user and kicks them back to /login, creating the loop.

Based on your requirements and the standard @supabase/ssr implementation for Vercel/Edge, here is the architectural fix.

1. The Root Cause Analysis
The Mismatch: Your Middleware likely checks for a session, but the /auth/callback route is failing to "hand off" the session cookies in a way the Edge Runtime can read.

The Proxy Factor: Since you are on a custom domain (dashboard.myluxpass.com), cookie path and domain settings must be standard to ensure the browser accepts them.

The Code Exchange: If /auth/callback doesn't explicitly call exchangeCodeForSession, the user has no session when they land on /dashboard.

2. Implementation: The Correct Files
File 1: utils/supabase/server.ts
This is your "Source of Truth" for server-side auth. It handles the logic of reading/writing cookies.

TypeScript

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can be ignored if middleware is handling the refresh
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This can be ignored
          }
        },
      },
    }
  )
}
File 2: app/auth/callback/route.ts
This is the most critical file. It exchanges the code and ensures the response headers include the new session cookies.

TypeScript

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // "next" allows you to redirect to a specific page after login
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // The createClient handles cookie setting via the 'cookies' utility
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error, redirect to a login page with an error state
  return NextResponse.redirect(`${origin}/login?message=Could not verify auth link`)
}
File 3: middleware.ts (The Auth Guard)
This must refresh the session on every request to ensure the user stays logged in.

TypeScript

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Guard Logic
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isLoginPage = request.nextUrl.pathname === '/login'

  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
3. Verification Checklist
Supabase Dashboard Settings: * Navigate to Authentication > URL Configuration.

Site URL: https://dashboard.myluxpass.com

Redirect URLs: Add https://dashboard.myluxpass.com/auth/callback

Login Component: Ensure your signInWithOtp call in app/login/page.tsx looks like this:

TypeScript

await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
})
Cookies: In your browser DevTools (Application Tab), you should see cookies starting with sb-nudvhbngxcophfjqcdgd-auth-token. If these disappear, the middleware.ts is failing to refresh them.

Final Redeploy Steps
Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct in Vercel.

Deploy the 3 files above.

Critical: Clear your browser cookies for dashboard.myluxpass.com before testing the first time to remove any "stuck" malformed sessions.

Would you like me to inspect your specific app/login/page.tsx code to ensure the signInWithOtp parameters match this flow?
