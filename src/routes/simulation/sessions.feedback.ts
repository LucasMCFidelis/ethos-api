import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../helpers'
import type { FeedbackBody } from '../../engine/types'

interface FeedbackParams {
  id: string
}

/**
 * POST /sessions/:id/feedback
 *
 * Registra o feedback da simulação.
 *
 * Body:
 * {
 *   "rate": number,
 *   "useObjective": string,
 *   "suggestion"?: string
 * }
 *
 * Response 200:
 * { ok: true, data: Feedback }
 *
 * Response 400: body inválido
 * Response 404: sessão não encontrada
 */
export default function sessionsFeedbackRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.post<{ Params: FeedbackParams; Body: FeedbackBody }>(
    '/sessions/:id/feedback',
    async (request, reply) => {
      const sessionId = request.params.id
      const { rate, useObjective, suggestion } = request.body ?? {}

      if (typeof rate !== 'number' || rate < 1 || rate > 5) {
        return sendError(reply, 'Campo "rate" é obrigatório e deve ser um número entre 1 e 5.')
      }

      if (!useObjective || typeof useObjective !== 'string') {
        return sendError(reply, 'Campo "useObjective" é obrigatório e deve ser string.')
      }

      try {
        const feedback = await engine.sendFeedback({
          sessionId,
          feedback: { rate, useObjective, suggestion },
        })

        sendSuccess(reply, feedback)
      } catch (err) {
        const message = (err as Error).message

        if (message.includes('não encontrada')) {
          return sendError(reply, `Sessão "${sessionId}" não encontrada.`, 404)
        }

        sendError(reply, message, 500)
      }
    },
  )
}
