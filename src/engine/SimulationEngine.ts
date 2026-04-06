import { randomUUID } from 'crypto'
import type {
  AnswerOption,
  SessionState,
  StepResponse,
  NextStepResponse,
  FinishedStepResponse,
} from './types'
import type { TrackLoader } from './TrackLoader'
import type { ResultCalculator } from './ResultCalculator'

const MAX_QUESTIONS = 5

export class SimulationEngine {
  private loader: TrackLoader
  private calculator: ResultCalculator

  // Sessões em memória — substituir por SessionRepository (Prisma) em produção
  private sessions: Map<string, SessionState> = new Map()

  constructor(loader: TrackLoader, calculator: ResultCalculator) {
    this.loader = loader
    this.calculator = calculator
  }

  // ------------------------------------------------------------------ //
  //  Público — ciclo de vida da simulação
  // ------------------------------------------------------------------ //

  /**
   * Inicia uma nova sessão e retorna a primeira pergunta (q1).
   */
  start(trackId: string): { sessionId: string } & NextStepResponse {
    const track = this.loader.load(trackId)

    const sessionId = randomUUID()
    const session: SessionState = {
      sessionId,
      trackId,
      currentQuestionId: 'q1',
      answeredCount: 0,
      answers: [],
    }

    this.sessions.set(sessionId, session)

    const question = track.questions['q1']

    return {
      sessionId,
      finished: false,
      question: {
        id: 'q1',
        text: question.text, // ← vem do arquivo de configuração
        description: question.description, // ← vem do arquivo de configuração
        options: Object.keys(question.options), // ← vem do arquivo de configuração
      },
    }
  }

  /**
   * Processa a resposta e retorna o próximo passo:
   * - Próxima pergunta  → NextStepResponse
   * - Resultado final   → FinishedStepResponse
   *
   * O resultado é determinado quando `next` aponta para uma chave
   * dentro de `results` (e não de `questions`).
   */
  answer(sessionId: string, questionId: string, answer: AnswerOption): StepResponse {
    const session = this.getSession(sessionId)
    const track = this.loader.load(session.trackId)

    if (session.currentQuestionId !== questionId) {
      throw new Error(
        `Pergunta inesperada. Esperada: "${session.currentQuestionId}", recebida: "${questionId}".`,
      )
    }

    const question = track.questions[questionId]
    if (!question) {
      throw new Error(`Pergunta "${questionId}" não encontrada na trilha.`)
    }

    const chosen = question.options[answer]
    if (!chosen) {
      const valid = Object.keys(question.options).join(', ')
      throw new Error(
        `Opção "${answer}" inválida para a pergunta "${questionId}". Válidas: ${valid}.`,
      )
    }

    // Registra a resposta
    session.answers.push({ questionId, answer })
    session.answeredCount++

    const nextKey = chosen.next

    // Verifica se next aponta para um resultado ou para outra pergunta
    const isResult =
      nextKey in track.results ||
      !(nextKey in track.questions) ||
      session.answeredCount >= MAX_QUESTIONS

    if (isResult) {
      // Garante que a chave existe em results
      const resultKey = nextKey in track.results ? nextKey : this.fallbackResult(track)
      return this.buildResult(track, resultKey)
    }

    // Avança para a próxima pergunta
    const nextQuestion = track.questions[nextKey]
    session.currentQuestionId = nextKey

    return {
      finished: false,
      question: {
        id: nextKey,
        text: nextQuestion.text, // ← vem do arquivo de configuração
        description: nextQuestion.description, // ← vem do arquivo de configuração
        options: Object.keys(nextQuestion.options), // ← vem do arquivo de configuração
      },
    } satisfies NextStepResponse
  }

  /**
   * Recupera o resultado de uma sessão.
   */
  getResult(sessionId: string): FinishedStepResponse {
    const session = this.getSession(sessionId)
    const track = this.loader.load(session.trackId)
    const lastAnswer = session.answers.at(-1)

    if (!lastAnswer) {
      throw new Error(`Sessão "${sessionId}" ainda não possui respostas.`)
    }

    const lastQuestion = track.questions[lastAnswer.questionId]
    const resultKey = lastQuestion.options[lastAnswer.answer].next

    return this.buildResult(track, resultKey)
  }

  // ------------------------------------------------------------------ //
  //  Privado
  // ------------------------------------------------------------------ //

  private buildResult(
    track: ReturnType<TrackLoader['load']>,
    resultKey: string,
  ): FinishedStepResponse {
    const result = this.calculator.resolve(track, resultKey)

    return {
      finished: true,
      result: {
        key: result.key,
        label: result.label,
        description: result.description,
        action_type: result.action_type,
        level: result.level,
        actions: result.actions,
      },
    }
  }

  private getSession(sessionId: string): SessionState {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Sessão "${sessionId}" não encontrada.`)
    }
    return session
  }

  /**
   * Fallback caso o next aponte para uma chave inexistente:
   * retorna o primeiro resultado disponível na trilha.
   */
  private fallbackResult(track: ReturnType<TrackLoader['load']>): string {
    const firstKey = Object.keys(track.results)[0]
    if (!firstKey) throw new Error(`Trilha "${track.id}" não possui resultados definidos.`)
    return firstKey
  }
}
