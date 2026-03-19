import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function healthRoutes(app: FastifyInstance) {
  app.get('/', async (_req, reply) => {
    const dbOk = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false)

    return reply.status(dbOk ? 200 : 503).send({
      status: dbOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: { database: dbOk ? 'ok' : 'unreachable' },
    })
  })
}
