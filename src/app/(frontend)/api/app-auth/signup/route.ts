import { appAuth } from '@/lib/app-auth'
import { validateAuthInput } from '@/lib/auth-validation'

export async function POST(request: Request) {
  try {
    const validation = validateAuthInput(await request.json(), 'signup')
    if (!validation.data || !validation.data.name) {
      return Response.json({ error: validation.error }, { status: 400 })
    }

    const result = await appAuth.register({
      email: validation.data.email,
      name: validation.data.name,
      password: validation.data.password,
      emailRedirectTo: new URL('/auth/callback', request.url).toString(),
    })
    return Response.json(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    const duplicate =
      message.includes('already registered') ||
      message.includes('already exists') ||
      message.includes('user_already_exists')
    const unavailable = message.includes('supabase url and anon key')
    if (!duplicate && !unavailable) {
      console.error('Supabase account creation failed.', error)
    }
    return Response.json(
      {
        error: duplicate
          ? 'An account with this email already exists.'
          : unavailable
            ? 'Sign-up is temporarily unavailable. Please try again later.'
            : 'We couldn’t create your account. Check your details and try again.',
      },
      { status: duplicate ? 409 : unavailable ? 503 : 400 },
    )
  }
}
