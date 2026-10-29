import { appAuth } from '@/lib/app-auth'
import { validateAuthInput } from '@/lib/auth-validation'

export async function POST(request: Request) {
  try {
    const validation = validateAuthInput(await request.json(), 'login')
    if (!validation.data) {
      return Response.json({ error: validation.error }, { status: 400 })
    }

    const user = await appAuth.login(validation.data.email, validation.data.password)
    return Response.json({ user })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Supabase URL')) {
      console.error('Supabase sign-in configuration is incomplete.')
      return Response.json(
        { error: 'Sign-in is temporarily unavailable. Please try again later.' },
        { status: 503 },
      )
    }
    return Response.json({ error: 'That email or password isn’t quite right.' }, { status: 401 })
  }
}
