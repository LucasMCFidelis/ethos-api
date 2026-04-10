export type AnswerOption = string

export interface QuestionOption {
  next: string
}

export interface Question {
  text: string
  description?: string
  options: Record<AnswerOption, QuestionOption>
}

export interface TrackResult {
  label: string
  description: string
  action_type: string
  level: string
  actions: string[]
}

export interface Track {
  id: string
  title: string
  description: string
  questions: Record<string, Question>
  results: Record<string, TrackResult>
}

export interface SessionState {
  sessionId: string
  trackId: string
  currentQuestionId: string
  answeredCount: number
  answers: AnswerRecord[]
}

export interface AnswerRecord {
  questionId: string
  answer: AnswerOption
}

export interface StepResponded {
  finished: false
  question: {
    id: string
    text: string
    description?: string
    options: AnswerOption[]
  }
  savedResponse: AnswerOption
}

export interface NextStepResponse {
  finished: false
  maxQuestions?: number
  question: {
    id: string
    text: string
    description?: string
    options: AnswerOption[]
  }
}

export interface FinishedStepResponse {
  finished: true
  result: {
    key: string
    label: string
    description: string
    action_type: string
    level: string
    actions: string[]
  }
}

export type StepResponse = NextStepResponse | FinishedStepResponse | StepResponded
