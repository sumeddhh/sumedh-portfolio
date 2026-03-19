import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { handler as chatHandler } from "./netlify/functions/chat"

function netlifyFunctionsDevMiddleware(): Plugin {
  return {
    name: "netlify-functions-dev-middleware",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/.netlify/functions/chat", async (req, res) => {
        try {
          const chunks: Uint8Array[] = []
          for await (const chunk of req) {
            if (typeof chunk === "string") {
              chunks.push(Buffer.from(chunk))
            } else {
              chunks.push(chunk)
            }
          }

          const body = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString("utf8")
          const result = await chatHandler({
            httpMethod: req.method,
            body: body || undefined,
          })

          res.statusCode = result.statusCode ?? 200
          const headers = result.headers ?? { "Content-Type": "application/json" }
          Object.entries(headers).forEach(([key, value]) => {
            if (value !== undefined) {
              res.setHeader(key, value)
            }
          })
          res.end(result.body ?? "")
        } catch (error) {
          console.error("Local chat middleware error:", error)
          res.statusCode = 500
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ error: "Local middleware error" }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  // Make server-side middleware able to read local .env values.
  process.env.GROQ_API_KEY ??= env.GROQ_API_KEY ?? env.VITE_GROQ_API_KEY
  process.env.TAVILY_API_KEY ??= env.TAVILY_API_KEY ?? env.VITE_TAVILY_KEY

  return {
    base: './',
    plugins: [netlifyFunctionsDevMiddleware(), inspectAttr(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
