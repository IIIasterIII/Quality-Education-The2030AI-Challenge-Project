"use client"
import React from 'react'
import { Target, GraduationCap, Layers, ChevronRight, X } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Node } from './types'

interface SubjectDetailsProps {
    selectedNode: Node;
    historyLength: number;
    setSelectedNode: (node: Node | null) => void;
    handleNodeClick: (node: Node) => void;
}

export const SubjectDetails: React.FC<SubjectDetailsProps> = ({
    selectedNode,
    historyLength,
    setSelectedNode,
    handleNodeClick
}) => {
    return (
        <div className="flex-1 p-8 space-y-10 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-500 min-h-0">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase">Category {selectedNode.group}</div>
                    {selectedNode.subGraph && (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase flex items-center gap-1">
                            <Layers className="w-3 h-3" /> Expandable
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">{selectedNode.name}</h2>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="h-8 w-8 opacity-20 hover:opacity-100"><X className="w-4 h-4" /></Button>
                </div>
                <div className="h-1.5 w-16 bg-primary rounded-full shadow-lg shadow-primary/20" />
            </div>

            <div className="space-y-4 pt-10 border-t border-border/40 shrink-0">
                {selectedNode.subGraph && 
                    <Button 
                        onClick={() => handleNodeClick(selectedNode)}
                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all gap-2"
                    >
                        Explore Sub-Graph <ChevronRight className="w-4 h-4" />
                    </Button>
                }
            </div>
        </div>
    )
}
