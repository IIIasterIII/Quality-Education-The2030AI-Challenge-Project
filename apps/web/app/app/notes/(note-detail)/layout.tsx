"use client"
import React from "react"
import { NoteProvider, useNote } from "@/context/NoteContext"
import { KnowledgeSidebar } from "@/components/knowledge-node/KnowledgeSidebar"

const NoteLayoutInner = ({ children }: { children: React.ReactNode }) => {
    const { subNodes, setSubNodes, isAddingSub, setIsAddingSub } = useNote()

    return (
        <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
            <KnowledgeSidebar 
                subNodes={subNodes}
                isAddingSub={isAddingSub}
                setIsAddingSub={setIsAddingSub}
                setSubNodes={setSubNodes}
            />
            {children}
        </div>
    )
}

export default function RootNoteLayout({ children }: { children: React.ReactNode }) {
    return (
        <NoteProvider>
            <NoteLayoutInner>
                {children}
            </NoteLayoutInner>
        </NoteProvider>
    )
}
