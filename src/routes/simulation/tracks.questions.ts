import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../helpers'

interface QuestionParams {
  trackId: string
  questionId: string
}

/**
 * GET /tracks/:trackId/questions/:questionId
 *
 * Retorna uma pergunta específica da track.
 *
 * Response 200:
 * {
 *   ok: true,
 *   data: {
 *     id,
 *     text,
 *     options
 *   }
 * }
 *
 * Response 404:
 * Track ou pergunta não encontrada.
 */
export default function trackQuestionsRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.get<{ Params: QuestionParams }>(
    '/tracks/:trackId/questions/:questionId',
    async (request, reply) => {
      const { trackId, questionId } = request.params

      try {
        const question = engine.findTrackQuestion(trackId, questionId)

        return sendSuccess(reply, question)
      } catch (err) {
        const message = (err as Error).message

        if (message.includes('não encontrada')) {
          return sendError(reply, message, 404)
        }

        return sendError(reply, message, 500)
      }
    },
  )
}
