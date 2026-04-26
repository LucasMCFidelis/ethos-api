import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../../helpers'
import { sessionsResultSchema } from './schemas/sessions.result.schema'

interface ResultParams {
  id: string
}

export default function sessionsResultRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.get<{ Params: ResultParams }>('/sessions/:id/result', {
    schema: sessionsResultSchema,
    handler: async (request, reply) => {
      const sessionId = request.params.id

      try {
        const result = await engine.getResult(sessionId)
        sendSuccess(reply, result)
      } catch (err) {
        const message = (err as Error).message

        if (message.includes('não encontrada')) {
          return sendError(reply, `Sessão "${sessionId}" não encontrada.`, 404)
        }

        sendError(reply, message, 500)
      }
    },
  })
}
