export type AuthInput = {
  email: string
  name?: string
  password: string
}

export function validateAuthInput(
  value: unknown,
  mode: "login" | "signup",
): { data?: AuthInput; error?: string } {
  if (!value || typeof value !== "object") {
    return { error: "Please complete all required fields." }
  }

  const body = value as Record<string, unknown>
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body.password === "string" ? body.password : ""
  const name = typeof body.name === "string" ? body.name.trim() : ""

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." }
  }

  if (mode === "signup" && (name.length < 2 || name.length > 80)) {
    return { error: "Enter your name using 2–80 characters." }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }

  return { data: { email, name: mode === "signup" ? name : undefined, password } }
}
