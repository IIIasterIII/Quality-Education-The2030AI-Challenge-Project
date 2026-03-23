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
import { NoteNode } from "@/app/app/notes/types"

interface DeleteNotesModalProps {
    node: NoteNode | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (nodeId: string) => void;
}

export const DeleteNotesModal = ({ node, isOpen, onOpenChange, onConfirm }: DeleteNotesModalProps) => {
    const [confirmName, setConfirmName] = useState('')

    const handleConfirm = () => {
        if (!node || confirmName !== node.title) return;
        onConfirm(node.id)
        setConfirmName('')
        onOpenChange(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[480px] border-red-900/50 bg-[#0a0505] text-zinc-100 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[80px] pointer-events-none" />
                
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black italic tracking-tight text-red-500">TERMINATE SUBJECT</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500 text-xs font-medium border-b border-red-900/20 pb-4">
                        This action is irreversible. All associated data within this node will be purged.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-6 py-6">
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-[10px] leading-relaxed text-red-200/60 uppercase font-bold tracking-widest">
                        To confirm the deletion of <span className="text-red-500">"{node?.title}"</span>, please type the project name below.
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Confirmation Required</Label>
                        <Input 
                            placeholder="Type project name..." 
                            className="h-12 bg-zinc-950/50 border-zinc-900 focus-visible:ring-red-500/40 rounded-xl font-medium text-red-500 placeholder:text-zinc-800"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                    <AlertDialogCancel className="flex-1 bg-transparent border-zinc-900 hover:bg-zinc-800 text-zinc-500 font-bold h-12 rounded-xl transition-all">
                        Abort
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={(e) => {
                            if (confirmName !== node?.title) {
                                e.preventDefault();
                                return;
                            }
                            handleConfirm();
                        }}
                        disabled={confirmName !== node?.title}
                        className={`flex-2 font-black uppercase tracking-widest h-12 rounded-xl transition-all shadow-2xl ${
                            confirmName === node?.title 
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20' 
                            : 'bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50'
                        }`}
                    >
                        Confirm Termination
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
