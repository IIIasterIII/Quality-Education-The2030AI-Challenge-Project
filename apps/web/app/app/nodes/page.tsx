"use client"
import React, { useState } from 'react'
import { Input } from "@workspace/ui/components/input"
import { 
    Plus, 
    Search, 
    Binary,
    Network,
    ArrowUpRight
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { NodesCard } from "@/components/nodes/nodesCard"
import { CreateNodesModal } from "@/components/nodes/createNodesModal"
import { EditNodesModal } from "@/components/nodes/editNodesModal"
import { DeleteNodesModal } from "@/components/nodes/deleteNodesModal"
import { NoteNode } from "@/app/app/nodes/types"

const INITIAL_NODES: NoteNode[] = [
    {
        id: '1',
        title: 'Discrete Mathematics',
        preview: 'Hierarchical notes on logic, sets, and graph theory. Decomposes into vectors & matrices.',
        nodesCount: 42,
        updatedAt: '2h ago',
        accentColor: '#3b82f6',
        type: 'math'
    },
    {
        id: '2',
        title: 'Application Architecture',
        preview: 'System design patterns, microservices, and API contracts for the project.',
        nodesCount: 15,
        updatedAt: 'Yesterday',
        accentColor: '#10b981',
        type: 'normal'
    },
    {
        id: '3',
        title: 'Personal Learning Log',
        preview: 'Daily reflections, quick snippets, and thoughts captured for the graph.',
        nodesCount: 128,
        updatedAt: 'Just now',
        accentColor: '#f59e0b',
        type: 'normal'
    },
    {
        id: '11',
        title: 'Graph Theory Foundations',
        preview: 'Core concepts of vertex connectivity, paths, and cycles in unweighted graphs.',
        nodesCount: 28,
        updatedAt: '3h ago',
        accentColor: '#3b82f6',
        type: 'math'
    },
    {
        id: '22',
        title: 'Cloud Infrastructure',
        preview: 'Kubernetes orchestration, VPC peering and security group configuration.',
        nodesCount: 22,
        updatedAt: '3 days ago',
        accentColor: '#10b981',
        type: 'normal'
    },
    {
        id: '33',
        title: 'Research Methodology',
        preview: 'Qualitative analysis patterns and literature review structures.',
        nodesCount: 45,
        updatedAt: 'Last week',
        accentColor: '#f59e0b',
        type: 'normal'
    }
]

const page = () => {
    const router = useRouter()
    const [nodes, setNodes] = useState<NoteNode[]>(INITIAL_NODES)
    const [searchQuery, setSearchQuery] = useState('')
    
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [activeNode, setActiveNode] = useState<NoteNode | null>(null)

    const handleCreateConfirm = (newNode: NoteNode) => {
        setNodes([newNode, ...nodes])
        setIsCreateOpen(false)
    }

    const handleEditConfirm = (updatedNode: NoteNode) => {
        setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n))
        setIsEditOpen(false)
    }

    const handleDeleteConfirm = (id: string) => {
        setNodes(nodes.filter(n => n.id !== id))
        setIsDeleteOpen(false)
    }

    const filteredNodes = nodes.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.preview.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-primary/30 selection:text-primary font-sans relative">
            <div className="max-w-[1200px] mx-auto pt-5 px-4">
                <div className="flex items-center justify-between mb-16 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                        placeholder="Search your knowledge graph..." 
                        className="h-10 w-64 bg-zinc-900/40 border-zinc-800 text-sm rounded-xl pl-10 focus-visible:ring-primary/20 transition-all focus:w-80"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="text-sm font-bold text-zinc-500 flex items-center gap-3">
                        <Binary className="w-5 h-5 text-primary opacity-60" />
                        <span>Nodes captured: {nodes.reduce((acc, curr) => acc + curr.nodesCount, 0)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                        {filteredNodes.map((node) => (
                            <NodesCard 
                                key={node.id}
                                node={node}
                                onEdit={(n) => { setActiveNode(n); setIsEditOpen(true); }}
                                onDelete={(n) => { setActiveNode(n); setIsDeleteOpen(true); }}
                                onClick={() => router.push(node.type === 'math' ? `/app/nodes/math/${node.id}` : `/app/nodes/${node.id}`)}
                            />
                        ))}

                        <div 
                            onClick={() => setIsCreateOpen(true)}
                            className="group relative p-6 rounded-2xl border-2 border-dashed border-zinc-800/50 bg-zinc-900/10 hover:bg-primary/5
                             hover:border-primary/30 transition-all cursor-pointer flex flex-col justify-between min-h-[160px]"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Plus className="w-4 h-4 text-primary" />
                                            </div>
                                            <h4 className="text-lg font-bold text-zinc-300 group-hover:text-primary transition-colors">Start Project</h4>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Initialize a new subject node.</p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-primary transition-colors" />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-primary/70 transition-colors">
                                        <Network className="w-3.5 h-3.5" />
                                        <span>New Subject</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredNodes.length === 0 && (
                        <div className="py-20 text-center text-zinc-600 bg-zinc-900/10 rounded-[2rem] border border-dashed border-zinc-800">
                            <p className="text-sm font-medium">No projects found matching "{searchQuery}"</p>
                            <button onClick={() => setSearchQuery('')} className="mt-2 text-xs font-bold text-primary hover:underline">Clear filter</button>
                        </div>
                    )}
                </div>
            </div>

            <CreateNodesModal 
                isOpen={isCreateOpen} 
                onOpenChange={setIsCreateOpen} 
                onConfirm={handleCreateConfirm} 
            />

            <EditNodesModal 
                node={activeNode} 
                isOpen={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                onConfirm={handleEditConfirm} 
            />

            <DeleteNodesModal 
                node={activeNode} 
                isOpen={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                onConfirm={handleDeleteConfirm} 
            />
        </div>
    )
}

export default page