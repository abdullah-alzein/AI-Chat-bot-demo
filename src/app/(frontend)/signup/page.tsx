import AuthExperience from "@/components/AuthExperience"
import { appAuth } from "@/lib/app-auth"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  if (await appAuth.currentUser()) redirect("/")
  return <AuthExperience mode="signup" />
}
