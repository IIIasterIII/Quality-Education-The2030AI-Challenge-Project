"use client"
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useToast } from '@/components/toast'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable'
import { SubjectHeader } from '@/components/graph/SubjectHeader'
import { GraphEditor } from '@/components/graph/GraphEditor'
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph'
import { SubjectDetails } from '@/components/graph/SubjectDetails'
import { SubjectDirectory } from '@/components/graph/SubjectDirectory'
import { GraphLegend } from '@/components/graph/GraphLegend'
import { Node, GraphData } from '@/components/graph/types'

const GRAPH_DATA_LEVEL_2_MATH: GraphData = {
    nodes: [
        { id: 'math_calc_1', name: 'Calculus I', val: 8, group: 2 },
        { id: 'math_calc_2', name: 'Calculus II', val: 8, group: 2 },
        { id: 'math_analysis', name: 'Real Analysis', val: 10, group: 2 },
        { id: 'math_topology', name: 'Topology', val: 9, group: 2 },
    ],
    links: [
        { source: 'math_calc_1', target: 'math_calc_2' },
        { source: 'math_calc_2', target: 'math_analysis' },
        { source: 'math_analysis', target: 'math_topology' },
    ]
};

const INITIAL_DATA: GraphData = {
    nodes: [
        { 
            id: 'cs', 
            name: 'Computer Science', 
            group: 1, 
            val: 20,
            subGraph: {
                nodes: [
                    { id: 'cs_lang', name: 'Programming Languages', val: 12, group: 1, 
                        subGraph: {
                            nodes: [
                                { id: 'cpp', name: 'C++', val: 8, group: 1 },
                                { id: 'rust', name: 'Rust', val: 8, group: 1 },
                                { id: 'py', name: 'Python', val: 8, group: 1 },
                            ],
                            links: [
                                { source: 'cpp', target: 'rust' }
                            ]
                        }
                    },
                    { id: 'cs_logic', name: 'Mathematical Logic', val: 10, group: 1 },
                    { id: 'cs_arch', name: 'Architecture', val: 10, group: 1 },
                ],
                links: [
                    { source: 'cs_lang', target: 'cs_logic' },
                    { source: 'cs_arch', target: 'cs_lang' }
                ]
            }
        },
        { id: 'math', name: 'Mathematics', group: 2, val: 18, subGraph: GRAPH_DATA_LEVEL_2_MATH },
        { id: 'phys', name: 'Physics', group: 3, val: 15, 
            subGraph: {
                nodes: [
                    { id: 'mech', name: 'Mechanics', val: 10, group: 3 },
                    { id: 'electro', name: 'Electromagnetism', val: 10, group: 3 },
                    { id: 'thermo', name: 'Thermodynamics', val: 10, group: 3 },
                ],
                links: [
                    { source: 'mech', target: 'electro' }
                ]
            }
        },
        { id: 'prog', name: 'Programming Fundamentals', group: 1, val: 12 },
        { id: 'algo', name: 'Algorithms & Data Structures', group: 1, val: 14 },
        { id: 'db', name: 'Databases', group: 1, val: 10 },
        { id: 'os', name: 'Operating Systems', group: 1, val: 10 },
        { id: 'net', name: 'Networking', group: 1, val: 9 },
        { id: 'arch', name: 'Computer Architecture', group: 1, val: 10 },
        { id: 'discrete', name: 'Discrete Math', group: 2, val: 10 },
        { id: 'calc', name: 'Calculus', group: 2, val: 10 },
        { id: 'linear', name: 'Linear Algebra', group: 2, val: 8 },
        { id: 'stats', name: 'Statistics', group: 2, val: 8 },
        { id: 'ai', name: 'Artificial Intelligence', group: 4, val: 14 },
        { id: 'ml', name: 'Machine Learning', group: 4, val: 12 },
        { id: 'dl', name: 'Deep Learning', group: 4, val: 11 },
        { id: 'cv', name: 'Computer Vision', group: 4, val: 9 },
        { id: 'nlp', name: 'Natural Language Processing', group: 4, val: 9 },
        { id: 'quant', name: 'Quantum Computing', group: 3, val: 12 },
        { id: 'bio', name: 'Bioinformatics', group: 5, val: 10 },
        { id: 'chem', name: 'Computational Chemistry', group: 5, val: 9 },
        { id: 'security', name: 'Cybersecurity', group: 1, val: 11 },
        { id: 'web', name: 'Web Development', group: 1, val: 9 },
        { id: 'mobile', name: 'Mobile Dev', group: 1, val: 8 },
        { id: 'cloud', name: 'Cloud Computing', group: 1, val: 10 },
    ],
    links: [
        { source: 'math', target: 'cs' },
        { source: 'math', target: 'phys' },
        { source: 'math', target: 'discrete' },
        { source: 'discrete', target: 'cs' },
        { source: 'cs', target: 'prog' },
        { source: 'prog', target: 'algo' },
        { source: 'algo', target: 'ai' },
        { source: 'math', target: 'calc' },
        { source: 'calc', target: 'phys' },
        { source: 'linear', target: 'ml' },
        { source: 'stats', target: 'ml' },
        { source: 'ml', target: 'dl' },
        { source: 'dl', target: 'cv' },
        { source: 'dl', target: 'nlp' },
        { source: 'cs', target: 'os' },
        { source: 'cs', target: 'db' },
        { source: 'arch', target: 'os' },
        { source: 'os', target: 'net' },
        { source: 'phys', target: 'quant' },
        { source: 'cs', target: 'quant' },
        { source: 'cs', target: 'bio' },
        { source: 'db', target: 'web' },
        { source: 'net', target: 'web' },
        { source: 'net', target: 'security' },
        { source: 'prog', target: 'mobile' },
        { source: 'os', target: 'cloud' },
        { source: 'db', target: 'cloud' },
    ]
};

const groupColors: Record<number, string> = {
    1: '#3b82f6',
    2: '#f59e0b',
    3: '#ef4444',
    4: '#8b5cf6',
    5: '#10b981',
};

const Page = () => {
    const { showToast, ToastComponent } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [mounted, setMounted] = useState(false);
    const [currentData, setCurrentData] = useState<GraphData>(INITIAL_DATA);
    const [history, setHistory] = useState<GraphData[]>([])
    const graphRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [isEditorOpen, setIsEditorOpen] = useState(true);
    const [newLinkSource, setNewLinkSource] = useState("");
    const [newLinkTarget, setNewLinkTarget] = useState("");
    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted || !containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [mounted]);

    const zoomToFit = () => {
        if (graphRef.current) {
            setTimeout(() => {
                graphRef.current.zoomToFit(400, 100)
            }, 100);
        }
    };

    const handleNodeClick = (node: Node) => {
        if (node.subGraph) {
            setHistory(prev => [...prev, currentData]);
            setCurrentData(node.subGraph);
            setSelectedNode(null);
            setSearchTerm("");
            showToast(`Drilling into: ${node.name}`, 'info');
            zoomToFit();
        } else {
            setSelectedNode(node);
            graphRef.current.centerAt(node.x, node.y, 500);
        }
    };

    const goBack = () => {
        if (history.length > 0) {
            const previous = history[history.length - 1];
            if (previous) {
                setHistory(prev => prev.slice(0, -1));
                setCurrentData(previous);
                setSelectedNode(null);
                zoomToFit();
            }
        }
    };

    const addNode = () => {
        const id = `node_${Date.now()}`;
        const newNode: Node = { id, name: 'New Subject', group: 1, val: 10, x: 0, y: 0 };
        setCurrentData(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
        setSelectedNode(newNode);
        showToast("New Subject Added", "success");
    };

    const removeNode = (id: string) => {
        setCurrentData(prev => ({
            nodes: prev.nodes.filter(n => n.id !== id),
            links: prev.links.filter((l: any) => {
                const s = typeof l.source === 'object' ? l.source.id : l.source;
                const t = typeof l.target === 'object' ? l.target.id : l.target;
                return s !== id && t !== id;
            })
        }));
        setSelectedNode(null);
        showToast("Subject Removed", "warning");
    };

    const updateNode = (id: string, updates: Partial<Node>) => {
        setCurrentData(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === id ? { ...n, ...updates } : n) }));
        setSelectedNode((prev) => prev?.id === id ? { ...prev, ...updates } as Node : prev);
    };

    const addLink = () => {
        if (!newLinkSource || !newLinkTarget) return showToast("Select both Source and Target", "error");
        if (newLinkSource === newLinkTarget) return showToast("Source and Target cannot be the same", "error");
        const linkExists = currentData.links.some((l: any) => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            return s === newLinkSource && t === newLinkTarget;
        });
        if (linkExists) return showToast("Relationship already exists", "warning");
        setCurrentData(prev => ({ ...prev, links: [...prev.links, { source: newLinkSource, target: newLinkTarget }] }));
        setNewLinkSource(""); setNewLinkTarget("");
        showToast("Connection Created", "success");
    };

    const filteredNodes = useMemo(() => {
        if (!searchTerm) return currentData.nodes;
        const term = searchTerm.toLowerCase();
        return currentData.nodes.filter(n => n.name.toLowerCase().includes(term));
    }, [searchTerm, currentData]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return currentData;
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        const matchingLinks = currentData.links.filter((l: any) => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            return nodeIds.has(s) && nodeIds.has(t);
        });
        return { nodes: filteredNodes, links: matchingLinks };
    }, [filteredNodes, currentData, searchTerm]);

    if (!mounted) return null;

    return (
        <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
            {ToastComponent}
            
            <SubjectHeader 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                totalNodes={currentData.nodes.length}
                isEditorOpen={isEditorOpen}
                setIsEditorOpen={setIsEditorOpen}
            />

            <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
                {isEditorOpen && (
                    <>
                        <ResizablePanel maxSize={500} minSize={300} defaultSize={300} className="relative overflow-hidden shrink-0">
                            <GraphEditor 
                                selectedNode={selectedNode}
                                currentData={currentData}
                                groupColors={groupColors}
                                addNode={addNode}
                                removeNode={removeNode}
                                updateNode={updateNode}
                                addLink={addLink}
                                newLinkSource={newLinkSource}
                                setNewLinkSource={setNewLinkSource}
                                newLinkTarget={newLinkTarget}
                                setNewLinkTarget={setNewLinkTarget}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle className="bg-border/20" />
                    </>
                )}

                <ResizablePanel className="relative overflow-hidden">
                    <div ref={containerRef} className="h-full w-full bg-[#0a0a0a] relative overflow-hidden">
                        <GraphLegend groupColors={groupColors} />

                        {history.length > 0 && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
                                <Button 
                                    onClick={goBack}
                                    className="rounded-2xl bg-primary/20 hover:bg-primary/40 backdrop-blur-2xl border border-primary/30 text-primary font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180 mr-2" /> 
                                    Back to Level {history.length}
                                </Button>
                            </div>
                        )}

                        <KnowledgeGraph 
                            graphRef={graphRef}
                            filteredData={filteredData}
                            dimensions={dimensions}
                            selectedNode={selectedNode}
                            groupColors={groupColors}
                            handleNodeClick={handleNodeClick}
                        />
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-border/20" />

                <ResizablePanel maxSize={500} minSize={300} defaultSize={400} className="relative overflow-hidden shrink-0">
                    <div className="h-full bg-card/30 backdrop-blur-2xl flex flex-col overflow-hidden border-l border-border/10">
                        {selectedNode ? (
                            <SubjectDetails 
                                selectedNode={selectedNode}
                                historyLength={history.length}
                                setSelectedNode={setSelectedNode}
                                handleNodeClick={handleNodeClick}
                            />
                        ) : (
                            <SubjectDirectory 
                                filteredNodes={filteredNodes}
                                historyLength={history.length}
                                groupColors={groupColors}
                                handleNodeClick={handleNodeClick}
                            />
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default Page;