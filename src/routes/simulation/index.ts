// routes/index.ts

import type { FastifyInstance } from 'fastify'
import { TrackLoader } from '../../engine/TrackLoader'
import { ResultCalculator } from '../../engine/ResultCalculator'
import { SimulationEngine } from '../../engine/SimulationEngine'

import tracksListRoutes from './tracks/tracks.list'
import tracksStartRoutes from './tracks/tracks.start'
import sessionsAnswerRoutes from './sessions/sessions.answer'
import sessionsResultRoutes from './sessions/sessions.result'
import sessionsFeedbackRoutes from './sessions/sessions.feedback'
import trackQuestionsRoutes from './tracks/tracks.questions'
import sessionsDeleteRoute from './sessions/sessions.delete'

/**
 * Plugin Fastify que registra todas as rotas da simulação.
 *
 * Rotas registradas (relativas ao prefix):
 *   GET  /tracks
 *   GET  /tracks/:id/start
 *   POST /sessions/:id/answer
 *   GET  /sessions/:id/result
 */
export default async function simulationRoutes(fastify: FastifyInstance): Promise<void> {
  const loader = new TrackLoader()
  const calculator = new ResultCalculator()
  const engine = new SimulationEngine(loader, calculator)

  tracksListRoutes(fastify, loader)
  trackQuestionsRoutes(fastify, engine)
  tracksStartRoutes(fastify, engine)
  sessionsDeleteRoute(fastify, engine)
  sessionsAnswerRoutes(fastify, engine)
  sessionsResultRoutes(fastify, engine)
  sessionsFeedbackRoutes(fastify, engine)
}
