import Fastify from 'fastify'
import cors from '@fastify/cors'
import healthRoutes from './routes/health'

const server = Fastify()

// Configurar o CORS
server.register(cors, {
  origin: '*', // Libera totalmente para testes
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
})

// Registrar rotas de usuários com prefixo
server.register(healthRoutes, { prefix: '/health' })

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
