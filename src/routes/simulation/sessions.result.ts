import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../helpers'

interface ResultParams {
  id: string
}

/**
 * GET /sessions/:id/result
 *
 * Retorna o resultado final calculado para a sessão.
 *
 * Response 200:
 * {
 *   ok: true,
 *   data: {
 *     finished: true,
 *     result: { key, label, description, score }
 *   }
 * }
 *
 * Response 404: sessão não encontrada
 */
export default function sessionsResultRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.get<{ Params: ResultParams }>('/sessions/:id/result', async (request, reply) => {
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
  })
}
