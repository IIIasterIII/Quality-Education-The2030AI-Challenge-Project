"use client"
import React from 'react'

interface GraphLegendProps {
    groupColors: Record<number, string>;
}

export const GraphLegend: React.FC<GraphLegendProps> = ({ groupColors }) => {
    return (
        <div className="absolute bottom-5 left-5 z-10 flex flex-wrap gap-2 max-w-md pointer-events-none">
            {Object.entries(groupColors).map(([group, color]) => (
                <div key={group} className="flex items-center gap-2 px-3 py-1.5 bg-background/40 backdrop-blur-md rounded-xl border border-white/5 text-[9px] font-bold uppercase tracking-tight shadow-xl">
                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: color }} />
                    <span className="opacity-90">Category {group === '1' ? 'CS' : group === '2' ? 'Math' : group === '3' ? 'Physics' : group === '4' ? 'AI' : 'Other'}</span>
                </div>
            ))}
        </div>
    )
}
