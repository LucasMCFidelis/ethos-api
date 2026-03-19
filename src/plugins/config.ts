import fastifyEnv from '@fastify/env'
import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'

const schema = {
  type: 'object',
  required: ['DATABASE_URL'],
  properties: {
    NODE_ENV: { type: 'string', default: 'development' },
    PORT: { type: 'number', default: 3000 },
    HOST: { type: 'string', default: '0.0.0.0' },
    DATABASE_URL: { type: 'string' },
  },
}

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: string
      PORT: number
      HOST: string
      DATABASE_URL: string
    }
  }
}

async function configPlugin(app: FastifyInstance) {
  await app.register(fastifyEnv, { schema, dotenv: true })
}

export default fp(configPlugin, { name: 'config' })
