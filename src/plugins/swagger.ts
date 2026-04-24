import fp from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'
import { swaggerTags } from '../utils/swagger.tags'

async function swaggerPlugin(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Ethos API',
        description: 'Documentação da API do projeto Ethos',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor local',
        },
        {
          url: 'https://ethos-api-develop.onrender.com/',
          description: 'Servidor Desenvolvimento',
        },
      ],
      tags: Object.values(swaggerTags),
    },
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/api/v1/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  })
}

export default fp(swaggerPlugin, { name: 'swagger' })
