"use client"
import React, { useState, useEffect } from 'react'
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
import { COLORS, NoteNode } from "@/app/app/subjects/types"

interface EditSubjectModalProps {
    node: NoteNode | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (updatedNode: NoteNode) => void;
}

export const EditSubjectModal = ({ node, isOpen, onOpenChange, onConfirm }: EditSubjectModalProps) => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [color, setColor] = useState('#3b82f6')

    useEffect(() => {
        if (node) {
            setTitle(node.title)
            setDesc(node.preview)
            setColor(node.accentColor)
        }
    }, [node])

    const handleUpdate = () => {
        if (!node || !title) return;
        
        onConfirm({
            ...node,
            title,
            preview: desc,
            accentColor: color,
            updatedAt: 'Updated'
        })
        onOpenChange(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[480px] border-zinc-900 bg-[#080808] text-zinc-100 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] pointer-events-none" />
                
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black italic tracking-tight">EDIT SUBJECT</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500 text-xs font-medium border-b border-zinc-900 pb-4">
                        Modify the parameters of your existing knowledge node.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-6 py-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Identifier / Title</Label>
                        <Input 
                            placeholder="Edit title..." 
                            className="h-12 bg-zinc-950/50 border-zinc-900 focus-visible:ring-primary/40 rounded-xl font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Theme Accent</Label>
                            <div className="flex flex-wrap gap-4 pt-1">
                                {COLORS.map((c) => (
                                    <button
                                        type="button"
                                        key={c.value}
                                        onClick={() => setColor(c.value)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${color === c.value ? 'border-zinc-100 scale-110 shadow-lg' : 'border-transparent scale-100 opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: c.value }}
                                    >
                                        {color === c.value && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Preview Context</Label>
                        <Textarea 
                            placeholder="Modify description..." 
                            className="min-h-[100px] bg-zinc-950/50 border-zinc-900 focus-visible:ring-primary/40 rounded-xl resize-none font-medium text-xs leading-relaxed"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                    <AlertDialogCancel className="flex-1 bg-transparent border-zinc-900 hover:bg-zinc-900 text-zinc-500 font-bold h-12 rounded-xl transition-all">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleUpdate}
                        className="flex-2 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        Save Changes
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
