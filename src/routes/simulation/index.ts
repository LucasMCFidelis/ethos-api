// routes/index.ts

import type { FastifyInstance } from 'fastify'
import { TrackLoader } from '../../engine/TrackLoader'
import { ResultCalculator } from '../../engine/ResultCalculator'
import { SimulationEngine } from '../../engine/SimulationEngine'

import tracksListRoutes from './tracks.list'
import tracksStartRoutes from './tracks.start'
import sessionsAnswerRoutes from './sessions.answer'
import sessionsResultRoutes from './sessions.result'
import sessionsFeedbackRoutes from './sessions.feedback'

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
  tracksStartRoutes(fastify, engine)
  sessionsAnswerRoutes(fastify, engine)
  sessionsResultRoutes(fastify, engine)
  sessionsFeedbackRoutes(fastify, engine)
}
