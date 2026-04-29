import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../../helpers'
import {
  sessionAnswerGetSchema,
  sessionAnswerRegisterSchema,
} from './schemas/sessions.answer.schema'
import { handleError } from '../../../errors/handleError'
import { BadRequestError } from '../../../errors/httpErrors'

interface AnswerParams {
  id: string
}

interface AnswerBody {
  questionId: string
  answer: string
}

export default function sessionsAnswerRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.post<{ Params: AnswerParams; Body: AnswerBody }>('/sessions/:id/answer', {
    schema: sessionAnswerRegisterSchema,
    handler: async (request, reply) => {
      const sessionId = request.params.id
      const { questionId, answer } = request.body ?? {}

      try {
        if (!questionId || typeof questionId !== 'string') {
          throw new BadRequestError('Campo "questionId" é obrigatório e deve ser string.')
        }

        const step = await engine.answer(sessionId, questionId, answer)
        sendSuccess(reply, step)
      } catch (err) {
        handleError(reply, err)
      }
    },
  })

  fastify.get<{ Params: AnswerParams & { questionId: string } }>(
    '/sessions/:id/answer/:questionId',
    {
      schema: sessionAnswerGetSchema,
      handler: async (request, reply) => {
        const { id: sessionId, questionId } = request.params

        try {
          const step = await engine.findQuestionResponse(sessionId, questionId)
          sendSuccess(reply, step)
        } catch (err) {
          const message = (err as Error).message
          if (message.includes('não encontrada')) {
            return sendError(reply, message, 404)
          }
          sendError(reply, message, 500)
        }
      },
    },
  )
}
