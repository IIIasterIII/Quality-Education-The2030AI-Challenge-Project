"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { File, ArrowLeft, Plus } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { SubNode as SubNote } from "./types"
import { createNewSubNote, getSubNotes } from '@/app/api/notes'

interface KnowledgeSidebarProps {
    subNodes: SubNote[];
    isAddingSub: boolean;
    setIsAddingSub: (val: boolean) => void;
    setSubNodes: React.Dispatch<React.SetStateAction<SubNote[]>>;
}

export const KnowledgeSidebar = ({ subNodes, isAddingSub, setIsAddingSub, setSubNodes }: KnowledgeSidebarProps) => {
    const router = useRouter()
    const note_page_id = useParams().id
    const [subNoteTitle, setSubNoteTitle] = useState<string>("")

    const handleAddSubNote = async () => {
        if(!subNoteTitle || !note_page_id || subNodes.some(note => note.title === subNoteTitle)) return
        const res: SubNote | null = await createNewSubNote(note_page_id as string, subNoteTitle)
        if(res) {
            router.push(`${note_page_id}/subnotes/${res.id}`)
            setSubNoteTitle("")
            setIsAddingSub(false)
            setSubNodes((prev: SubNote[]) => [...prev, res])
        }
    }

    useEffect(() => {
        const getSubNotesFunc = async () => {
            if (!note_page_id) return
            const res = await getSubNotes(note_page_id as string)
            if(res) setSubNodes(res)
        }
        getSubNotesFunc()
    }, [note_page_id, setSubNodes])

    return (
        <aside className="w-64 border-r border-zinc-900 bg-[#080808] flex flex-col pt-6 shrink-0">
            <div className="px-6 mb-8">
                <button 
                    onClick={() => {
                        console.log("[SIDEBAR] Navigating back to Subjects");
                        router.push('/app/subjects')
                    }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Subjects
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700 px-3 py-2">Files</div>
                {subNodes.map((node) => (
                    <button 
                        key={node.id}
                        onClick={() => {
                            console.log("[SIDEBAR] Navigating to subnote:", node.title, node.id);
                            router.push(`${note_page_id}/subnotes/${node.id}`)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 group transition-all cursor-pointer"
                    >
                        <File className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors" />
                        <span className="text-sm text-zinc-500 group-hover:text-zinc-200 truncate">{node.title}</span>
                    </button>
                ))}

                {isAddingSub ? (
                    <div className="px-3 py-2">
                        <Input 
                            placeholder="Name..." 
                            className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-300"
                            autoFocus
                            value={subNoteTitle}
                            onChange={(e) => setSubNoteTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') {
                                    console.log("[SIDEBAR] Confirmed new file creation:", subNoteTitle);
                                    handleAddSubNote()
                                }
                                if(e.key === 'Escape') {
                                    console.log("[SIDEBAR] Cancelled new file creation");
                                    setIsAddingSub(false)
                                }
                            }}
                        />
                    </div>
                ) : (
                    <button 
                        onClick={() => {
                            console.log("[SIDEBAR] Initiating new file creation");
                            setIsAddingSub(true)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest">New File</span>
                    </button>
                )}
            </div>
        </aside>
    )
}
