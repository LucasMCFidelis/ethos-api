export const swaggerTags = {
  health: { name: 'Health', description: 'Monitoramento da API' },
  tracks: { name: 'Tracks', description: 'Listagem e gerenciamento de trilhas' },
  sessions: { name: 'Sessions', description: 'Gerenciamento de sessões e respostas' },
} as const

export type SwaggerTag = (typeof swaggerTags)[keyof typeof swaggerTags]['name']
