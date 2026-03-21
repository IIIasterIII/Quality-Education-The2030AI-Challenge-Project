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

            <div className="space-y-8">
                <div className="p-6 rounded-3xl bg-secondary/40 border border-border/50 shadow-inner">
                    <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                        Comprehensive overview of {selectedNode.name}. This node encompasses foundational principles in Tier {selectedNode.group} of Subject Domain {historyLength}.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 rounded-3xl border border-border/50 flex items-center gap-4 hover:bg-white/5 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Target className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Relevance</p>
                            <p className="text-lg font-black tracking-tighter uppercase">High Priority</p>
                        </div>
                    </div>
                    <div className="p-5 rounded-3xl border border-border/50 flex items-center gap-4 hover:bg-white/5 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                            <GraduationCap className="w-6 h-6 text-sky-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Skill Level</p>
                            <p className="text-lg font-black tracking-tighter uppercase">Professional</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-10 border-t border-border/40 shrink-0">
                {selectedNode.subGraph ? (
                    <Button 
                        onClick={() => handleNodeClick(selectedNode)}
                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all gap-2"
                    >
                        Explore Sub-Graph <ChevronRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">
                        Generate Roadmap
                    </Button>
                )}
            </div>
        </div>
    )
}
