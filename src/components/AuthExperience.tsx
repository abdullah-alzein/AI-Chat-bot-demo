'use client'

import Link from 'next/link'
import { FormEvent, ReactNode, useState } from 'react'

type Mode = 'login' | 'signup'

const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const SparkleIcon = () => (
  <Icon>
    <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3Z" />
    <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
  </Icon>
)

export default function AuthExperience({
  mode,
  initialError = '',
}: {
  mode: Mode
  initialError?: string
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(initialError)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignup = mode === 'signup'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')

    const form = new FormData(event.currentTarget)
    if (isSignup && form.get('password') !== form.get('confirmPassword')) {
      setError('Those passwords don’t match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/app-auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          name: form.get('name'),
          password: form.get('password'),
        }),
      })
      const result = (await response.json()) as {
        error?: string
        requiresEmailConfirmation?: boolean
      }

      if (!response.ok) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (isSignup && result.requiresEmailConfirmation) {
        setNotice(
          'Account created. Check your email and follow the confirmation link before signing in.',
        )
        event.currentTarget.reset()
        return
      }

      window.location.replace('/')
    } catch {
      setError('We couldn’t reach Luma. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#171817] selection:bg-[#d8f43c] selection:text-black">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden border-r border-black/[0.06] bg-[#1b1c1a] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="auth-orb auth-orb-one" />
          <div className="auth-orb auth-orb-two" />
          <Link className="relative z-10 flex w-fit items-center gap-2.5" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d8f43c] text-[#171817]">
              <SparkleIcon />
            </span>
            <span className="text-[20px] font-semibold tracking-[-0.04em]">Luma</span>
          </Link>

          <div className="relative z-10 max-w-[560px]">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8f43c]">
              Your space to think
            </p>
            <h1 className="text-[56px] font-semibold leading-[1.02] tracking-[-0.06em]">
              Ideas move faster
              <span className="block text-white/35">when everything clicks.</span>
            </h1>
            <p className="mt-7 max-w-md text-[16px] leading-relaxed text-white/50">
              Ask questions, shape your thinking, and create something new with an AI workspace
              designed to stay out of your way.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-[12px] text-white/35">
            <span className="h-px w-8 bg-white/20" />
            Thoughtful answers, beautifully simple
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[430px]">
            <Link className="mb-12 flex w-fit items-center gap-2.5 lg:hidden" href="/">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#171817] text-[#d8f43c]">
                <SparkleIcon />
              </span>
              <span className="text-[20px] font-semibold tracking-[-0.04em]">Luma</span>
            </Link>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-black/35">
                {isSignup ? 'Start creating' : 'Welcome back'}
              </p>
              <h2 className="text-[38px] font-semibold leading-tight tracking-[-0.05em]">
                {isSignup ? 'Create your account' : 'Sign in to Luma'}
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-black/45">
                {isSignup
                  ? 'A calmer, more focused way to turn questions into progress.'
                  : 'Continue your conversations and pick up where you left off.'}
              </p>
            </div>

            <form className="mt-9 space-y-5" onSubmit={submit}>
              {isSignup && (
                <label className="block">
                  <span className="mb-2 block text-[12px] font-semibold">Name</span>
                  <input
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-black/[0.09] bg-white/70 px-3.5 text-[14px] outline-none transition placeholder:text-black/25 focus:border-black/25 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                    name="name"
                    placeholder="Alex Morgan"
                    required
                    minLength={2}
                    maxLength={80}
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold">Email address</span>
                <input
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-black/[0.09] bg-white/70 px-3.5 text-[14px] outline-none transition placeholder:text-black/25 focus:border-black/25 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </label>

              {isSignup && (
                <label className="block">
                  <span className="mb-2 block text-[12px] font-semibold">Confirm password</span>
                  <input
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-black/[0.09] bg-white/70 px-3.5 text-[14px] outline-none transition placeholder:text-black/25 focus:border-black/25 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                    minLength={8}
                    name="confirmPassword"
                    placeholder="Enter it once more"
                    required
                    type={showPassword ? 'text' : 'password'}
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-[12px] font-semibold">
                  Password
                  {!isSignup && <span className="font-normal text-black/30">8+ characters</span>}
                </span>
                <span className="relative block">
                  <input
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    className="h-12 w-full rounded-xl border border-black/[0.09] bg-white/70 px-3.5 pr-16 text-[14px] outline-none transition placeholder:text-black/25 focus:border-black/25 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                    minLength={8}
                    name="password"
                    placeholder="Enter your password"
                    required
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    className="absolute inset-y-0 right-0 px-3.5 text-[11px] font-semibold text-black/40 hover:text-black"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </span>
              </label>

              {error && (
                <div
                  aria-live="polite"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[12px] leading-relaxed text-rose-700"
                >
                  {error}
                </div>
              )}
              {notice && (
                <div
                  aria-live="polite"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[12px] leading-relaxed text-emerald-800"
                >
                  {notice}
                </div>
              )}

              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#171817] text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,.12)] transition hover:-translate-y-0.5 hover:bg-black disabled:translate-y-0 disabled:cursor-wait disabled:opacity-55"
                disabled={loading}
                type="submit"
              >
                {loading && <span className="auth-spinner" />}
                {loading
                  ? isSignup
                    ? 'Creating your account…'
                    : 'Signing you in…'
                  : isSignup
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>

            <p className="mt-7 text-center text-[13px] text-black/45">
              {isSignup ? 'Already have an account?' : 'New to Luma?'}{' '}
              <Link
                className="font-semibold text-black underline decoration-black/20 underline-offset-4 hover:decoration-black"
                href={isSignup ? '/login' : '/signup'}
              >
                {isSignup ? 'Sign in' : 'Create an account'}
              </Link>
            </p>

            <p className="mt-10 border-t border-black/[0.07] pt-6 text-center text-[10px] leading-relaxed text-black/30">
              By continuing, you agree to use Luma responsibly and acknowledge that AI-generated
              responses may require verification.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
