export const tracksListResponseSchema = {
  200: {
    description: 'Lista de trilhas disponíveis',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          tracks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'confidencialidade' },
                title: { type: 'string', example: 'Confidencialidade' },
                description: {
                  type: 'string',
                  example: 'Trilha sobre boas práticas de confidencialidade',
                },
              },
            },
          },
        },
      },
    },
  },
  500: {
    description: 'Erro interno ao carregar as trilhas',
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      error: { type: 'string', example: 'Diretório de trilhas não encontrado: /config/tracks' },
    },
  },
}
