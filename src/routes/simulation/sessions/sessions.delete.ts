import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../../engine/SimulationEngine'
import { sendSuccess } from '../../helpers'
import { prisma } from '../../../lib/prisma'
import { handleError } from '../../../errors/handleError'
import { sessionDeleteSchema } from './schemas/session.delete.schema'

interface AnswerParams {
  id: string
}

export default function sessionsDeleteRoute(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.delete<{ Params: AnswerParams }>('/sessions/:id', {
    schema: sessionDeleteSchema,
    handler: async (request, reply) => {
      const sessionId = request.params.id

      try {
        await engine.getSession(sessionId)
        await prisma.session.delete({ where: { id: sessionId } })
        sendSuccess(reply, { message: 'Sessão deletada com sucesso' })
      } catch (err) {
        handleError(reply, err)
      }
    },
  })
}
