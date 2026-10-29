import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const nextCli = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url))
const port = process.env.PORT || '3000'
const child = spawn(process.execPath, [nextCli, 'dev', '--port', port, '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  env: process.env,
})

child.on('error', (error) => {
  console.error('Could not start the Next.js development server.', error)
  process.exitCode = 1
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exitCode = code ?? 1
})
