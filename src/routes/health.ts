import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

const healthResponseSchema = {
  200: {
    description: 'API e banco de dados operacionais',
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ok' },
      timestamp: { type: 'string', format: 'date-time' },
      services: {
        type: 'object',
        properties: {
          database: { type: 'string', example: 'ok' },
        },
      },
    },
  },
  503: {
    description: 'Banco de dados inacessível',
    type: 'object',
    properties: {
      status: { type: 'string', example: 'degraded' },
      timestamp: { type: 'string', format: 'date-time' },
      services: {
        type: 'object',
        properties: {
          database: { type: 'string', example: 'unreachable' },
        },
      },
    },
  },
}

export default async function healthRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      tags: ['Health'],
      summary: 'Verifica o status da API',
      description: 'Retorna o status da API e a conectividade com o banco de dados',
      response: healthResponseSchema,
    },
    handler: async (_req, reply) => {
      const dbOk = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false)

      return reply.status(dbOk ? 200 : 503).send({
        status: dbOk ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: { database: dbOk ? 'ok' : 'unreachable' },
      })
    },
  })
}
