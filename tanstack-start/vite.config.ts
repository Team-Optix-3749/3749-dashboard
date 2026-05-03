import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, rootDir, ''))

  const port = Number(process.env.VITE_DEV_SERVER_PORT ?? 3000)
  const host = process.env.VITE_DEV_SERVER_HOST ?? 'localhost'
  const hmrHost =
    process.env.VITE_DEV_HMR_HOST ??
    (host === 'true' || host === 'all' ? 'localhost' : host)

  return {
    root: rootDir,
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port,
      strictPort: true,
      host: host === 'all' ? true : host === 'true' ? true : host,
      watch:
        process.env.VITE_WATCH_POLLING === '1'
          ? { usePolling: true, interval: 300 }
          : undefined,
      hmr: {
        protocol: 'ws',
        host: hmrHost,
        port,
        clientPort: Number(process.env.VITE_DEV_HMR_CLIENT_PORT ?? port),
      },
    },
    plugins: [
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})
