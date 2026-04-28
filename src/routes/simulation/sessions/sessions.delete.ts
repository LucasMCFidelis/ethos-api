import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess, sendError } from '../../helpers'
import { prisma } from '../../../lib/prisma'

interface AnswerParams {
  id: string
}

export default function sessionsDeleteRoute(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.delete<{ Params: AnswerParams }>('/sessions/:id', {
    // schema: ,
    handler: async (request, reply) => {
      const sessionId = request.params.id

      if (!sessionId) {
        return sendError(reply, 'O parâmetro sessionId é obrigatório.')
      }

      try {
        await engine.getSession(sessionId)
        await prisma.session.delete({ where: { id: sessionId } })
        sendSuccess(reply, { message: 'Sessão deletada com sucesso' })
      } catch (err) {
        const message = (err as Error).message

        if (message.includes('não encontrada')) {
          return sendError(reply, `Sessão ${sessionId} não encontrada.`, 404)
        }

        sendError(reply, message, 500)
      }
    },
  })
}
