"use client"
import { NoteNote } from "@/app/app/notes/types";
import { GitBranch, Pencil, Trash2 } from "lucide-react"
import React from 'react'

interface NotesCardProps {
    node: NoteNote;
    onEdit: (node: NoteNote) => void;
    onDelete: (node: NoteNote) => void;
    onClick: () => void;
}

export const NotesCard = ({ node, onEdit, onDelete, onClick }: NotesCardProps) => {
    return (
        <div 
            onClick={onClick}
            className="group relative p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden"
        >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full opacity-50 transition-all" style={{ backgroundColor: node.accentColor }} />
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-zinc-200 group-hover:text-primary transition-colors">{node.title}</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-[90%] line-clamp-2">{node.preview}</p>
                    </div>
                    <div className="flex gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(node); }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 cursor-pointer text-zinc-600 hover:text-primary transition-all"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(node); }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer text-zinc-600 hover:text-red-500 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                            <GitBranch className="w-3.5 h-3.5 text-zinc-700" />
                            <span>{node.notesCount}</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[9px] font-black uppercase text-zinc-500">
                            {node.type || 'normal'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
