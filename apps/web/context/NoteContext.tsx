"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { SubNode } from "@/components/knowledge-node/types"

interface NoteContextType {
    subNodes: SubNode[];
    setSubNodes: React.Dispatch<React.SetStateAction<SubNode[]>>;
    isAddingSub: boolean;
    setIsAddingSub: (val: boolean) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined)

export const NoteProvider = ({ children }: { children: ReactNode }) => {
    const [subNodes, setSubNodes] = useState<SubNode[]>([])
    const [isAddingSub, setIsAddingSub] = useState(false)

    return (
        <NoteContext.Provider value={{ subNodes, setSubNodes, isAddingSub, setIsAddingSub }}>
            {children}
        </NoteContext.Provider>
    )
}

export const useNote = () => {
    const context = useContext(NoteContext)
    if (!context) throw new Error('useNote must be used within a NoteProvider')
    return context
}
