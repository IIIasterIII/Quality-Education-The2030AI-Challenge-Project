import React from 'react'
import { MainGraphData } from './types'

export const GraphHeader = ({ graphData } : { graphData: MainGraphData[]}) => {
    return (
        <div className="h-12 border-b border-border/40 bg-background/40 backdrop-blur-md z-100">
            <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Nodes</span>
                        <span className="text-sm font-bold text-white tabular-nums">{graphData.length}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Research</span>
                        <span className="text-sm font-bold text-white tabular-nums">
                            {graphData.reduce((acc, curr) => acc + (curr.notesCount || 0), 0)}
                        </span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Study Time</span>
                        <span className="text-sm font-bold text-white tabular-nums">
                            {Math.floor(graphData.reduce((acc, curr) => acc + (curr.time_spent || 0), 0) / 60)}m
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Research Session</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
