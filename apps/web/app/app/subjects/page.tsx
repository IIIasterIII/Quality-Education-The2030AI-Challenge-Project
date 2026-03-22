"use client"
import React, { useState } from 'react'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    GitBranch, 
    Network, 
    SquareAsterisk,
    Clock,
    Hash,
    ArrowUpRight,
    Settings2,
    Database,
    Binary
} from "lucide-react"
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

interface NoteNode {
    id: string;
    title: string;
    preview: string;
    nodesCount: number;
    depth: number;
    tags: string[];
    updatedAt: string;
    accentColor: string;
}

const INITIAL_NODES: NoteNode[] = [
    {
        id: '1',
        title: 'Discrete Mathematics',
        preview: 'Hierarchical notes on logic, sets, and graph theory. Decomposes into vectors & matrices.',
        nodesCount: 42,
        depth: 3,
        tags: ['math', 'cs'],
        updatedAt: '2h ago',
        accentColor: '#3b82f6'
    },
    {
        id: '2',
        title: 'Application Architecture',
        preview: 'System design patterns, microservices, and API contracts for the project.',
        nodesCount: 15,
        depth: 2,
        tags: ['dev', 'arch'],
        updatedAt: 'Yesterday',
        accentColor: '#10b981'
    },
    {
        id: '3',
        title: 'Personal Learning Log',
        preview: 'Daily reflections, quick snippets, and thoughts captured for the graph.',
        nodesCount: 128,
        depth: 5,
        tags: ['personal', 'log'],
        updatedAt: 'Just now',
        accentColor: '#f59e0b'
    }
]

const page = () => {
    const [nodes, setNodes] = useState<NoteNode[]>(INITIAL_NODES)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    
    const [newTitle, setNewTitle] = useState('')
    const [newDesc, setNewDesc] = useState('')

    const filteredNodes = nodes.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleCreate = () => {
        if (!newTitle) return;
        
        const newNode: NoteNode = {
            id: Date.now().toString(),
            title: newTitle,
            preview: newDesc,
            nodesCount: 0,
            depth: 0,
            tags: ['new'],
            updatedAt: 'Just now',
            accentColor: '#6366f1'
        }
        
        setNodes([newNode, ...nodes])
        setNewTitle('')
        setNewDesc('')
        setIsCreateOpen(false)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-primary/30 selection:text-primary">
            <div className="max-w-[1200px] mx-auto py-16 px-8">
                
                {/* Minimalist Top Nav/Controls */}
                <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                            <Network className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-zinc-200">Second Brain</h1>
                            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Workspace / Subjects</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                            <Input 
                                placeholder="Universal search..." 
                                className="h-9 w-64 bg-zinc-900/50 border-zinc-800 text-xs rounded-lg pl-9 focus-visible:ring-primary/20 transition-all focus:w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
                            <Settings2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Dashboard Stats / Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <button 
                        onClick={() => setIsCreateOpen(true)}
                        className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 hover:from-primary/10 hover:to-transparent hover:border-primary/30 transition-all text-left group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-200">Capture Thought</h3>
                        <p className="text-[10px] text-zinc-500 mt-1">Initialize a new subject node</p>
                    </button>

                    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <Database className="w-4 h-4 text-zinc-600" />
                            <span className="text-[10px] font-black text-zinc-600 uppercase">Total Nodes</span>
                        </div>
                        <div className="text-2xl font-black mt-2 text-primary/80">
                            {nodes.reduce((acc, curr) => acc + curr.nodesCount, 0)}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <Binary className="w-4 h-4 text-zinc-600" />
                            <span className="text-[10px] font-black text-zinc-600 uppercase">Max Depth</span>
                        </div>
                        <div className="text-2xl font-black mt-2 text-zinc-300">
                            {Math.max(...nodes.map(n => n.depth), 0)}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <Clock className="w-4 h-4 text-zinc-600" />
                            <span className="text-[10px] font-black text-zinc-600 uppercase">Health Index</span>
                        </div>
                        <div className="text-2xl font-black mt-2 text-emerald-500/80">94%</div>
                    </div>
                </div>

                {/* Node Explorer */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <SquareAsterisk className="w-3.5 h-3.5" />
                            Root Subjects
                        </h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
                            <span>Last Sync: 12 minutes ago</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredNodes.map((node) => (
                            <div 
                                key={node.id}
                                className="group relative p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all cursor-pointer"
                            >
                                {/* Vertical Accent Bar */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full opacity-50 transition-all" style={{ backgroundColor: node.accentColor }} />
                                
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-lg font-bold text-zinc-200 group-hover:text-primary transition-colors">{node.title}</h4>
                                                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                                            </div>
                                            <p className="text-xs text-zinc-500 leading-relaxed max-w-[90%]">{node.preview}</p>
                                        </div>
                                        <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition-all">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                                <GitBranch className="w-3.5 h-3.5 text-zinc-700" />
                                                <span>{node.nodesCount} nested nodes</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                                <Hash className="w-3.5 h-3.5 text-zinc-700" />
                                                <span>Level {node.depth}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {node.tags.map(tag => (
                                                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredNodes.length === 0 && (
                        <div className="py-20 text-center text-zinc-600 bg-zinc-900/10 rounded-[2rem] border border-dashed border-zinc-800">
                            <p className="text-sm">No knowledge nodes match your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal - Reused from previous step logic but restyled */}
            <AlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <AlertDialogContent className="max-w-[450px] border-zinc-800 bg-[#0c0c0c] text-zinc-100 rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">New Subject Node</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500 text-xs">
                            Define a new root for your hierarchy. This node can be later expanded into a granular graph.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-6 py-6 border-y border-zinc-800/50 my-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Identifier / Name</Label>
                            <Input 
                                placeholder="e.g. Advanced Calculus" 
                                className="h-11 bg-zinc-900/50 border-zinc-800 focus-visible:ring-primary/20"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Initial Preview</Label>
                            <Textarea 
                                placeholder="Brief context for this node..." 
                                className="min-h-[100px] bg-zinc-900/50 border-zinc-800 focus-visible:ring-primary/20 resize-none"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleCreate}
                            className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/10"
                        >
                            Initialize
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default page