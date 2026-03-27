"use client"
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable'
import { useParams, useRouter } from 'next/navigation'
import { startStreaming } from '@/components/roadMapsComponents/startStreaming'
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
    DefaultEdgeOptions
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
import { RoadmapNode } from '@/components/roadMapsComponents/RoadmapNode';
import { Button } from '@workspace/ui/components/button';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from '@workspace/ui/components/alert-dialog';
import { Plus, Save, Edit3, Eye, Trash2, Settings2, Undo2, Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { saveChanges, getAllRoadmapData, copyRoadmap } from '@/app/api/roadmap';
import { useToast } from '@/components/toast';
import { useAppSelector } from '@/app/store/hooks';


const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
    style: { 
        stroke: '#71fd64ff',
        strokeWidth: 2,
    },
    markerEnd: {
        type: "arrow",
        color: '#71fd64ff',
    },
};

type Snapshot = {
    nodes: Node[];
    edges: Edge[];
};

const getMissingAncestors = (nodeId: string, nodes: Node[], edges: Edge[], visited = new Set<string>()): Node[] => {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    const missingNodes: Node[] = [];
    const incomingEdges = edges.filter(edge => edge.target === nodeId);
    for (const edge of incomingEdges) {
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (sourceNode) {
            if (!sourceNode.data?.isCompleted) {
                if (!missingNodes.find(m => m.id === sourceNode.id)) missingNodes.push(sourceNode);
            }
            const furtherAncestors = getMissingAncestors(sourceNode.id, nodes, edges, visited);
            for (const anc of furtherAncestors) {
                if (!missingNodes.find(m => m.id === anc.id)) missingNodes.push(anc)
            }
        }
    }
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
    const id = params.id as string
    const router = useRouter()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [topic, setTopic] = useState("")
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const [past, setPast] = useState<Snapshot[]>([]);
    const [owner, setOwner] = useState<number | null>(null);
    const user = useAppSelector((state) => state.user);
    const [isSaving, setIsSaving] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const { showToast, ToastComponent } = useToast();
    const fetchedIdRef = useRef<string | null>(null)
    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!id || id === fetchedIdRef.current) return;
        let active = true;
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const data = await getAllRoadmapData(id);
                if (active && data) {
                    setNodes(data.nodes || []);
                    setEdges(data.edges || []);
                    setOwner(data.user_id || null);
                    fetchedIdRef.current = id;
                }
            } catch (error) {
                console.error("Failed to fetch roadmap:", error);
            } finally {
                if (active) setIsLoading(false);
            }
        };
        loadInitialData();
        return () => { active = false; };
    }, [id]);

    const currentNode = selectedNode ? nodes.find(n => n.id === selectedNode.id) : null;
    
    const takeSnapshot = useCallback(() => {
        setPast(prev => [...prev.slice(-30), { 
            nodes: JSON.parse(JSON.stringify(nodes)), 
            edges: JSON.parse(JSON.stringify(edges)) 
        }]);
    }, [nodes, edges]);
    const handleUndo = useCallback(() => {
        if (past.length === 0) return;
        const lastSnapshot = past[past.length - 1];
        if (lastSnapshot) {
            setNodes(lastSnapshot.nodes);
            setEdges(lastSnapshot.edges);
            setPast(prev => prev.slice(0, -1));
        }
    }, [past]);

    const onNodesChange: OnNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds))
    }, []);

    const onNodeDragStart = useCallback(() => {
        takeSnapshot();
    }, [takeSnapshot]);

    const onEdgesChange: OnEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds))
    }, []);

    const onConnect: OnConnect = useCallback((params: Connection) => { 
        if (!isEditMode) return;
        takeSnapshot();
        setEdges((eds) => addEdge({ ...params, animated: true }, eds)) 
    }, [isEditMode, takeSnapshot]);

    const onNodeClick = useCallback((_: any, node: Node) => { setSelectedNode(node) }, []);
    const onPaneClick = useCallback(() => { setSelectedNode(null) }, []);

    const handleToggleComplete = useCallback((nodeId: string) => {
        const nodeToToggle = nodes.find(n => n.id === nodeId);
        if (!nodeToToggle) return;
        
        takeSnapshot();
        const currentlyCompleted = nodeToToggle.data?.isCompleted;
        if (!currentlyCompleted) {
            const missingNodes = getMissingAncestors(nodeId, nodes, edges);
            if (missingNodes.length > 0) {
                const labels = missingNodes.map(n => n.data.label).join(", ");
                showToast(`You need to complete these steps first: ${labels}`, "warning");
                setPast(prev => prev.slice(0, -1));
                return;
            }
        }
        let nodesToReset: string[] = [];
        if (currentlyCompleted) nodesToReset = getAllDescendantsIds(nodeId, edges);

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
    }, [nodes, edges, takeSnapshot]);

    const addNode = () => {
        takeSnapshot();
        const newNodeId = `node_${Date.now()}`;
        const newNode: Node = {
            id: newNodeId,
            type: 'roadmap',
            position: { x: 100, y: 100 },
            data: { label: 'New Step', description: 'Enter description...', isCompleted: false }
        };
        setNodes((nds) => nds.concat(newNode));
        setSelectedNode(newNode);
    };

    const deleteNode = () => {
        if (!selectedNode) return;
        takeSnapshot();
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setSelectedNode(null);
    };

    const updateNodeData = (field: string, value: any) => {
        if (!selectedNode) return;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: { ...node.data, [field]: value },
                    };
                }
                return node;
            })
        );
    };

    const onEditFocus = () => takeSnapshot();

    const saveToServer = async () => {
        if (!id) return;
        setIsSaving(true);
        try {
            console.log("SAVING TO BACKEND...");
            const data = await saveChanges(id, nodes, edges);
            if (data) {
                setPast([]); 
                setIsEditMode(false);
                showToast("Roadmap saved successfully!", "success");
            }
        } catch (err) {
            showToast("Failed to save changes.", "error");
        } finally {

            setIsSaving(false);
        }
    };

    const discardChanges = () => {
        setShowConfirmReset(true);
    };

    const handleActualReset = () => {
        fetchedIdRef.current = null;
        window.location.reload(); 
    };


    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true)
        setStreamingText("")
        takeSnapshot();
        try {
            await startStreaming(
                topic,
                nodes,
                edges,
                (content: string) => setStreamingText(content),
                (fullContent: string) => {
                    console.log("FULL AI CONTENT:", fullContent);
                    try {
                        const parsed = JSON.parse(fullContent);
                        console.log("PARSED AI JSON:", parsed);
                        if (parsed.nodes) {
                            setNodes((prev) => {
                                const nodeMap = new Map(prev.map(n => [n.id, n]));
                                parsed.nodes.forEach((newNode: Node) => {
                                    if (!newNode.position) {
                                        newNode.position = { x: 500, y: (prev.length * 100) + 500 };
                                    }
                                    if (!newNode.data) newNode.data = {};
                                    if (newNode.data.isCompleted === undefined) {
                                        newNode.data.isCompleted = false;
                                    }
                                    nodeMap.set(newNode.id, newNode);
                                });

                                return Array.from(nodeMap.values());
                            });
                        }
                        if (parsed.edges) {
                            setEdges((prev) => {
                                const edgeMap = new Map(prev.map(e => [e.id, e]));
                                parsed.edges.forEach((newEdge: Edge) => {
                                    edgeMap.set(newEdge.id, newEdge);
                                });
                                return Array.from(edgeMap.values());
                            });
                        }
                        setStreamingText(""); 
                    } catch (e) {
                        console.error("Failed to parse AI response:", e);
                    }
                }
            );
        } catch (err) {
            console.error("Streaming failed:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async () => {
        setIsCopying(true);
        try {
            const result = await copyRoadmap(id);
            if (result && result.new_id) {
                showToast("Roadmap copied to your profile!", "success");
                router.push(`/app/roadmaps/${result.new_id}`);
            } else {
                showToast("Failed to copy roadmap.", "error");
            }
        } catch (err) {
            showToast("Something went wrong while copying.", "error");
        } finally {
            setIsCopying(false);
        }
    };

    if (!mounted) return null;

    return (
        <ResizablePanelGroup orientation="horizontal" className="h-screen w-full bg-background transition-all duration-500">
            {ToastComponent}
            {user.id === owner ? (
                <ResizablePanel minSize={200} maxSize={350} defaultSize="20%">

                <div className="flex h-full flex-col p-6 border-r border-white/10 bg-card/40 backdrop-blur-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground/50">Navigator</h2>
                        <Settings2 className="w-4 h-4 text-muted-foreground/30 hover:text-primary transition-colors cursor-pointer" />
                    </div>

                    <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar pb-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner group transition-colors hover:border-white/10">
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Current Roadmap</p>
                            <p className="text-xs font-mono truncate text-primary/80">ID: {id}</p>
                        </div>

                        <div className='flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/5'>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">AI Architect</p>
                            <Input
                                placeholder="Topic (e.g. Python basics)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="h-9 rounded-lg bg-black/40 border-white/10 text-xs focus-visible:ring-primary/20"
                            />
                            <Button 
                                onClick={handleGenerate} 
                                disabled={!topic || isGenerating}
                                className="w-full h-9 gap-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-bold text-xs transition-all shadow-lg shadow-primary/10"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCcw className={`w-4 h-4 ${streamingText ? 'animate-spin' : ''}`} />
                                )}
                                {isGenerating 
                                    ? (streamingText ? 'Generating...' : 'Connecting...') 
                                    : 'Generate with AI'}
                            </Button>

                        </div>


                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Display Mode</p>
                            <div className="flex p-1 bg-secondary/40 rounded-xl border border-border/50">
                                <button 
                                    onClick={() => setIsEditMode(false)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${!isEditMode ? 'bg-background shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Eye className="w-3.5 h-3.5" /> View
                                </button>
                                <button 
                                    onClick={() => setIsEditMode(true)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isEditMode ? 'bg-background shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                            </div>
                        </div>

                        {isEditMode && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">History</p>
                                    <Button variant="outline" size="sm" onClick={handleUndo} disabled={past.length === 0} className="w-full gap-2 rounded-xl border-primary/20">
                                        <Undo2 className="w-4 h-4" /> Undo ({past.length})
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Canvas Actions</p>
                                    <Button variant="outline" size="sm" onClick={addNode} className="w-full gap-2 rounded-xl border-dashed border-2">
                                        <Plus className="w-4 h-4" /> Add Step
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={deleteNode} disabled={!selectedNode} className="w-full gap-2 rounded-xl text-destructive hover:bg-destructive/5">
                                        <Trash2 className="w-4 h-4" /> Delete selected
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        {isEditMode ? (
                            <div className="space-y-3">
                                <Button onClick={saveToServer} disabled={isSaving} className="w-full h-11 gap-2 rounded-lg bg-white text-black hover:bg-white/90 font-bold text-xs transition-all">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Protocol
                                </Button>
                                <Button variant="ghost" onClick={discardChanges} className="w-full text-[10px] text-muted-foreground hover:text-white font-bold h-8">Discard unsaved</Button>
                            </div>
                        ) : (
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                                <p className="text-[10px] text-primary font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                                    <Eye className="w-3 h-3" /> View Mode Active
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                </ResizablePanel>
            ) : (
                <div className="absolute top-6 left-6 z-50 animate-in slide-in-from-left-4 duration-500">
                    <Button 
                        onClick={handleCopy} 
                        disabled={isCopying}
                        className="gap-2.5 h-11 px-6 rounded-xl bg-primary text-black font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {isCopying ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        Copy to My Space
                    </Button>
                </div>
            )}
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize="60%" className="h-screen">
                <div className="h-full w-full relative bg-background/50">
                    {streamingText && (
                        <div className="absolute top-6 right-6 z-20 max-w-xs w-full p-4 bg-background/90 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase text-primary animate-pulse">AI Thinking...</span>
                                <Loader2 className="w-3 h-3 text-primary animate-spin" />
                            </div>
                            <div className="max-h-[150px] overflow-y-auto no-scrollbar">
                                <p className="text-[9px] font-mono text-muted-foreground leading-tight whitespace-pre-wrap">
                                    {streamingText}
                                </p>
                            </div>
                        </div>
                    )}

                    {isLoading ? (

                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <RefreshCcw className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                            </div>
                            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-primary/60 animate-pulse">Building Roadmap...</p>
                        </div>
                    ) : (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onPaneClick={onPaneClick}
                            onNodeDragStart={onNodeDragStart}
                            nodeTypes={{ roadmap: RoadmapNode }}
                            defaultEdgeOptions={defaultEdgeOptions}
                            colorMode={resolvedTheme as 'light' | 'dark' | 'system'}
                            nodesDraggable={isEditMode}
                            nodesConnectable={isEditMode}
                            fitView
                        >
                            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255, 255, 255, 0.05)" />
                        </ReactFlow>
                    )}
                </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel minSize={250} maxSize={450} defaultSize="25%">
                <div className="flex h-full flex-col p-6 border-l border-white/10 bg-card/40 backdrop-blur-2xl shrink-0">
                    <h2 className="text-sm font-bold tracking-widest mb-10 uppercase text-muted-foreground/50">Information</h2>
                    
                    {currentNode ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto no-scrollbar pb-6">
                            {isEditMode ? (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Step Title</label>
                                        <Input 
                                            value={currentNode.data.label as string} 
                                            onFocus={onEditFocus}
                                            onChange={(e) => updateNodeData('label', e.target.value)}
                                            className="h-10 rounded-lg border-white/10 bg-black/40 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Description</label>
                                        <Textarea 
                                            value={currentNode.data.description as string || ''} 
                                            onFocus={onEditFocus}
                                            onChange={(e) => updateNodeData('description', e.target.value)}
                                            className="rounded-lg border-white/10 bg-black/40 text-sm focus-visible:ring-primary/20 min-h-[160px] resize-none leading-relaxed p-4"
                                        />
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] space-y-2">
                                        <p className="font-bold text-muted-foreground/40 uppercase tracking-widest">System Metadata</p>
                                        <div className="flex justify-between"><span>Node ID</span><span className="font-mono opacity-60">{currentNode.id}</span></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-bold tracking-tight text-foreground">{currentNode.data.label as string}</h3>
                                        <div className="h-0.5 w-12 bg-primary/40 rounded-full" />
                                    </div>
                                    
                                    <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {currentNode.data.description as string || 'No additional details provided for this protocol step.'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                            <p className="text-[9px] uppercase font-bold text-muted-foreground/40 tracking-widest mb-1">Status</p>
                                            <p className={`text-xs font-bold uppercase ${currentNode.data.isCompleted ? 'text-green-500' : 'text-primary'}`}>
                                                {currentNode.data.isCompleted ? 'Completed' : 'Pending'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                            <p className="text-[9px] uppercase font-bold text-muted-foreground/40 tracking-widest mb-1">Complexity</p>
                                            <p className="text-xs font-bold uppercase text-muted-foreground/60">Tier 2</p>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={() => handleToggleComplete(currentNode.id)}
                                        className={`w-full h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 border
                                            ${currentNode.data.isCompleted 
                                                ? 'bg-transparent border-green-500/50 text-green-500 hover:bg-green-500/5' 
                                                : 'bg-primary text-black border-transparent hover:bg-primary/90 shadow-lg shadow-primary/20'}`}
                                    >
                                        {currentNode.data.isCompleted ? 'Reset Protocol Step' : 'Confirm Step Protocol'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/2">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                                <Settings2 className="w-6 h-6 text-muted-foreground/30 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 max-w-[160px] leading-relaxed">
                                Select a protocol node to view properties
                            </p>
                        </div>
                    )}
                </div>
            </ResizablePanel>

            <AlertDialog open={showConfirmReset} onOpenChange={setShowConfirmReset}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                            </div>
                            <AlertDialogTitle className="text-xl font-black uppercase tracking-tight">Wait! Reset changes?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm font-medium opacity-70">
                            This will permanently PERASE all current progress and unsaved modifications. This action cannot be undone. Are you absolutely sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl border-border/50 font-bold">Nevermind</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleActualReset}
                            className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-xl shadow-rose-500/20"
                        >
                            YES, RESET EVERYTHING
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ResizablePanelGroup>

    )
}

export default page