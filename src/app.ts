import Fastify from 'fastify'
import cors from '@fastify/cors'
import healthRoutes from './routes/health'
import swaggerPlugin from './plugins/swagger'

const server = Fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
})

server.register(swaggerPlugin)
server.register(
  async (api) => {
    api.register(healthRoutes, { prefix: '/health' })
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
