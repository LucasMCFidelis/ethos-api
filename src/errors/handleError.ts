import type { FastifyReply } from 'fastify'
import { BadRequestError, GoneError, NotFoundError } from './httpErrors'
import { sendError } from '../routes/helpers'

export function handleError(reply: FastifyReply, err: unknown) {
  if (err instanceof GoneError) {
    return reply.status(410).send({ message: err.message })
  }

  if (err instanceof BadRequestError) {
    return sendError(reply, err.message, 400)
  }

  if (err instanceof NotFoundError) {
    return sendError(reply, err.message, 404)
  }

  return sendError(reply, 'Erro interno do servidor.', 500)
}
