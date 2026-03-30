export interface NoteNote {
    id: string | number;
    title: string;
    preview?: string;
    notesCount?: number;
    updatedAt?: string;
    accentColor: string;
    type: 'normal' | 'math';
    content?: any;
    summary?: string;
}

export interface NoteToCreate extends Omit<NoteNote, 'id' | 'updatedAt' | 'notesCount'> {}    
export interface NoteToEdit extends Partial<Omit<NoteNote, 'id' | 'updatedAt' | 'notesCount' | 'type'>> { content?: any; }

export const COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#6366f1' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Cyan', value: '#06b6d4' }
]
