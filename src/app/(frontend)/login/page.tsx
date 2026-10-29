import AuthExperience from '@/components/AuthExperience'
import { appAuth } from '@/lib/app-auth'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmation?: string }>
}) {
  if (await appAuth.currentUser()) redirect('/')
  const { confirmation } = await searchParams
  return (
    <AuthExperience
      mode="login"
      initialError={
        confirmation === 'failed'
          ? 'We couldn’t confirm your email. Please request a new confirmation email and try again.'
          : ''
      }
    />
  )
}
