export interface Node {
    id: string;
    name: string;
    val: number;
    group: number;
    subGraph?: {
        nodes: Node[];
        links: Link[];
    };
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
