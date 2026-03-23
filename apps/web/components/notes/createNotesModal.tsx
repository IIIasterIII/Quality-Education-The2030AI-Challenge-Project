"use client"
import React, { useState } from 'react'
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogHeader, 
    AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { COLORS, NoteNode } from "@/app/app/notes/types"

interface CreateNotesModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (newNode: NoteNode) => void;
}

export const CreateNotesModal = ({ isOpen, onOpenChange, onConfirm }: CreateNotesModalProps) => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [color, setColor] = useState('#3b82f6')
    const [type, setType] = useState<'normal' | 'math'>('normal')

    const handleCreate = () => {
        if (!title) return;
        
        onConfirm({
            id: Date.now().toString(),
            title,
            preview: desc,
            nodesCount: 0,
            updatedAt: 'Just now',
            accentColor: color,
            type
        })

        // Reset
        setTitle('')
        setDesc('')
        setColor('#3b82f6')
        setType('normal')
        onOpenChange(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[480px] border-zinc-900 bg-[#080808] text-zinc-100 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] pointer-events-none" />
                
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black italic tracking-tight">INITIALIZE SUBJECT</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500 text-xs font-medium border-b border-zinc-900 pb-4">
                        Define the coordinates and aesthetics for your new knowledge node.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-6 py-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Identifier / Title</Label>
                        <Input 
                            placeholder="e.g. Quantum Electrodynamics" 
                            className="h-12 bg-zinc-950/50 border-zinc-900 focus-visible:ring-primary/40 rounded-xl font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Blueprint Type</Label>
                            <div className="flex gap-2 p-1 bg-zinc-950 border border-zinc-900 rounded-xl">
                                <button 
                                    type="button"
                                    onClick={() => setType('normal')}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'normal' ? 'bg-zinc-800 text-zinc-100 shadow-lg shadow-black/50' : 'text-zinc-600 hover:text-zinc-400'}`}
                                >
                                    Normal
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setType('math')}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'math' ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10' : 'text-zinc-600 hover:text-primary/40'}`}
                                >
                                    Math
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Theme Accent</Label>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setColor(c.value)}
                                        className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${color === c.value ? 'border-zinc-100 scale-110' : 'border-transparent scale-100 opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: c.value }}
                                    >
                                        {color === c.value && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Preview Context</Label>
                        <Textarea 
                            placeholder="Describe the focus of this node..." 
                            className="min-h-[100px] bg-zinc-950/50 border-zinc-900 focus-visible:ring-primary/40 rounded-xl resize-none font-medium text-xs leading-relaxed"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                    <AlertDialogCancel className="flex-1 bg-transparent border-zinc-900 hover:bg-zinc-900 text-zinc-500 font-bold h-12 rounded-xl transition-all">
                        Discard
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleCreate}
                        className="flex-2 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        Initialize Graph
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
