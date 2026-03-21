"use client"
import React from 'react'
import { Search, Hash, ChevronRight } from 'lucide-react'
import { Node } from './types'

interface SubjectDirectoryProps {
    filteredNodes: Node[];
    historyLength: number;
    groupColors: Record<number, string>;
    handleNodeClick: (node: Node) => void;
}

export const SubjectDirectory: React.FC<SubjectDirectoryProps> = ({
    filteredNodes,
    historyLength,
    groupColors,
    handleNodeClick
}) => {
    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 pb-4 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-black uppercase tracking-tighter text-foreground/80">
                    Subjects Directory
                </h3>
                <Hash className="w-5 h-5 text-muted-foreground opacity-30" />
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 space-y-3 no-scrollbar min-h-0 py-5">
                {filteredNodes.length > 0 ? (
                    filteredNodes.map(node => (
                        <div 
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className="group p-4 bg-secondary/20 hover:bg-primary/10 border border-border/40 hover:border-primary/30 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupColors[node.group] || '#737373' }} />
                                <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">
                                    {node.name}
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10">
                        <Search className="w-6 h-6 mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">No matching subjects</p>
                    </div>
                )}
            </div>

            <div className="p-8 pt-4 border-t border-border/40 text-center shrink-0 bg-card/50 mt-auto">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                    Hierarchy: Level {historyLength + 1}
                </p>
            </div>
        </div>
    )
}
