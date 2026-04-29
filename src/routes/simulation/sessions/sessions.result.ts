import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess } from '../../helpers'
import { sessionsResultSchema } from './schemas/sessions.result.schema'
import { handleError } from '../../../errors/handleError'

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
        handleError(reply, err)
      }
    },
  })
}
