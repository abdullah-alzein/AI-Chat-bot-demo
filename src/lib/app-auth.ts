import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type AppUser = {
  id: string
  name: string
  email: string
}

function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase URL and anon key must be configured.')
  }

  return { url, key }
}

export async function createSupabaseServerClient() {
  const { url, key } = getSupabaseCredentials()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options)
        }
      },
    },
  })
}

function toAppUser(user: {
  id: string
  email?: string
  user_metadata?: { name?: string }
}): AppUser | null {
  if (!user.email) return null

  return {
    id: user.id,
    name: user.user_metadata?.name || user.email.split('@')[0],
    email: user.email,
  }
}

export const appAuth = {
  async currentUser(): Promise<AppUser | null> {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      if (error.name === 'AuthSessionMissingError') return null
      throw new Error(`Could not verify the current Supabase session: ${error.message}`)
    }

    return data.user ? toAppUser(data.user) : null
  },

  async login(email: string, password: string): Promise<AppUser> {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error || !data.user) {
      throw new Error(error?.message || 'Unable to start a session.')
    }

    const user = toAppUser(data.user)
    if (!user) throw new Error('The Supabase account has no email address.')
    return user
  },

  async register(input: {
    name: string
    email: string
    password: string
    emailRedirectTo: string
  }): Promise<{ user: AppUser; requiresEmailConfirmation: boolean }> {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { name: input.name },
        emailRedirectTo: input.emailRedirectTo,
      },
    })
    if (error || !data.user) {
      throw new Error(error?.message || 'Unable to create account.')
    }

    const user = toAppUser(data.user)
    if (!user) throw new Error('The Supabase account has no email address.')

    return {
      user,
      requiresEmailConfirmation: !data.session,
    }
  },

  async logout() {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(`Could not sign out: ${error.message}`)
  },
}
