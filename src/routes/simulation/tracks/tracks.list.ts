import type { FastifyInstance } from 'fastify'
import type { TrackLoader } from '../../../engine/TrackLoader'
import { sendSuccess, sendError } from '../../helpers'
import { tracksListResponseSchema } from './schemas/tracks.list.schema'
import { swaggerTags } from '../../../utils/swagger.tags'

export default function tracksListRoutes(fastify: FastifyInstance, loader: TrackLoader): void {
  fastify.get('/tracks', {
    schema: {
      tags: [swaggerTags.tracks.name],
      summary: 'Lista todas as trilhas disponíveis',
      description:
        'Retorna id, título e descrição de todas as trilhas encontradas em config/tracks/',
      response: tracksListResponseSchema,
    },
    handler: async (_request, reply) => {
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
    },
  })
}
