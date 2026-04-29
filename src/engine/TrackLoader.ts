import fs from 'fs'
import path from 'path'
import type { Track, Question } from './types'
import { BadRequestError, NotFoundError } from '../errors/httpErrors'

const TRACKS_DIR = path.resolve(process.cwd(), 'config/tracks')

export class TrackLoader {
  private cache: Map<string, Track> = new Map()

  // ------------------------------------------------------------------ //
  //  Público
  // ------------------------------------------------------------------ //

  load(trackId: string): Track {
    if (!trackId) {
      throw new BadRequestError('O parâmetro trackId é obrigatório')
    }

    if (this.cache.has(trackId)) return this.cache.get(trackId)!

    const filePath = path.join(TRACKS_DIR, `${trackId}.json`)
    const raw = this.readFile(filePath)
    const parsed = this.parseJSON(raw, filePath)
    const track = this.validate(parsed)

    this.cache.set(trackId, track)
    return track
  }

  listAvailable(): string[] {
    if (!fs.existsSync(TRACKS_DIR)) {
      throw new NotFoundError(`Diretório de trilhas não encontrado: ${TRACKS_DIR}`)
    }
    return fs
      .readdirSync(TRACKS_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
  }

  invalidate(trackId: string): void {
    this.cache.delete(trackId)
  }

  // ------------------------------------------------------------------ //
  //  Privado — I/O
  // ------------------------------------------------------------------ //

  private readFile(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError(`Arquivo de trilha não encontrado: ${filePath}`)
    }
    return fs.readFileSync(filePath, 'utf-8')
  }

  private parseJSON(raw: string, filePath: string): unknown {
    try {
      return JSON.parse(raw)
    } catch {
      throw new NotFoundError(`JSON inválido no arquivo de trilha: ${filePath}`)
    }
  }

  // ------------------------------------------------------------------ //
  //  Privado — Validação
  // ------------------------------------------------------------------ //

  private validate(data: unknown): Track {
    if (typeof data !== 'object' || data === null) {
      throw new BadRequestError('Trilha deve ser um objeto JSON.')
    }

    const raw = data as Record<string, unknown>

    this.assertString(raw, 'id')
    this.assertString(raw, 'title')
    this.assertString(raw, 'description')
    this.assertObject(raw, 'questions')
    this.assertObject(raw, 'results')

    const questions = this.validateQuestions(raw.questions as Record<string, unknown>)
    const results = this.validateResults(raw.results as Record<string, unknown>)

    this.assertFirstQuestionExists(questions)
    this.assertNextKeysExist(questions, results)

    return {
      id: raw.id as string,
      title: raw.title as string,
      description: raw.description as string,
      questions,
      results,
    }
  }

  private validateQuestions(raw: Record<string, unknown>): Track['questions'] {
    const questions: Track['questions'] = {}

    for (const [qId, qData] of Object.entries(raw)) {
      if (typeof qData !== 'object' || qData === null) {
        throw new BadRequestError(`Pergunta "${qId}" deve ser um objeto.`)
      }

      const q = qData as Record<string, unknown>

      if (typeof q.text !== 'string' || q.text.trim() === '') {
        throw new BadRequestError(`Pergunta "${qId}": campo "text" ausente ou vazio.`)
      }

      // description é opcional
      if (q.description !== undefined && typeof q.description !== 'string') {
        throw new BadRequestError(`Pergunta "${qId}": campo "description" deve ser string.`)
      }

      if (typeof q.options !== 'object' || q.options === null) {
        throw new BadRequestError(`Pergunta "${qId}": campo "options" ausente.`)
      }

      const options = q.options as Record<string, unknown>
      const validatedOptions: Question['options'] = {}

      for (const [optKey, optData] of Object.entries(options)) {
        if (typeof optData !== 'object' || optData === null) {
          throw new BadRequestError(`Pergunta "${qId}", opção "${optKey}": deve ser um objeto.`)
        }

        const opt = optData as Record<string, unknown>

        if (typeof opt.next !== 'string' || opt.next.trim() === '') {
          throw new BadRequestError(
            `Pergunta "${qId}", opção "${optKey}": campo "next" deve ser string não vazia.`,
          )
        }

        validatedOptions[optKey] = { next: opt.next }
      }

      questions[qId] = {
        text: q.text,
        description: q.description as string | undefined,
        options: validatedOptions,
      }
    }

    return questions
  }

  private validateResults(raw: Record<string, unknown>): Track['results'] {
    const results: Track['results'] = {}

    if (Object.keys(raw).length === 0) {
      throw new BadRequestError('Campo "results" não pode estar vazio.')
    }

    for (const [key, value] of Object.entries(raw)) {
      if (typeof value !== 'object' || value === null) {
        throw new BadRequestError(`Resultado "${key}" deve ser um objeto.`)
      }

      const r = value as Record<string, unknown>

      this.assertResultString(r, key, 'label')
      this.assertResultString(r, key, 'description')
      this.assertResultString(r, key, 'action_type')
      this.assertResultString(r, key, 'level')

      if (!Array.isArray(r.actions)) {
        throw new BadRequestError(`Resultado "${key}": campo "actions" deve ser um array.`)
      }

      results[key] = {
        label: r.label as string,
        description: r.description as string,
        action_type: r.action_type as string,
        level: r.level as string,
        actions: r.actions as string[],
      }
    }

    return results
  }

  // ------------------------------------------------------------------ //
  //  Privado — Integridade referencial
  // ------------------------------------------------------------------ //

  /**
   * Garante que todo `next` aponta para uma pergunta ou resultado existente.
   */
  private assertNextKeysExist(questions: Track['questions'], results: Track['results']): void {
    for (const [qId, question] of Object.entries(questions)) {
      for (const [optKey, option] of Object.entries(question.options)) {
        const { next } = option
        const validTarget = next in questions || next in results

        if (!validTarget) {
          throw new Error(
            `Pergunta "${qId}", opção "${optKey}": next="${next}" não aponta para nenhuma pergunta ou resultado válido.`,
          )
        }
      }
    }
  }

  // ------------------------------------------------------------------ //
  //  Privado — Helpers de asserção
  // ------------------------------------------------------------------ //

  private assertString(obj: Record<string, unknown>, key: string): void {
    if (typeof obj[key] !== 'string' || (obj[key] as string).trim() === '') {
      throw new BadRequestError(`Campo "${key}" ausente ou inválido na trilha.`)
    }
  }

  private assertObject(obj: Record<string, unknown>, key: string): void {
    if (typeof obj[key] !== 'object' || obj[key] === null) {
      throw new BadRequestError(`Campo "${key}" deve ser um objeto na trilha.`)
    }
  }

  private assertResultString(r: Record<string, unknown>, resultKey: string, field: string): void {
    if (typeof r[field] !== 'string') {
      throw new BadRequestError(`Resultado "${resultKey}": campo "${field}" deve ser string.`)
    }
  }

  private assertFirstQuestionExists(questions: Track['questions']): void {
    if (!('q1' in questions)) {
      throw new BadRequestError(
        'A trilha deve conter uma pergunta com id "q1" como ponto de entrada.',
      )
    }
  }
}
