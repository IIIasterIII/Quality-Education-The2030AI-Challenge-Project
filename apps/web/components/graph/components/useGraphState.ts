"use client"
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useToast } from '@/components/toast'
import { Node, GraphData } from '@/components/graph/types'
import { getGraphData, updateNoteStats } from '@/app/api/notes'
import { MainGraphData } from '@/app/types/graph'

export const useGraphState = () => {
    const { showToast, ToastComponent } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [mounted, setMounted] = useState(false)
    const [currentData, setCurrentData] = useState<GraphData | null>(null)
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

    const zoomToFit = useCallback(() => {
        if (graphRef.current) {
            setTimeout(() => {
                graphRef.current.zoomToFit(400, 100)
            }, 100)
        }
    }, [])

    const handleNodeClick = useCallback((node: Node) => {
        setSelectedNode(node);
        if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 500);
        }
    }, []);

    useEffect(() => {
        if (selectedNode && !selectedNode.id.startsWith('sub_')) {
            activeNodeIdRef.current = selectedNode.id
            timeSpentRef.current = 0
            const interval = setInterval(() => {
                timeSpentRef.current += 1
            }, 1000)

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

    const handleDrillDown = useCallback((node: Node) => {
        if (node.subGraph) {
            if (currentData) setHistory(prev => [...prev, currentData])
            setCurrentData(node.subGraph)
            setSelectedNode(null);
            setSearchTerm("");
            showToast(`Drilling into: ${node.name}`, 'info');
            zoomToFit();
        }
    }, [currentData, showToast, zoomToFit]);

    const goBack = useCallback(() => {
        if (history.length > 0) {
            const previous = history[history.length - 1];
            if (previous) {
                setHistory(prev => prev.slice(0, -1));
                setCurrentData(previous);
                setSelectedNode(null);
                zoomToFit();
            }
        }
    }, [history, zoomToFit]);

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
    }, [filteredNodes, currentData]);

    const fetchGraphData = useCallback(async () => {
        const data = await getGraphData()
        setGraphData(data || [])
    }, [])

    const handleUpdateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
        setGraphData(prev => prev.map(item => 
            String(item.id) === nodeId ? { ...item, ...updates } as MainGraphData : item
        ));
        
        setCurrentData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                nodes: prev.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n)
            };
        });

        setSelectedNode(prev => {
            if (prev && prev.id === nodeId) return { ...prev, ...updates };
            return prev;
        });
    }, []);

    const handleUpdateSubNote = useCallback((subNoteId: number, updates: { summary: string }) => {
        setGraphData(prev => prev.map(item => ({
            ...item,
            subNotes: (item.subNotes || []).map(sub => 
                sub.id === subNoteId ? { ...sub, ...updates } : sub
            )
        })));

        setCurrentData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                nodes: prev.nodes.map(n => {
                    if (n.subNotes) {
                        return {
                            ...n,
                            subNotes: n.subNotes.map(sub => 
                                sub.id === subNoteId ? { ...sub, ...updates } : sub
                            )
                        }
                    }
                    return n;
                })
            };
        });

        setSelectedNode(prev => {
            if (prev && prev.subNotes) {
                return {
                    ...prev,
                    subNotes: prev.subNotes.map(sub => 
                        sub.id === subNoteId ? { ...sub, ...updates } : sub
                    )
                };
            }
            return prev;
        });
    }, []);

    useEffect(() => {
        fetchGraphData()
    }, [fetchGraphData])

    const groupColors = useMemo(() => {
        const colors: Record<number, string> = {};
        graphData.forEach((item, index) => {
            colors[index + 1] = item.accentColor || '#3b82f6';
        });
        return colors;
    }, [graphData]);

    useEffect(() => {
        if (!graphData || graphData.length === 0) return;

        const nodes: Node[] = graphData.map((item, index) => {
            const existingNode = currentData?.nodes.find(n => n.id === String(item.id));
            return {
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
                x: existingNode?.x ?? (Math.random() - 0.5) * 500,
                y: existingNode?.y ?? (Math.random() - 0.5) * 500,
                subGraph: item.subNotes && item.subNotes.length > 0 ? {
                    nodes: item.subNotes.map(sub => {
                        const existingSub = existingNode?.subGraph?.nodes.find(sn => sn.id === `sub_${sub.id}`);
                        return {
                            id: `sub_${sub.id}`,
                            name: sub.title,
                            val: 8,
                            group: index + 1,
                            x: existingSub?.x ?? (Math.random() - 0.5) * 200,
                            y: existingSub?.y ?? (Math.random() - 0.5) * 200,
                        };
                    }),
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
            };
        });

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

    return {
        state: {
            searchTerm,
            selectedNode,
            mounted,
            currentData,
            graphData,
            history,
            dimensions,
            filteredNodes,
            filteredData,
            groupColors
        },
        actions: {
            setSearchTerm,
            setSelectedNode,
            handleNodeClick,
            handleDrillDown,
            goBack,
            handleUpdateNode,
            handleUpdateSubNote,
            zoomToFit
        },
        refs: {
            graphRef,
            containerRef
        },
        ToastComponent
    }
}
