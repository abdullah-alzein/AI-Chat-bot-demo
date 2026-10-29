import { appAuth } from '@/lib/app-auth'

export async function POST() {
  try {
    await appAuth.logout()
    return Response.json({ success: true })
  } catch (error) {
    console.error('Supabase sign-out failed.', error)
    return Response.json({ error: 'Could not sign out. Please try again.' }, { status: 500 })
  }
}
