import Fastify from 'fastify'
import cors from '@fastify/cors'
import healthRoutes from './routes/health'
import swaggerPlugin from './plugins/swagger'
import simulationRoutes from './routes/simulation'

const server = Fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
})

server.register(swaggerPlugin)
server.get('/', (_, reply) => reply.redirect('/api/v1/docs'))
server.register(
  async (api) => {
    api.register(healthRoutes, { prefix: '/health' })
    api.register(simulationRoutes, { prefix: '/simulation' })
  },
  { prefix: '/api/v1' },
)

// Configurar a porta e host
const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || 'localhost'

server
  .listen({ port: PORT, host: HOST })
  .then(() => console.info(`http://${HOST}:${PORT}/`))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
