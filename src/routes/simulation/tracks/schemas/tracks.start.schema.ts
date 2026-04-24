export const tracksStartParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID da trilha', example: 'confidencialidade' },
  },
  required: ['id'],
}

export const tracksStartResponseSchema = {
  201: {
    description: 'Sessão iniciada com sucesso',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            format: 'uuid',
            example: 'e3d6f2a1-4b5c-4e7d-9f8a-1b2c3d4e5f6a',
          },
          finished: { type: 'boolean', example: false },
          maxQuestions: { type: 'integer', example: 8 },
          question: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'q1' },
              text: { type: 'string', example: 'Você compartilha senhas com colegas?' },
              description: {
                type: 'string',
                nullable: true,
                example: 'Considere todos os tipos de senha, incluindo as de sistemas internos.',
              },
              options: {
                type: 'array',
                items: { type: 'string' },
                example: ['sim', 'nao', 'duvida'],
              },
            },
            required: ['id', 'text', 'options'],
          },
        },
        required: ['sessionId', 'finished', 'maxQuestions', 'question'],
      },
    },
  },
  404: {
    description: 'Trilha não encontrada',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: { type: 'string', example: 'Trilha "confidencialidade" não encontrada.' },
    },
  },
  500: {
    description: 'Erro interno ao iniciar a sessão',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'JSON inválido no arquivo de trilha: /config/tracks/confidencialidade.json',
      },
    },
  },
}
