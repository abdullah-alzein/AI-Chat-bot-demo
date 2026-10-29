import { appAuth, SupabaseAuthError } from '@/lib/app-auth'
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
    const code = error instanceof SupabaseAuthError ? error.code : 'unknown'
    const status = error instanceof SupabaseAuthError ? error.status : undefined
    const knownErrors: Record<string, { error: string; status: number }> = {
      email_exists: {
        error: 'An account with this email already exists. Try signing in instead.',
        status: 409,
      },
      user_already_exists: {
        error: 'An account with this email already exists. Try signing in instead.',
        status: 409,
      },
      over_email_send_rate_limit: {
        error:
          'Too many confirmation emails were requested. Wait a few minutes before trying again.',
        status: 429,
      },
      email_provider_disabled: {
        error:
          'Email sign-up is not enabled for this Supabase project. Check its Auth email-provider settings.',
        status: 503,
      },
      smtp_error: {
        error:
          'Supabase could not send the confirmation email. Configure a working SMTP provider in Supabase Auth settings, then try again.',
        status: 503,
      },
      email_address_invalid: {
        error:
          'Supabase could not send email to this address. Check the address and Supabase email-provider settings.',
        status: 400,
      },
      signup_disabled: {
        error: 'New accounts are disabled in Supabase Auth settings.',
        status: 503,
      },
      weak_password: {
        error: 'Choose a stronger password that meets the password requirements.',
        status: 400,
      },
    }
    const knownError = knownErrors[code]
    if (!knownError && code !== 'unknown') {
      console.error('Supabase signup failed.', { code, status })
    } else if (code === 'unknown') {
      console.error(
        error instanceof Error
          ? `Signup request failed: ${error.message}`
          : 'Signup request failed with an unknown error.',
      )
    }

    const unavailable =
      error instanceof Error && error.message.includes('Supabase URL and anon key')
    return Response.json(
      {
        error:
          knownError?.error ||
          (unavailable
            ? 'Sign-up is temporarily unavailable. Supabase configuration is missing on the server.'
            : 'We couldn’t create your account. Please try again or contact support with the error code.'),
        code,
      },
      {
        status: knownError?.status || (unavailable ? 503 : status && status >= 500 ? 503 : 400),
      },
    )
  }
}
