import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../../helpers'
import { swaggerTags } from '../../../utils/swagger.tags'
import { tracksStartParamsSchema, tracksStartResponseSchema } from './schemas/tracks.start.schema'

interface StartParams {
  id: string
}

export default function tracksStartRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.get<{ Params: StartParams }>('/tracks/:id/start', {
    schema: {
      tags: [swaggerTags.tracks.name],
      summary: 'Inicia uma nova sessão em uma trilha',
      description:
        'Cria uma sessão no banco de dados, carrega a trilha e retorna a primeira pergunta (q1) com as opções disponíveis e o total de perguntas.',
      params: tracksStartParamsSchema,
      response: tracksStartResponseSchema,
    },
    handler: async (request, reply) => {
      const { id } = request.params

      try {
        const { sessionId, question, maxQuestions } = await engine.start(id)
        sendSuccess(reply, { sessionId, finished: false, question, maxQuestions }, 201)
      } catch (err) {
        const message = (err as Error).message

        if (message.includes('não encontrado')) {
          return sendError(reply, `Trilha "${id}" não encontrada.`, 404)
        }

        sendError(reply, message, 500)
      }
    },
  })
}
