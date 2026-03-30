export type Status = 'selecting' | 'generating' | 'active' | 'finished'

export interface QuizItem {
    question: string
    options: string[]
    answer: string
    explanation: string
}

export interface ExerciseData {
    title: string
    items: QuizItem[]
}