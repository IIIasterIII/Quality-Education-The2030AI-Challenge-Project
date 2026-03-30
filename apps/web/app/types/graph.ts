export interface SubNoteData {
    id: number
    title: string
    summary?: string
}

export interface LinkData {
    source: number
    target: number
    type: string
}

export interface MainGraphData {
    id: number
    title: string
    preview: string | null
    notesCount: number
    updatedAt: string
    accentColor: string
    type: string
    complexity: string
    time_spent: number
    last_opened: string | null
    summary: string | null
    subNotes: SubNoteData[]
    links: LinkData[]
}
