"use client"
import React from 'react'
import { Infinity, FileText, Anchor as AnchorIcon } from "lucide-react"

interface Anchor {
    id: string;
    text: string;
}

interface UnifiedActionsSidebarProps {
    anchors: Anchor[];
    onScrollToAnchor: (id: string) => void;
    onRunExercise: () => void;
    onAppendPdf: () => void;
    isMathPage?: boolean;
}

export const UnifiedActionsSidebar = ({
    anchors,
    onScrollToAnchor,
    onRunExercise,
    onAppendPdf,
    isMathPage = false
}: UnifiedActionsSidebarProps) => {
    return (
        <aside className="w-72 border-l border-zinc-900 bg-[#050505] flex flex-col h-screen overflow-hidden z-20 shrink-0">
            <div className="flex flex-col gap-10 p-6 pt-12 overflow-y-auto scrollbar-hide h-full">
                {/* System Actions Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Cognito Ops</span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={onRunExercise}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-primary/20 bg-primary/5 text-primary transition-all group/btn border border-primary/10 hover:border-primary/40 shadow-lg shadow-primary/5"
                        >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Infinity className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Logic Lab</span>
                                <span className="text-[8px] font-bold opacity-50 whitespace-nowrap">Verified Exercises</span>
                            </div>
                        </button>

                        <button 
                            onClick={onAppendPdf}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/50 bg-zinc-900/40 text-zinc-400 transition-all group/btn border border-white/5 hover:border-white/10"
                        >
                            <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 border border-white/5">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-start overflow-hidden text-zinc-500 group-hover/btn:text-zinc-300">
                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Knowledge Ingest</span>
                                <span className="text-[8px] font-bold opacity-50 whitespace-nowrap">Import from Documents</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Document Index</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        {anchors.length > 0 ? (
                            anchors.map((anchor) => (
                                <button 
                                    key={anchor.id}
                                    onClick={() => onScrollToAnchor(anchor.id)}
                                    className="w-full flex items-center gap-4 p-2.5 rounded-lg hover:bg-zinc-900/50 text-zinc-500 hover:text-primary transition-all group/nav"
                                >
                                    <div className="w-6 flex items-center justify-center shrink-0">
                                        <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover/nav:bg-primary transition-all duration-500" />
                                    </div>
                                    <span className="text-[11px] font-bold truncate tracking-tight">{anchor.text}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 rounded-xl border border-dashed border-zinc-900 flex flex-col items-center justify-center text-center gap-2">
                                <AnchorIcon className="w-4 h-4 text-zinc-800" />
                                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">No Anchors Set</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Minimalist Note Brand / Status Footer */}
            <div className="p-6 border-t border-zinc-900/50 flex items-center justify-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">Protected Node System</span>
            </div>
        </aside>
    )
}
