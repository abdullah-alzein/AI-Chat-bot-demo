import LumaApp from "@/components/LumaApp"
import { appAuth } from "@/lib/app-auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const user = await appAuth.currentUser()
  if (!user) redirect("/login")
  return <LumaApp user={user} />
}
