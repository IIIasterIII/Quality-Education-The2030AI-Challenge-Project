"use client"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { ChevronRight, Infinity } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useToast } from '@/components/toast'
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph'
import { SubjectDetails } from '@/components/graph/SubjectDetails'
import { SubjectDirectory } from '@/components/graph/SubjectDirectory'
import { GraphLegend } from '@/components/graph/GraphLegend'
import { Node, GraphData } from '@/components/graph/types'
import { getGraphData, updateNoteStats } from '@/app/api/notes'

interface SubNoteData {
    id: number
    title: string
}

interface LinkData {
    source: number
    target: number
    type: string
}

interface MainGraphData {
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

const Page = () => {
    const { showToast, ToastComponent } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [mounted, setMounted] = useState(false)
    const [currentData, setCurrentData] = useState<GraphData | null>()
    const [graphData, setGraphData] = useState<MainGraphData[]>([])
    const [history, setHistory] = useState<GraphData[]>([])
    const graphRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const timeSpentRef = useRef<number>(0)
    const activeNodeIdRef = useRef<string | null>(null)
    useEffect(() => { setMounted(true) }, [])

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

    const zoomToFit = () => { if (graphRef.current) setTimeout(() => { graphRef.current.zoomToFit(400, 100) }, 100) }

    const handleNodeClick = (node: Node) => {
        setSelectedNode(node);
        if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 500);
        }
    };

    // Time Tracking Logic
    useEffect(() => {
        if (selectedNode && !selectedNode.id.startsWith('sub_')) {
            activeNodeIdRef.current = selectedNode.id
            timeSpentRef.current = 0
            const interval = setInterval(() => {
                timeSpentRef.current += 1
            }, 1000)

            // Update last_opened immediately
            updateNoteStats(selectedNode.id, { last_opened: new Date().toISOString() })

            return () => {
                clearInterval(interval)
                if (activeNodeIdRef.current && timeSpentRef.current > 0) {
                    updateNoteStats(activeNodeIdRef.current, { time_spent: timeSpentRef.current })
                }
                activeNodeIdRef.current = null
                timeSpentRef.current = 0
            }
        }
    }, [selectedNode?.id])

    const handleDrillDown = (node: Node) => {
        if (node.subGraph) {
            if (currentData) setHistory(prev => [...prev, currentData])
            setCurrentData(node.subGraph)
            setSelectedNode(null);
            setSearchTerm("");
            showToast(`Drilling into: ${node.name}`, 'info');
            zoomToFit();
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

    const filteredNodes = useMemo(() => {
        if (!currentData) return [];
        const term = searchTerm.toLowerCase();
        return currentData.nodes.filter(n => n.name.toLowerCase().includes(term));
    }, [searchTerm, currentData]);

    const filteredData = useMemo(() => {
        if (!currentData) return { nodes: [], links: [] };
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        const matchingLinks = currentData.links.filter((l: any) => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            return nodeIds.has(s) && nodeIds.has(t);
        });
        return { nodes: filteredNodes, links: matchingLinks };
    }, [filteredNodes, currentData, searchTerm]);

    const fetchGraphData = async () => {
        const data = await getGraphData()
        setGraphData(data || [])
    }

    useEffect(() => {
        fetchGraphData()
    }, [])

    const groupColors = useMemo(() => {
        const colors: Record<number, string> = {};
        graphData.forEach((item, index) => {
            colors[index + 1] = item.accentColor || '#3b82f6';
        });
        return colors;
    }, [graphData]);

    useEffect(() => {
        if (!graphData || graphData.length === 0) return;

        const nodes: Node[] = graphData.map((item, index) => ({
            id: String(item.id),
            name: item.title,
            val: Math.max(item.notesCount * 5, 10),
            group: index + 1,
            complexity: item.complexity,
            time_spent: item.time_spent,
            last_opened: item.last_opened || undefined,
            summary: item.summary || undefined,
            subNotes: item.subNotes,
            notesCount: item.notesCount,
            x: (Math.random() - 0.5) * 500,
            y: (Math.random() - 0.5) * 500,
            subGraph: item.subNotes && item.subNotes.length > 0 ? {
                nodes: item.subNotes.map(sub => ({
                    id: `sub_${sub.id}`,
                    name: sub.title,
                    val: 8,
                    group: index + 1,
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                })),
                links: [
                    ...item.subNotes.map(sub => ({
                        source: String(item.id),
                        target: `sub_${sub.id}`
                    })),
                    ...item.subNotes.flatMap((sub, i) => 
                        item.subNotes.slice(i + 1).map(other => ({
                            source: `sub_${sub.id}`,
                            target: `sub_${other.id}`
                        }))
                    )
                ]
            } : undefined
        }));

        const allLinksSet = new Set<string>();
        const links: any[] = [];

        graphData.forEach(item => {
            if (item.links) {
                item.links.forEach(link => {
                    const sourceId = String(link.source);
                    const targetId = String(link.target);
                    const key = [sourceId, targetId].sort().join('-');
                    if (!allLinksSet.has(key)) {
                        allLinksSet.add(key);
                        links.push({
                            source: sourceId,
                            target: targetId
                        });
                    }
                });
            }
        });

        setCurrentData({ nodes, links });
    }, [graphData]);

    if (!mounted) return null;

    return (
        <div className="h-screen w-full bg-[#050505] overflow-hidden flex flex-col">
            {ToastComponent}
            
            <div className="h-12 border-b border-border/40 bg-background/40 backdrop-blur-md z-100">
                <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Nodes</span>
                            <span className="text-sm font-bold text-white tabular-nums">{graphData.length}</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Research</span>
                            <span className="text-sm font-bold text-white tabular-nums">
                                {graphData.reduce((acc, curr) => acc + (curr.notesCount || 0), 0)}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Study Time</span>
                            <span className="text-sm font-bold text-white tabular-nums">
                                {Math.floor(graphData.reduce((acc, curr) => acc + (curr.time_spent || 0), 0) / 60)}m
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Research Session</span>
                        </div>
                    </div>
                </div>
            </div>

            <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
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
                                key={selectedNode.id}
                                selectedNode={selectedNode}
                                historyLength={history.length}
                                setSelectedNode={setSelectedNode}
                                handleNodeClick={handleDrillDown}
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