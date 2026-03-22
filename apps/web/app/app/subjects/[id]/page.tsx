"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { 
    Plus, 
    ArrowLeft, 
    ChevronRight, 
    Hash, 
    Sparkles, 
    Save, 
    Share2, 
    FileText,
    GitBranch,
    Settings,
    Layers,
    Binary
} from "lucide-react"

interface SubNode {
    id: string;
    title: string;
}

const page = () => {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [title, setTitle] = useState("Mathematics")
    const [mainNote, setMainNote] = useState("")
    const [subNodes, setSubNodes] = useState<SubNode[]>([
        { id: '101', title: 'Algebra' },
        { id: '102', title: 'Calculus' },
        { id: '103', title: 'Geometry' }
    ])
    const [newSubTitle, setNewSubTitle] = useState("")
    const [isAddingSub, setIsAddingSub] = useState(false)

    const handleAddSubNode = () => {
        if (!newSubTitle) return
        const newNode = {
            id: Date.now().toString(),
            title: newSubTitle
        }
        setSubNodes([...subNodes, newNode])
        setNewSubTitle("")
        setIsAddingSub(false)
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col">
            
            {/* Toolbar / Header */}
            <div className="h-16 border-b border-zinc-800/50 bg-[#080808]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push('/app/subjects')}
                        className="text-zinc-500 hover:text-zinc-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                        <span>Subjects</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-primary/70">{title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 mr-4 opacity-50">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[8px] font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="h-8 border-zinc-800 bg-zinc-900/50 text-xs gap-2">
                        <Share2 className="w-3.5 h-3.5" />
                        Sync
                    </Button>
                    <Button size="sm" className="h-8 px-4 bg-primary text-white text-xs font-bold gap-2">
                        <Save className="w-3.5 h-3.5" />
                        Save Node
                    </Button>
                    <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full py-12 px-8">
                
                {/* Subject Title & Metadata */}
                <header className="mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                        <Binary className="w-3 h-3 text-primary/60" />
                        Subject Root Node :: {id}
                    </div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-5xl font-black tracking-tighter text-zinc-100 italic">{title}</h1>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Connectivity</span>
                                <span className="text-xl font-black text-emerald-500">High</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SUB-NOTES ZONE (The Nesting Area) */}
                <div className="mb-16 space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3">
                        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            Nested Sub-Nodes / Blocks
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 px-3 py-1 rounded-full bg-zinc-900/50">
                            {subNodes.length} Elements
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {subNodes.map((node) => (
                            <button 
                                key={node.id}
                                onClick={() => router.push(`/app/subjects/${node.id}`)}
                                className="group relative p-4 pr-10 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-primary/50 hover:bg-zinc-900/60 transition-all flex flex-col gap-1 min-w-[140px]"
                            >
                                <Hash className="w-3 h-3 text-zinc-700 absolute top-4 right-4 group-hover:text-primary transition-colors" />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-500">Node</span>
                                <span className="text-sm font-bold text-zinc-300 group-hover:text-zinc-100">{node.title}</span>
                            </button>
                        ))}

                        {isAddingSub ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <Input 
                                    placeholder="Enter block title..." 
                                    className="h-10 w-48 bg-zinc-900/50 border-primary/30 rounded-xl text-xs"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddSubNode()
                                        if (e.key === 'Escape') setIsAddingSub(false)
                                    }}
                                    value={newSubTitle}
                                    onChange={(e) => setNewSubTitle(e.target.value)}
                                />
                                <Button onClick={handleAddSubNode} size="sm" className="h-10 rounded-xl px-4 bg-primary text-white">Add</Button>
                                <Button onClick={() => setIsAddingSub(false)} variant="ghost" size="sm" className="h-10 rounded-xl">Cancel</Button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsAddingSub(true)}
                                className="p-4 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 min-w-[140px] opacity-60 hover:opacity-100"
                            >
                                <Plus className="w-5 h-5 text-zinc-600" />
                                <span className="text-[10px] font-black uppercase text-zinc-600">Split Block</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MAIN EDITOR AREA */}
                <div className="flex-1 flex flex-col space-y-4">
                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        Main Note Content
                    </div>
                    
                    <div className="relative flex-1 group">
                        {/* Background glowing accent */}
                        <div className="absolute inset-0 bg-primary/2 rounded-[2.5rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        
                        <Textarea 
                            placeholder="Start decomposing your thoughts here... Use # to create graph nodes manually or just write markdown."
                            className="flex-1 w-full min-h-[500px] p-10 bg-zinc-900/20 border-zinc-800/50 rounded-[2.5rem] text-zinc-300 text-lg leading-relaxed focus-visible:ring-primary/20 focus-visible:border-primary/30 backdrop-blur-sm transition-all shadow-inner"
                            value={mainNote}
                            onChange={(e) => setMainNote(e.target.value)}
                        />
                        
                        <div className="absolute bottom-6 right-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <span className="flex items-center gap-1 text-primary/60"><Sparkles className="w-3 h-3" /> AI Analysis Ready</span>
                            <span>{mainNote.split(/\s+/).filter(Boolean).length} Words</span>
                            <span>{mainNote.length} Characters</span>
                        </div>
                    </div>
                </div>

                {/* Footer Insight bar */}
                <div className="mt-12 flex items-center justify-between p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                            <GitBranch className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-300">Graph Linkage</p>
                            <p className="text-[10px] text-zinc-600 uppercase font-black">This note is a root for 12 other entities</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-primary">
                        View Connectivity Map
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default page