import type { FastifyReply } from 'fastify'
import type { AnswerOption } from '../engine/types'

export function sendSuccess<T>(reply: FastifyReply, data: T, status = 200): void {
  reply.status(status).send({ ok: true, data })
}

export function sendError(reply: FastifyReply, message: string, status = 400): void {
  reply.status(status).send({ ok: false, error: message })
}

export function isValidAnswer(value: unknown): value is AnswerOption {
  return value === 'sim' || value === 'nao' || value === 'duvida'
}
