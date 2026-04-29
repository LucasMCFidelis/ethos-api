import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess } from '../../helpers'
import type { FeedbackBody } from '../../../engine/types'
import { sessionFeedbackSchema } from './schemas/sessions.feedback.schema'
import { handleError } from '../../../errors/handleError'
import { BadRequestError } from '../../../errors/httpErrors'

interface FeedbackParams {
  id: string
}

export default function sessionsFeedbackRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.post<{ Params: FeedbackParams; Body: FeedbackBody }>('/sessions/:id/feedback', {
    schema: sessionFeedbackSchema,
    handler: async (request, reply) => {
      const sessionId = request.params.id
      console.log(sessionId)

      const { rate, useObjective, suggestion } = request.body ?? {}

      try {
        if (typeof rate !== 'number' || rate < 1 || rate > 5) {
          throw new BadRequestError('Campo "rate" é obrigatório e deve ser um número entre 1 e 5.')
        }

        if (!useObjective || typeof useObjective !== 'string') {
          throw new BadRequestError('Campo "useObjective" é obrigatório e deve ser string.')
        }

        const feedback = await engine.sendFeedback({
          sessionId,
          feedback: { rate, useObjective, suggestion },
        })

        sendSuccess(reply, feedback)
      } catch (err) {
        handleError(reply, err)
      }
    },
  })
}
