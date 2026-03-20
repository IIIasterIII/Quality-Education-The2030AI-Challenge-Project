"use client"
import React, { useState, useCallback, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable'
import { useParams } from 'next/navigation'
import { 
    ReactFlow, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    Node, 
    Edge, 
    OnNodesChange, 
    OnEdgesChange, 
    OnConnect, 
    Connection,
    Background,
    BackgroundVariant,
    MarkerType,
    DefaultEdgeOptions
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
import { RoadmapNode } from '@/components/roadMapsComponents/RoadmapNode';

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
    style: { 
        stroke: '#71fd64ff',
        strokeWidth: 2,
    },
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#71fd64ff',
    },
};

const INITIAL_NODES: Node[] = [
    { 
        id: 'n1', 
        type: 'roadmap',
        position: { x: 250, y: 100 }, 
        data: { label: 'Programming basics', description: 'Learning basic syntax, conditions and loops.', isCompleted: false },
    },
    { 
        id: 'n2', 
        type: 'roadmap',
        position: { x: 250, y: 400 }, 
        data: { label: 'Algorithms', description: 'Complexity O(n), sorting and recursion.', isCompleted: false },
    },
    { 
        id: 'n3', 
        type: 'roadmap',
        position: { x: 650, y: 600 }, 
        data: { label: 'Databases', description: 'SQL, NoSQL and data normalization.', isCompleted: false },
    },
];

const INITIAL_EDGES: Edge[] = [
    { 
        id: 'e1-2', 
        source: 'n1', 
        target: 'n2', 
    },
    { 
        id: 'e2-3', 
        source: 'n2', 
        target: 'n3',
    },
];

const getMissingAncestors = (nodeId: string, nodes: Node[], edges: Edge[], visited = new Set<string>()): Node[] => {
    if (visited.has(nodeId)) return []
    visited.add(nodeId)
    const missingNodes: Node[] = []
    const incomingEdges = edges.filter(edge => edge.target === nodeId)
    incomingEdges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source)
        if (sourceNode) {
            if (sourceNode.data?.isCompleted === false) missingNodes.push(sourceNode)
            const furtherAncestors = getMissingAncestors(sourceNode.id, nodes, edges, visited)
            furtherAncestors.forEach(anc => { if (!missingNodes.find(m => m.id === anc.id)) missingNodes.push(anc)})
        }
    })
    return missingNodes;
};

const getAllDescendantsIds = (nodeId: string, edges: Edge[], visited = new Set<string>()): string[] => {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    let descendantIds: string[] = [];
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    outgoingEdges.forEach(edge => {
        descendantIds.push(edge.target);
        const furtherDescendants = getAllDescendantsIds(edge.target, edges, visited);
        descendantIds = [...descendantIds, ...furtherDescendants];
    });
    return Array.from(new Set(descendantIds));
};

const page = () => {
    const params = useParams()
    const id = params.id
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])
    const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
    const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const currentNode = selectedNode ? nodes.find(n => n.id === selectedNode.id) : null;
    const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect: OnConnect = useCallback((params: Connection) => { setEdges((eds) => addEdge({ ...params, animated: true }, eds)) }, []);
    const onNodeClick = useCallback((_: any, node: Node) => { setSelectedNode(node) }, []);
    const onPaneClick = useCallback(() => { setSelectedNode(null) }, []);

const handleToggleComplete = useCallback((nodeId: string) => {
    const nodeToToggle = nodes.find(n => n.id === nodeId);
    if (!nodeToToggle) return;
    const currentlyCompleted = nodeToToggle.data?.isCompleted;
    if (!currentlyCompleted) {
        const missingNodes = getMissingAncestors(nodeId, nodes, edges);
        if (missingNodes.length > 0) {
            const labels = missingNodes.map(n => n.data.label).join(", ");
            alert(`You need to complete these steps first: ${labels}`);
            return;
        }
    }
    let nodesToReset: string[] = [];
    if (currentlyCompleted) {
        nodesToReset = getAllDescendantsIds(nodeId, edges);
    }

    setNodes((nds) =>
        nds.map((node) => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: { ...node.data, isCompleted: !currentlyCompleted },
                };
            }
            if (nodesToReset.includes(node.id)) {
                return {
                    ...node,
                    data: { ...node.data, isCompleted: false },
                };
            }
            return node;
        })
    );
}, [nodes, edges]);

    if (!mounted) {
        return (
            <ResizablePanelGroup orientation="horizontal" className="h-screen w-full bg-background">
                <ResizablePanel minSize={200} maxSize={300} defaultSize="10%" className="border-r" />
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="90%" />
            </ResizablePanelGroup>
        )
    }

    return (
        <ResizablePanelGroup orientation="horizontal" className="h-screen w-full bg-background">
            <ResizablePanel minSize={200} maxSize={300} defaultSize="10%">
                <div className="flex h-screen flex-col p-6 border-r bg-card/30 backdrop-blur-xl">
                    <h2 className="text-xl font-black tracking-tighter mb-6 uppercase text-primary/80">Navigator</h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Roadmap View</p>
                            <p className="text-sm font-mono truncate">Id: {id}</p>
                        </div>
                    </div>
                </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize="90%">
                <div className="h-full w-full relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={{ roadmap: RoadmapNode }}
                        defaultEdgeOptions={defaultEdgeOptions}
                        colorMode={resolvedTheme as 'light' | 'dark' | 'system'}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color={resolvedTheme === 'dark' ? '#333' : '#ccc'} />
                    </ReactFlow>
                </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel minSize={250} maxSize={450} defaultSize="25%">
                <div className="flex h-full flex-col p-6 border-l bg-card/30 backdrop-blur-xl">
                    <h2 className="text-xl font-black tracking-tighter mb-6 uppercase text-primary/80">Information</h2>
                    
                    {currentNode ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold leading-tight tracking-tight">{currentNode.data.label as string}</h3>
                                <div className="h-1.5 w-12 bg-primary rounded-full shadow-sm shadow-primary/50" />
                            </div>
                            
                            <div className="p-5 rounded-2xl bg-secondary/50 border border-border/50 shadow-inner">
                                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                    {currentNode.data.description as string || 'No description added for this block.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-card border shadow-sm text-center">
                                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Status</p>
                                    <p className={`text-xs font-bold ${currentNode.data.isCompleted ? 'text-green-500' : 'text-primary'}`}>
                                        {currentNode.data.isCompleted ? 'Completed' : 'In Progress'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-card border shadow-sm text-center">
                                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Priority</p>
                                    <p className="text-xs font-bold">High</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleToggleComplete(currentNode.id)}
                                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 
                                    ${currentNode.data.isCompleted 
                                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                                        : 'bg-primary text-primary-foreground hover:brightness-110 shadow-primary/20'}`}
                            >
                                {currentNode.data.isCompleted ? 'Mark as Uncompleted' : 'Mark as Completed'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-3xl opacity-40 grayscale">
                            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 shadow-lg">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <p className="text-sm font-bold tracking-tight text-muted-foreground">
                                Click on a block to open details
                            </p>
                        </div>
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default page