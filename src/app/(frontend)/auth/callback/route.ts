import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/app-auth'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?confirmation=failed', requestUrl))
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('Supabase email confirmation failed.', error)
    return NextResponse.redirect(new URL('/login?confirmation=failed', requestUrl))
  }

  return NextResponse.redirect(new URL('/', requestUrl))
}
