import { swaggerTags } from '../../../../utils/swagger.tags'

export const sessionAnswerParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID da sessão' },
  },
  required: ['id'],
}

export const questionSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'q2' },
    text: {
      type: 'string',
      example: 'Você utiliza redes Wi-Fi públicas para acessar sistemas internos?',
    },
    description: {
      type: 'string',
      nullable: true,
      example: 'Considere redes de cafeterias, aeroportos e hotéis.',
    },
    options: {
      type: 'array',
      items: { type: 'string' },
      example: ['sim', 'nao', 'duvida'],
    },
  },
  required: ['id', 'text', 'options'],
}

export const nextStepSchema = {
  type: 'object',
  properties: {
    finished: { type: 'boolean', example: false },
    question: questionSchema,
  },
  required: ['finished', 'question'],
}

export const finishedStepSchema = {
  type: 'object',
  properties: {
    finished: { type: 'boolean', example: true },
    result: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'resultado_critico' },
        label: { type: 'string', example: 'Nível Crítico' },
        description: { type: 'string', example: 'Foram identificadas práticas de alto risco.' },
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
}

export const sessionAnswerRegisterResponseSchema = {
  '2xx': {
    description:
      'Próxima pergunta (`finished: false`, retorna `question`) ou resultado final (`finished: true`, retorna `result`).',
    type: 'object',
    additionalProperties: true,
  },
  400: {
    description: 'Body inválido — questionId ausente ou answer não permitido',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'Campo "answer" é obrigatório e deve ser "sim", "nao" ou "talvez".',
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
    description: 'Erro interno ao processar a resposta',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'Opção "talvez" inválida para a pergunta "q1". Válidas: sim, nao, duvida.',
      },
    },
  },
}

export const sessionAnswerGetParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID da sessão' },
    questionId: { type: 'string', description: 'ID da pergunta', example: 'q1' },
  },
  required: ['id', 'questionId'],
}

export const sessionAnswerGetResponseSchema = {
  200: {
    description: 'Pergunta com a resposta salva na sessão',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          finished: { type: 'boolean', example: false },
          question: questionSchema,
          savedResponse: { type: 'string', example: 'sim' },
        },
        required: ['finished', 'question', 'savedResponse'],
      },
    },
  },
  404: {
    description: 'Sessão ou resposta não encontrada',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: { type: 'string', example: 'Resposta para "q1" não encontrada na sessão.' },
    },
  },
  500: {
    description: 'Erro interno ao buscar a resposta',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: {
        type: 'string',
        example: 'Arquivo de trilha não encontrado: /config/tracks/confidencialidade.json',
      },
    },
  },
}

export const sessionAnswerRegisterSchema = {
  tags: [swaggerTags.sessions.name],
  summary: 'Registra a resposta de uma pergunta',
  description:
    'Salva a resposta da pergunta atual e retorna a próxima pergunta ou o resultado final da trilha, caso todas as perguntas tenham sido respondidas.',
  params: sessionAnswerParamsSchema,
  body: {
    type: 'object',
    properties: {
      questionId: { type: 'string', description: 'ID da pergunta respondida', example: 'q1' },
      answer: { type: 'string', description: 'Resposta selecionada', example: 'sim' },
    },
  },
  response: sessionAnswerRegisterResponseSchema,
}

export const sessionAnswerGetSchema = {
  tags: [swaggerTags.sessions.name],
  summary: 'Retorna a resposta salva de uma pergunta na sessão',
  description:
    'Busca a resposta registrada para uma pergunta específica dentro de uma sessão, junto com os dados da pergunta.',
  params: sessionAnswerGetParamsSchema,
  response: sessionAnswerGetResponseSchema,
}
