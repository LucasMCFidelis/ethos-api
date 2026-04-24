export const trackQuestionResponseSchema = {
  200: {
    description: 'Pergunta encontrada',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'q1' },
          text: { type: 'string', example: 'Você compartilha senhas com colegas?' },
          description: {
            type: 'string',
            example: 'Considere todos os tipos de senha, incluindo as de sistemas internos.',
            nullable: true,
          },
          options: {
            type: 'object',
            description: 'Chave é a opção de resposta, valor contém o próximo passo',
            additionalProperties: {
              type: 'object',
              properties: {
                next: { type: 'string', example: 'q2' },
              },
              required: ['next'],
            },
            example: {
              sim: { next: 'q2' },
              nao: { next: 'resultado_positivo' },
              duvida: { next: 'q3' },
            },
          },
        },
        required: ['id', 'text', 'options'],
      },
    },
  },
  404: {
    description: 'Track ou pergunta não encontrada',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'Pergunta "q99" não encontrada na track "confidencialidade".',
      },
    },
  },
  500: {
    description: 'Erro interno ao carregar a pergunta',
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

export const trackQuestionParamsSchema = {
  type: 'object',
  properties: {
    trackId: { type: 'string', description: 'ID da trilha', example: 'confidencialidade' },
    questionId: { type: 'string', description: 'ID da pergunta', example: 'q1' },
  },
  required: ['trackId', 'questionId'],
}
