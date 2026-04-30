import type { FastifyReply } from 'fastify'

export function sendSuccess<T>(reply: FastifyReply, data: T, status = 200): void {
  reply.status(status).send({ ok: true, data })
}

export function sendError(reply: FastifyReply, message: string, status = 400): void {
  reply.status(status).send({ ok: false, error: message })
}
