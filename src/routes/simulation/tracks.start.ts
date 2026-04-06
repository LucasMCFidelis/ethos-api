import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../helpers'

interface StartParams {
  id: string
}

/**
 * GET /tracks/:id/start
 *
 * Inicia uma nova sessão e retorna a primeira pergunta.
 *
 * Response 201:
 * {
 *   ok: true,
 *   data: {
 *     sessionId: "uuid",
 *     question: { id: "q1", text: "...", options: ["sim","nao","talvez"] }
 *   }
 * }
 *
 * Response 404: trilha não encontrada
 */
export default function tracksStartRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.get<{ Params: StartParams }>('/tracks/:id/start', async (request, reply) => {
    const { id } = request.params

    try {
      const { sessionId, question } = engine.start(id)
      sendSuccess(reply, { sessionId, question }, 201)
    } catch (err) {
      const message = (err as Error).message

      if (message.includes('não encontrado')) {
        return sendError(reply, `Trilha "${id}" não encontrada.`, 404)
      }

      sendError(reply, message, 500)
    }
  })
}
