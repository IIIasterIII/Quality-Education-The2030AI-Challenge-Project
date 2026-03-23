export interface NoteNode {
    id: string;
    title: string;
    preview: string;
    nodesCount: number;
    updatedAt: string;
    accentColor: string;
    type?: 'normal' | 'math';
}

export const COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#6366f1' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Cyan', value: '#06b6d4' }
]
