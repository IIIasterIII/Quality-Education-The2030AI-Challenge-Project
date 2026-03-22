"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Folder, ArrowLeft, Plus } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { SubNode } from "./types"

interface KnowledgeSidebarProps {
    subNodes: SubNode[];
    isAddingSub: boolean;
    newSubTitle: string;
    setIsAddingSub: (val: boolean) => void;
    setNewSubTitle: (val: string) => void;
    handleAddSubNode: () => void;
}

export const KnowledgeSidebar = ({
    subNodes,
    isAddingSub,
    newSubTitle,
    setIsAddingSub,
    setNewSubTitle,
    handleAddSubNode,
}: KnowledgeSidebarProps) => {
    const router = useRouter()

    return (
        <aside className="w-64 border-r border-zinc-900 bg-[#080808] flex flex-col pt-6 shrink-0">
            <div className="px-6 mb-8">
                <button 
                    onClick={() => router.push('/app/subjects')}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Subjects
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700 px-3 py-2">Folders</div>
                {subNodes.map((node) => (
                    <button 
                        key={node.id}
                        onClick={() => router.push(`/app/subjects/${node.id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 group transition-all"
                    >
                        <Folder className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors" />
                        <span className="text-sm text-zinc-500 group-hover:text-zinc-200 truncate">{node.title}</span>
                    </button>
                ))}

                {isAddingSub ? (
                    <div className="px-3 py-2">
                        <Input 
                            placeholder="Name..." 
                            className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-300"
                            autoFocus
                            value={newSubTitle}
                            onChange={(e) => setNewSubTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') handleAddSubNode()
                                if(e.key === 'Escape') setIsAddingSub(false)
                            }}
                        />
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAddingSub(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest">New Folder</span>
                    </button>
                )}
            </div>
        </aside>
    )
}
