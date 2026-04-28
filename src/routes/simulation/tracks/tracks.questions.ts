import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../../helpers'
import {
  trackQuestionParamsSchema,
  trackQuestionResponseSchema,
} from './schemas/tracks.questions.schema'
import { swaggerTags } from '../../../utils/swagger.tags'

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

      if (!questionId) {
        sendError(reply, 'O parâmetro questionId é obrigatório')
      }

      try {
        const question = engine.findTrackQuestion(trackId, questionId)
        return sendSuccess(reply, question)
      } catch (err) {
        const message = (err as Error).message

        if (message.includes('Arquivo de trilha não encontrado')) {
          return sendError(reply, `Arquivo da trilha ${trackId} não encontrado`, 404)
        }

        if (message.includes('não encontrada')) {
          return sendError(reply, message, 404)
        }

        return sendError(reply, message, 500)
      }
    },
  })
}
