import { swaggerTags } from '../../../../utils/swagger.tags'

export const sessionsResultParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'ID da sessão' },
  },
  required: ['id'],
}

export const sessionsResultResponseSchema = {
  200: {
    description: 'Resultado final da sessão',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          finished: { type: 'boolean', example: true },
          result: {
            type: 'object',
            properties: {
              key: { type: 'string', example: 'resultado_critico' },
              label: { type: 'string', example: 'Nível Crítico' },
              description: {
                type: 'string',
                example: 'Foram identificadas práticas de alto risco.',
              },
              action_type: { type: 'string', example: 'treinamento_obrigatorio' },
              level: { type: 'string', example: 'critico' },
              actions: {
                type: 'array',
                items: { type: 'string' },
                example: ['Realizar treinamento de segurança', 'Revisar política de senhas'],
              },
            },
            required: ['key', 'label', 'description', 'action_type', 'level', 'actions'],
          },
        },
        required: ['finished', 'result'],
      },
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
    description: 'Erro interno ao buscar o resultado',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'Chave de resultado "resultado_x" não encontrada na trilha "confidencialidade".',
      },
    },
  },
}

export const sessionsResultSchema = {
  tags: [swaggerTags.sessions.name],
  summary: 'Retorna o resultado final de uma sessão',
  description:
    'Busca a última resposta da sessão, resolve a chave de resultado correspondente e retorna o diagnóstico completo com label, descrição, nível e ações recomendadas.',
  params: sessionsResultParamsSchema,
  response: sessionsResultResponseSchema,
}
