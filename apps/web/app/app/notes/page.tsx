"use client"
import React, { useEffect, useState } from 'react'
import { getNotes } from "../../api/notes"
import { Input } from "@workspace/ui/components/input"
import { 
    Plus, 
    Search, 
    Binary,
    Network,
    ArrowUpRight
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { NotesCard } from "@/components/notes/notesCard"
import { CreateNotesModal } from "@/components/notes/createNotesModal"
import { EditNotesModal } from "@/components/notes/editNotesModal"
import { DeleteNotesModal } from "@/components/notes/deleteNotesModal"
import { NoteNote } from "@/app/app/notes/types"

const page = () => {
    const router = useRouter()
    const [notes, setNotes] = useState<NoteNote[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [activeNote, setActiveNote] = useState<NoteNote | null>(null)

    useEffect(() => {
        const fetchNotes = async () => {
            const data = await getNotes()
            if (data) setNotes(data)
        }
        fetchNotes()
    }, [])

    const handleCreateConfirm = (newNote: NoteNote) => {
        setNotes([newNote, ...notes])
        setIsCreateOpen(false)
    }

    const handleEditConfirm = (updatedNode: NoteNote) => {
        setNotes(notes.map(n => n.id === updatedNode.id ? updatedNode : n))
        setIsEditOpen(false)
    }

    const handleDeleteConfirm = (id: string) => {
        setNotes(notes.filter(n => n.id !== id))
        setIsDeleteOpen(false)
    }

    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.preview?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-primary/30 selection:text-primary font-sans relative w-full">
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
                        <span>Notes captured: {notes.reduce((acc, curr) => acc + (curr?.notesCount || 0), 0)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10 overflow-y-auto max-h-[calc(100vh-220px)] pr-2 transition-all">
                        {filteredNotes.map((node) => (
                            <NotesCard 
                                key={node.id}
                                node={node}
                                onEdit={(n) => { setActiveNote(n); setIsEditOpen(true); }}
                                onDelete={(n) => { setActiveNote(n); setIsDeleteOpen(true); }}
                                onClick={() => router.push(node.type === 'math' ? `/app/notes/math/${node.id}` : `/app/notes/${node.id}`)}
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
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-transform">
                                                <Plus className="w-4 h-4 text-primary" />
                                            </div>
                                            <h4 className="text-lg font-bold text-zinc-300 group-hover:text-primary transition-colors">Start Project</h4>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Initialize a new subject note.</p>
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

                    {filteredNotes.length === 0 && (
                        <div className="py-20 text-center text-zinc-600 bg-zinc-900/10 rounded-[2rem] border border-dashed border-zinc-800">
                            <p className="text-sm font-medium">No notes found matching "{searchQuery}"</p>
                            <button onClick={() => setSearchQuery('')} className="mt-2 text-xs font-bold text-primary hover:underline">Clear filter</button>
                        </div>
                    )}
                </div>
            </div>

            <CreateNotesModal 
                isOpen={isCreateOpen} 
                onOpenChange={setIsCreateOpen} 
                notes={notes}
                onConfirm={handleCreateConfirm} 
            />

            <EditNotesModal 
                node={activeNote} 
                isOpen={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                onConfirm={handleEditConfirm} 
                notes={notes}
            />

            <DeleteNotesModal 
                node={activeNote} 
                isOpen={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                onConfirm={handleDeleteConfirm} 
            />
        </div>
    )
}

export default page