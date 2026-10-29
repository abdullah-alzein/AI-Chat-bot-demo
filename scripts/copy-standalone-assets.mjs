import { cp, mkdir } from "node:fs/promises"
import path from "node:path"

const standaloneDirectory = path.resolve(".next", "standalone")
const staticDirectory = path.resolve(".next", "static")
const standaloneStaticDirectory = path.join(standaloneDirectory, ".next", "static")

await mkdir(path.dirname(standaloneStaticDirectory), { recursive: true })
await cp(staticDirectory, standaloneStaticDirectory, {
  recursive: true,
  force: true,
})

console.log("Copied Next.js static assets into the standalone output.")
