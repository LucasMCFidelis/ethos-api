import { NotFoundError } from '../errors/httpErrors'
import type { Track } from './types'

export interface CalculatedResult {
  key: string
  label: string
  description: string
  action_type: string
  level: string
  actions: string[]
}

export class ResultCalculator {
  /**
   * Resolve o resultado final a partir de uma chave.
   * O SimulationEngine já determinou qual chave de resultado usar
   * (via next do JSON), então aqui apenas buscamos e montamos o objeto.
   */
  resolve(track: Track, resultKey: string): CalculatedResult {
    const band = track.results[resultKey]

    if (!band) {
      throw new NotFoundError(
        `Chave de resultado "${resultKey}" não encontrada na trilha "${track.id}".`,
      )
    }

    return {
      key: resultKey,
      label: band.label,
      description: band.description,
      action_type: band.action_type,
      level: band.level,
      actions: band.actions,
    }
  }
}
