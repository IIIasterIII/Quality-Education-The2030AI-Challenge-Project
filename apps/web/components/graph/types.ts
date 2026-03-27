export interface SubNote {
    id: number;
    title: string;
    summary?: string;
}

export interface Node {
    id: string;
    name: string;
    val: number;
    group: number;
    subGraph?: {
        nodes: Node[];
        links: Link[];
    };
    complexity?: string;
    time_spent?: number;
    last_opened?: string;
    summary?: string;
    subNotes?: SubNote[];
    notesCount?: number;
    x?: number;
    y?: number;
}

export interface Link {
    source: string | Node;
    target: string | Node;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}
