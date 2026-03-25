import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { File, ArrowLeft, Plus, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { SubNode as SubNote } from "./types"
import { createNewSubNote, getSubNotes, deleteSubNote, editSubNote } from '@/app/api/notes'

interface KnowledgeSidebarProps {
    subNodes: SubNote[];
    isAddingSub: boolean;
    setIsAddingSub: (val: boolean) => void;
    setSubNodes: React.Dispatch<React.SetStateAction<SubNote[]>>;
}

export const KnowledgeSidebar = ({ subNodes, isAddingSub, setIsAddingSub, setSubNodes }: KnowledgeSidebarProps) => {
    const router = useRouter()
    const params = useParams()
    const note_page_id = params.id as string
    const note_page_uid = params.uid as string
    
    const [subNoteTitle, setSubNoteTitle] = useState<string>("")
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState<string>("")
    
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleAddSubNote = async () => {
        if(!subNoteTitle || !note_page_id || subNodes.some(note => note.title === subNoteTitle)) return
        const res: SubNote | null = await createNewSubNote(note_page_id, subNoteTitle)
        if(res) {
            router.push(`/app/notes/${note_page_id}/subnotes/${res.id}`)
            setSubNoteTitle("")
            setIsAddingSub(false)
            setSubNodes((prev: SubNote[]) => [...prev, res])
        }
    }

    const handleDelete = async (e: React.MouseEvent, subnote_id: string) => {
        e.stopPropagation()
        if (!window.confirm("Delete this file?")) return
        const success = await deleteSubNote(note_page_id, subnote_id)
        if (success) {
            setSubNodes(prev => prev.filter(n => String(n.id) !== String(subnote_id)))
            if (note_page_uid === subnote_id) router.push(`/app/notes/${note_page_id}`)
        }
        setOpenMenuId(null)
    }

    const startEditing = (e: React.MouseEvent, node: SubNote) => {
        e.stopPropagation()
        setEditingId(String(node.id))
        setEditValue(node.title)
        setOpenMenuId(null)
    }

    const saveEdit = async () => {
        if (!editingId || !editValue.trim()) return
        const res = await editSubNote(note_page_id, editingId, editValue)
        if (res) {
            setSubNodes(prev => prev.map(n => String(n.id) === editingId ? { ...n, title: editValue } : n))
        }
        setEditingId(null)
    }

    useEffect(() => {
        const getSubNotesFunc = async () => {
            if (!note_page_id) return
            const res = await getSubNotes(note_page_id)
            if(res) setSubNodes(res)
        }
        getSubNotesFunc()
    }, [note_page_id, setSubNodes])

    return (
        <aside className="w-64 border-r border-zinc-900 bg-[#080808] flex flex-col pt-6 shrink-0 z-40">
            {note_page_uid && <div className="px-6 mb-8">
                <button 
                    onClick={() => router.push(`/app/notes/${note_page_id}`)}
                    className="flex cursor-pointer items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Parent
                </button>
            </div>}

            <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700 px-3 py-2">SubNotes</div>
                
                {subNodes.map((node) => (
                    <div key={node.id} className="relative group">
                        {editingId === String(node.id) ? (
                            <div className="px-3 py-1">
                                <Input 
                                    className="h-8 text-xs bg-zinc-900 border-primary/30 text-zinc-200"
                                    value={editValue}
                                    autoFocus
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={saveEdit}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEdit()
                                        if (e.key === 'Escape') setEditingId(null)
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => router.push(`/app/notes/${note_page_id}/subnotes/${node.id}`)}
                                    className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${String(note_page_uid) === String(node.id) ? 'bg-primary/10 text-primary' : 'hover:bg-zinc-900 text-zinc-500'}`}
                                >
                                    <File className={`w-3.5 h-3.5 ${String(note_page_uid) === String(node.id) ? 'text-primary' : 'text-zinc-700'}`} />
                                    <span className={`text-xs font-bold truncate ${String(note_page_uid) === String(node.id) ? 'text-zinc-100' : ''}`}>{node.title}</span>
                                </button>
                                
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === String(node.id) ? null : String(node.id)) }}
                                        className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-600 hover:text-zinc-300"
                                    >
                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {openMenuId === String(node.id) && (
                            <div 
                                ref={menuRef}
                                className="absolute right-0 mt-1 w-32 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in duration-200"
                                style={{ top: '100%' }}
                            >
                                <button 
                                    onClick={(e) => startEditing(e, node)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                                >
                                    <Edit className="w-3 h-3" />
                                    Rename
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(e, String(node.id))}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <div className="pt-4 mt-4 border-t border-zinc-900/50">
                    {isAddingSub ? (
                        <div className="px-3 py-2">
                            <Input 
                                placeholder="New file name..." 
                                className="h-9 text-xs bg-zinc-900 border-zinc-800 text-zinc-300 rounded-xl"
                                autoFocus
                                value={subNoteTitle}
                                onChange={(e) => setSubNoteTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') handleAddSubNote()
                                    if(e.key === 'Escape') setIsAddingSub(false)
                                }}
                            />
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsAddingSub(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 transition-all border border-dashed border-zinc-900 hover:border-zinc-800"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">New Subnote</span>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    )
}
