import type { FastifyInstance } from 'fastify'
import type { TrackLoader } from '../../engine/TrackLoader'
import { sendSuccess, sendError } from '../helpers'

/**
 * GET /tracks
 *
 * Lista todas as trilhas disponíveis em config/tracks/.
 *
 * Response 200:
 * {
 *   ok: true,
 *   data: {
 *     tracks: [F
 *       { id: "confidencialidade", title: "...", description: "..." }
 *     ]
 *   }
 * }
 */
export default function tracksListRoutes(fastify: FastifyInstance, loader: TrackLoader): void {
  fastify.get('/tracks', async (_request, reply) => {
    try {
      const ids = loader.listAvailable()

      const tracks = ids.map((id) => {
        const track = loader.load(id)
        return { id: track.id, title: track.title, description: track.description }
      })

      sendSuccess(reply, { tracks })
    } catch (err) {
      sendError(reply, (err as Error).message, 500)
    }
  })
}
