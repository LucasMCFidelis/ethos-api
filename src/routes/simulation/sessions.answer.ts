// routes/sessions.answer.ts

import type { FastifyInstance } from 'fastify'
import type { SimulationEngine } from '../../engine/SimulationEngine'
import { sendSuccess, sendError, isValidAnswer } from '../helpers'

interface AnswerParams {
  id: string
}

interface AnswerBody {
  questionId: string
  answer: string
}

/**
 * POST /sessions/:id/answer
 *
 * Registra a resposta e retorna a próxima pergunta ou o resultado final.
 *
 * Body:
 * { "questionId": "q1", "answer": "sim" | "nao" | "duvida" }
 *
 * Response 200 — próxima pergunta:
 * { ok: true, data: { finished: false, question: { id, text, options } } }
 *
 * Response 200 — resultado final:
 * { ok: true, data: { finished: true, result: { key, label, description, score } } }
 *
 * Response 400: body inválido
 * Response 404: sessão não encontrada
 * Response 409: resposta fora de sequência
 */
export default function sessionsAnswerRoutes(
  fastify: FastifyInstance,
  engine: SimulationEngine,
): void {
  fastify.post<{ Params: AnswerParams; Body: AnswerBody }>(
    '/sessions/:id/answer',
    async (request, reply) => {
      const sessionId = request.params.id
      const { questionId, answer } = request.body ?? {}

      if (!questionId || typeof questionId !== 'string') {
        return sendError(reply, 'Campo "questionId" é obrigatório e deve ser string.')
      }

      if (!isValidAnswer(answer)) {
        return sendError(reply, 'Campo "answer" é obrigatório e deve ser "sim", "nao" ou "talvez".')
      }

      try {
        const step = engine.answer(sessionId, questionId, answer)
        sendSuccess(reply, step)
      } catch (err) {
        const message = (err as Error).message

        if (message.includes('não encontrada')) {
          return sendError(reply, `Sessão "${sessionId}" não encontrada.`, 404)
        }

        if (message.includes('Pergunta inesperada')) {
          return sendError(reply, message, 409)
        }

        sendError(reply, message, 500)
      }
    },
  )
}
