"use client"
import React, { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Maximize2, Minimize2, Trash2, Plus, FunctionSquare } from 'lucide-react'

// Dynamic import with no SSR for Plotly
const Plot = dynamic(() => import('react-plotly.js'), { 
    ssr: false,
    loading: () => <div className="w-full h-[500px] flex items-center justify-center bg-zinc-900 rounded-3xl border border-zinc-800 animate-pulse text-zinc-600">Loading Plotly Engines...</div>
}) as any;

interface MathWorkbenchProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MathWorkbench = ({ isOpen, onClose }: MathWorkbenchProps) => {
    const [formulas, setFormulas] = useState<string[]>(['m * x + q'])
    const [range, setRange] = useState({ min: -10, max: 10, steps: 200 })
    const [params, setParams] = useState<Record<string, number>>({ m: 1, q: 0 })
    const [hoverPoints, setHoverPoints] = useState<{ name: string, x: number, y: number, color: string }[]>([])

    // Reserved words that are NOT variables
    const reserved = new Set(['x', 'sin', 'cos', 'tan', 'sqrt', 'log', 'exp', 'pow', 'abs', 'PI', 'E', 'Math', 'a', 'b', 'c'])

    // Extract custom variables from formulas
    const discoveredVars = useMemo(() => {
        const vars = new Set<string>()
        formulas.forEach(f => {
            const matches = f.match(/\b[a-z]\w*\b/g)
            matches?.forEach(v => {
                if (!reserved.has(v)) vars.add(v)
            })
        })
        return Array.from(vars).sort()
    }, [formulas])

    // Keep params in sync with discovered variables
    useMemo(() => {
        const newParams = { ...params }
        let changed = false
        discoveredVars.forEach(v => {
            if (!(v in newParams)) {
                newParams[v] = 1
                changed = true
            }
        })
        if (changed) setParams(newParams)
    }, [discoveredVars])

    // Pre-compiled functions for better performance
    // Only re-compiles when the formula text changes
    const compiledFunctions = useMemo(() => {
        return formulas.map(rawFormula => {
            try {
                // Pre-extract common functions once
                const mathScope = `const { sin, cos, tan, sqrt, log, exp, pow, abs, PI, E } = Math;`
                // Create a function that takes both x and the current params object
                return new Function('x', 'p', `
                    ${mathScope}
                    // Destructure all params from p
                    const { ${Object.keys(params).join(', ') || 'unused'} } = p;
                    try { return ${rawFormula}; } catch(e) { return 0; }
                `)
            } catch (e) {
                return () => 0
            }
        })
    }, [formulas, Object.keys(params).join(',')])

    const plotData = useMemo(() => {
        try {
            return formulas.map((_, idx) => {
                const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
                const color = colors[idx % colors.length]
                const f = compiledFunctions[idx]
                if (!f) return { x: [], y: [], type: 'scatter', name: `f${idx + 1}` }

                const x = []
                const y = []
                const step = (range.max - range.min) / range.steps
                
                for (let i = 0; i <= range.steps; i++) {
                    const xv = range.min + i * step
                    x.push(xv)
                    try { 
                        // High-speed evaluation: pass current params object p
                        y.push(f(xv, params)) 
                    } catch(e) { 
                        y.push(0) 
                    }
                }
                
                return {
                    x, y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color, width: 3, shape: 'spline', smoothing: 1.3 },
                    name: `f${idx + 1}`,
                    hoverinfo: 'none'
                }
            })
        } catch (e) {
            console.error("Plot error:", e)
            return []
        }
    }, [compiledFunctions, formulas, range, params])

    const handleHover = useCallback((event: any) => {
        const points = event.points.map((p: any) => ({
             name: p.data.name,
             x: p.x,
             y: p.y,
             color: p.fullData.line.color
        }))
        setHoverPoints(points)
    }, [])

    const handleUnhover = useCallback(() => {
        setHoverPoints([])
    }, [])

    const insertSymbol = (symbol: string, index: number) => {
        const newFormulas = [...formulas]
        newFormulas[index] = (newFormulas[index] || "") + symbol
        setFormulas(newFormulas)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-200 flex animate-in modal-enter">
            {/* Control Sidebar */}
            <aside className="w-[450px] bg-[#080808] border-r border-zinc-900 p-8 flex flex-col gap-6 shadow-2xl z-20 overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black italic text-white flex items-center gap-3">
                            <FunctionSquare className="w-6 h-6 text-primary" />
                            MATH.LAB <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full not-italic tracking-tighter ml-2">STATIC SYNC</span>
                        </h2>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Scientific Readout</p>
                    </div>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    {/* Multiple Functions List */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Analytic Inputs</label>
                            <button 
                                onClick={() => setFormulas([...formulas, 'x'])}
                                className="text-[10px] hover:text-primary transition-colors flex items-center gap-1 font-black text-zinc-500"
                            >
                                <Plus className="w-3 h-3" /> ADD FUNCTION
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {formulas.map((f, i) => (
                                <div key={i} className="relative group/field">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 font-black italic text-xs">f{i+1}(x)=</div>
                                    <Input 
                                        className="bg-zinc-950 border-zinc-900 h-10 pl-16 pr-10 text-sm font-mono text-zinc-100 focus:ring-1 focus:ring-primary/50 group-hover/field:border-zinc-800 transition-all rounded-xl"
                                        value={f}
                                        onChange={(e) => {
                                            const newF = [...formulas]
                                            newF[i] = e.target.value
                                            setFormulas(newF)
                                        }}
                                        placeholder="m * x + q..."
                                    />
                                    {formulas.length > 1 && (
                                        <button 
                                            onClick={() => setFormulas(formulas.filter((_, idx) => idx !== i))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-800 hover:text-red-500 transition-colors opacity-0 group-hover/field:opacity-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                            
                    {discoveredVars.length > 0 && (
                        <div className="space-y-4 p-5 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Static Parameters</label>
                                <span className="text-[9px] text-zinc-700 font-bold tracking-tighter uppercase">Numeric Entry</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {discoveredVars.map((key) => (
                                    <div key={key} className="space-y-1 group">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[9px] font-black text-primary/60 uppercase italic group-hover:text-primary transition-colors">{key}=</span>
                                        </div>
                                        <Input 
                                            type="number"
                                            step={0.1}
                                            value={params[key] ?? 1}
                                            onChange={(e) => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                                            className="bg-zinc-900 border-zinc-800 h-9 text-xs font-mono text-zinc-100 focus:ring-1 focus:ring-primary/40 focus:border-primary/40"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Range Controls */}
                    <div className="p-5 bg-zinc-900/20 border border-zinc-800 rounded-2xl flex flex-col gap-4">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic border-b border-zinc-900 pb-2">Global Interval (X)</span>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-zinc-700 uppercase">Min</label>
                                <Input 
                                    type="number" 
                                    className="bg-zinc-950 border-zinc-800 h-9 text-xs font-mono" 
                                    value={range.min} 
                                    onChange={(e) => setRange(r => ({ ...r, min: Number(e.target.value) }))} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-zinc-700 uppercase">Max</label>
                                <Input 
                                    type="number" 
                                    className="bg-zinc-950 border-zinc-800 h-9 text-xs font-mono" 
                                    value={range.max} 
                                    onChange={(e) => setRange(r => ({ ...r, max: Number(e.target.value) }))} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Math Symbols Keyboard */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Operator Panel</label>
                        <div className="grid grid-cols-6 gap-2">
                            {[
                                { s: 'sqrt(', l: '√' }, { s: 'sin(', l: 'sin' }, { s: 'cos(', l: 'cos' }, { s: 'tan(', l: 'tan' }, { s: 'log(', l: 'log' }, { s: 'exp(', l: 'exp' },
                                { s: 'pow(x, 2)', l: 'x²' }, { s: 'pow(x, 3)', l: 'x³' }, { s: 'PI', l: 'π' }, { s: 'E', l: 'e' }, { s: 'abs(', l: '|x|' }, { s: '/', l: '÷' }
                            ].map((sym, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => insertSymbol(sym.s, formulas.length - 1)}
                                    className="h-10 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-primary/50 hover:bg-primary/20 text-zinc-200 hover:text-primary transition-all text-[11px] font-black"
                                >
                                    {sym.l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 flex gap-3 border-t border-zinc-900">
                    <Button variant="outline" className="flex-1 h-12 border-zinc-900 bg-transparent text-zinc-500 hover:bg-zinc-900" onClick={onClose}>Close</Button>
                    <Button className="flex-2 h-12 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20">Inject Research</Button>
                </div>
            </aside>

            {/* Plot Area */}
            <main className="flex-1 bg-[#050505] relative flex items-center justify-center overflow-hidden">
                {/* Visual Dark Notebook Pattern: 0.5 unit cells */}
                <div className="absolute inset-0 bg-[radial-gradient(#141414_1px,transparent_1px)] bg-size-[1rem_1rem] opacity-60 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-size-[2rem_2rem] opacity-30 pointer-events-none" />
                
                <div className="w-full h-full p-12">
                     <div className="w-full h-full bg-zinc-950/30 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center p-8 transition-all duration-300 relative">
                        {/* Legend Overlay */}
                        <div className="absolute top-8 left-8 flex flex-col gap-2 z-10 pointer-events-none">
                            {formulas.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 rounded-xl border border-white/5 text-[10px] font-black text-zinc-200 shadow-xl">
                                    <div className="w-3.5 h-3.5 rounded-full border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][i % 5] }} />
                                    f{i+1}: {f}
                                </div>
                            ))}
                        </div>

                        {/* COORDINATES HUD TABLE */}
                        {hoverPoints.length > 0 && (
                            <div className="absolute top-8 right-8 z-30 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
                                <div className="bg-zinc-950/90 backdrop-blur-2xl border border-primary/20 rounded-[2rem] p-6 shadow-2xl min-w-[200px] border-t-primary/40">
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-900 pb-2 italic">Precision Readout</div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter italic font-mono">Input Axis (X)</span>
                                            <span className="text-xl font-mono font-black text-white">{hoverPoints[0]?.x.toFixed(4)}</span>
                                        </div>
                                        <div className="h-px bg-white/5" />
                                        <div className="space-y-2">
                                            {hoverPoints.map((p, idx) => (
                                                <div key={idx} className="flex justify-between items-center group">
                                                    <span className="text-[10px] font-black uppercase flex items-center gap-2" style={{ color: p.color }}>
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                                        {p.name}
                                                    </span>
                                                    <span className="text-sm font-mono font-black text-white">{p.y.toFixed(4)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* @ts-ignore */}
                        <Plot
                             data={plotData}
                             onHover={handleHover}
                             onUnhover={handleUnhover}
                             layout={{
                                 autosize: true,
                                 paper_bgcolor: 'rgba(0,0,0,0)',
                                 plot_bgcolor: 'rgba(0,0,0,0)',
                                 font: { color: '#a1a1aa', family: 'Inter, sans-serif' },
                                 margin: { t: 0, r: 40, l: 40, b: 40 },
                                 showlegend: false,
                                 hovermode: 'closest',
                                 dragmode: false,
                                 xaxis: { 
                                     gridcolor: '#0f0f0f', 
                                     zerolinecolor: '#3b82f6', 
                                     zerolinewidth: 2,
                                     position: 0.5,
                                     showspikes: false,
                                     showticklabels: true,
                                     tickfont: { color: '#71717a', size: 12, family: 'monospace', weight: 'bold' },
                                     showgrid: true,
                                     dtick: 1, 
                                     minor: { dtick: 0.5, showgrid: true, gridcolor: '#0a0a0a' },
                                     fixedrange: true,
                                     scaleanchor: 'y'
                                 },
                                 yaxis: { 
                                     gridcolor: '#0f0f0f', 
                                     zerolinecolor: '#3b82f6', 
                                     zerolinewidth: 2,
                                     position: 0.5,
                                     showspikes: false,
                                     showticklabels: true,
                                     tickfont: { color: '#71717a', size: 12, family: 'monospace', weight: 'bold' },
                                     showgrid: true,
                                     dtick: 1,
                                     minor: { dtick: 0.5, showgrid: true, gridcolor: '#0a0a0a' },
                                     fixedrange: true
                                 }
                             }}
                             useResizeHandler={true}
                             className="w-full h-full"
                             config={{ displayModeBar: false, responsive: true }}
                        />
                     </div>
                </div>
                
                {/* Overlay Indicators */}
                <div className="absolute bottom-12 right-12 flex gap-3">
                    <div className="px-5 py-2.5 bg-primary/10 backdrop-blur-2xl border border-primary/30 rounded-full flex items-center gap-3 shadow-2xl shadow-primary/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#3b82f6]" />
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Static Precision Scan</span>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .modal-enter { animation: modal-in 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes modal-in {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    )
}
