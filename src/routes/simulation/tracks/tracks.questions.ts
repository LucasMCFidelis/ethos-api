import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess } from '../../helpers'
import {
  trackQuestionParamsSchema,
  trackQuestionResponseSchema,
} from './schemas/tracks.questions.schema'
import { swaggerTags } from '../../../utils/swagger.tags'
import { handleError } from '../../../errors/handleError'

interface QuestionParams {
  trackId: string
  questionId: string
}

export default function trackQuestionsRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.get<{ Params: QuestionParams }>('/tracks/:trackId/questions/:questionId', {
    schema: {
      tags: [swaggerTags.tracks.name],
      summary: 'Retorna uma pergunta específica de uma trilha',
      description:
        'Busca a pergunta pelo ID dentro da trilha informada. Retorna o texto, descrição opcional e as opções de resposta com seus próximos passos.',
      params: trackQuestionParamsSchema,
      response: trackQuestionResponseSchema,
    },
    handler: async (request, reply) => {
      const { trackId, questionId } = request.params

      try {
        const question = engine.findTrackQuestion(trackId, questionId)
        return sendSuccess(reply, question)
      } catch (err) {
        handleError(reply, err)
      }
    },
  })
}
