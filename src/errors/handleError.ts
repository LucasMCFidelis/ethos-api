import type { FastifyReply } from 'fastify'
import { BadRequestError, NotFoundError } from './httpErrors'
import { sendError } from '../routes/helpers'

export function handleError(reply: FastifyReply, err: unknown) {
  if (err instanceof BadRequestError) {
    return sendError(reply, err.message, 400)
  }

  if (err instanceof NotFoundError) {
    return sendError(reply, err.message, 404)
  }

  return sendError(reply, 'Erro interno do servidor.', 500)
}
