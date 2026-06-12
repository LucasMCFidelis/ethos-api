import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

const INTERVAL_MS = 12 * 60 * 1000

async function keepAlivePlugin(app: FastifyInstance) {
  if (process.env.NODE_ENV !== 'production') return

  const healthUrl = process.env.API_HEALTH_URL || 'http://localhost:3000/api/v1/health'

  const ping = async () => {
    try {
      const res = await fetch(healthUrl)
      app.log.info({ status: res.status }, '[keep-alive] ping OK')
    } catch (err) {
      app.log.warn({ err }, '[keep-alive] ping falhou')
    }
  }

  app.addHook('onReady', () => {
    setInterval(ping, INTERVAL_MS)
  })
}

export default fp(keepAlivePlugin, { name: 'keep-alive' })
