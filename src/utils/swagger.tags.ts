export const swaggerTags = {
  health: { name: 'Health', description: 'Monitoramento da API' },
  tracks: { name: 'Tracks', description: 'Listagem e gerenciamento de trilhas' },
} as const

export type SwaggerTag = (typeof swaggerTags)[keyof typeof swaggerTags]['name']
