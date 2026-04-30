import { swaggerTags } from '../../../../utils/swagger.tags'

export const sessionFeedbackParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'ID da sessão' },
  },
  required: ['id'],
}

export const sessionFeedbackBodySchema = {
  type: 'object',
  properties: {
    rate: {
      type: 'number',
      description: 'Avaliação da simulação de 1 a 5',
      example: 4,
    },
    useObjective: {
      type: 'string',
      description: 'Objetivo de uso da simulação',
      example: 'Treinamento interno da equipe',
    },
    suggestion: {
      type: 'string',
      nullable: true,
      description: 'Sugestão opcional do usuário',
      example: 'Adicionar mais perguntas sobre engenharia social',
    },
  },
}

export const sessionFeedbackResponseSchema = {
  200: {
    description: 'Feedback registrado com sucesso',
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
          rate: { type: 'number', example: 4 },
          useObjective: { type: 'string', example: 'Treinamento interno da equipe' },
          suggestion: {
            type: 'string',
            nullable: true,
            example: 'Adicionar mais perguntas sobre engenharia social',
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['sessionId', 'rate', 'useObjective', 'createdAt'],
      },
    },
  },
  400: {
    description: 'Body inválido — rate fora do intervalo ou useObjective ausente',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'Campo "rate" é obrigatório e deve ser um número entre 1 e 5.',
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
    description: 'Erro interno ao registrar o feedback',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: { type: 'string', example: 'Erro inesperado ao salvar o feedback.' },
    },
  },
}

export const sessionFeedbackSchema = {
  tags: [swaggerTags.sessions.name],
  summary: 'Registra o feedback de uma sessão',
  description:
    'Salva ou atualiza o feedback da simulação realizada na sessão informada. Aceita uma avaliação numérica, o objetivo de uso e uma sugestão opcional.',
  params: sessionFeedbackParamsSchema,
  body: sessionFeedbackBodySchema,
  response: sessionFeedbackResponseSchema,
}
