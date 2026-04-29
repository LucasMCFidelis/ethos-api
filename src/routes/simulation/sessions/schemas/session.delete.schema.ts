import { swaggerTags } from '../../../../utils/swagger.tags'

export const sessionDeleteParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID da sessão' },
  },
  required: ['id'],
}

export const sessionDeleteResponseSchema = {
  200: {
    description: 'Sessão deletada com sucesso',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Sessão deletada com sucesso' },
        },
        required: ['message'],
      },
    },
  },
  400: {
    description: 'Parâmetro sessionId ausente ou inválido',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: { type: 'string', example: 'O parâmetro sessionId é obrigatório.' },
    },
  },
  404: {
    description: 'Sessão não encontrada',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'Sessão "e3d6f2a1-4b5c-4e7d-9f8a-1b2c3d4e5f6a" não encontrada.',
      },
    },
  },
  500: {
    description: 'Erro interno ao deletar a sessão',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: { type: 'string', example: 'Erro interno do servidor.' },
    },
  },
}

export const sessionDeleteSchema = {
  tags: [swaggerTags.sessions.name],
  summary: 'Remove uma sessão',
  description:
    'Busca e remove o registro da sessão no banco de dados. Utilizado ao cancelar o questionário para evitar sessões órfãs.',
  params: sessionDeleteParamsSchema,
  response: sessionDeleteResponseSchema,
}
