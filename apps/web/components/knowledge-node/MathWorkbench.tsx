"use client"
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Slider } from "@workspace/ui/components/slider"
import { Label } from "@workspace/ui/components/label"
import { Trash2, Plus, FunctionSquare, Variable } from 'lucide-react'

const Plot = dynamic(() => import('react-plotly.js'), { 
    ssr: false,
    loading: () => <div className="w-full h-[500px] flex items-center justify-center bg-zinc-900 rounded-3xl
     border border-zinc-800 animate-pulse text-zinc-600">Loading Plotly Engines...</div>
}) as any;

interface MathWorkbenchProps {
    isOpen: boolean;
    onClose: () => void;
    onInjectImage?: (dataUrl: string) => void;
}

export const MathWorkbench = ({ isOpen, onClose, onInjectImage }: MathWorkbenchProps) => {
    const [formulas, setFormulas] = useState<string[]>(['a * x^2 + b * x + c'])
    const [params, setParams] = useState<Record<string, number>>({ a: 1, b: 0, c: 0 })
    const [_, setHoverPoints] = useState<{ name: string, x: number, y: number, color: string }[]>([])
    const [graphDiv, setGraphDiv] = useState<any>(null)
    const range = { min: -10, max: 10, steps: 200 }
    const reserved = new Set(['x', 'sin', 'cos', 'tan', 'sqrt', 'log', 'exp', 'pow', 'abs', 'PI', 'E', 'Math'])

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

    useEffect(() => {
        setParams(prev => {
            const newParams = { ...prev }
            let changed = false
            discoveredVars.forEach(v => {
                if (!(v in newParams)) {
                    newParams[v] = 1
                    changed = true
                }
            })
            return changed ? newParams : prev
        })
    }, [discoveredVars])

    const compiledFunctions = useMemo(() => {
        return formulas.map(rawFormula => {
            try {
                const mathScope = `const { sin, cos, tan, sqrt, log, exp, pow, abs, PI, E } = Math;`
                const varScope = discoveredVars.map(v => `const ${v} = p['${v}'] !== undefined ? p['${v}'] : 1;`).join('\n')
                const processedFormula = rawFormula.replace(/\^/g, '**')

                return new Function('x', 'p', `
                    ${mathScope}
                    ${varScope}
                    try { 
                        const result = ${processedFormula};
                        return (typeof result === 'number' && !isNaN(result) && isFinite(result)) ? result : 0;
                    } catch(e) { return 0; }
                `)
            } catch (e) {
                return () => 0
            }
        })
    }, [formulas, discoveredVars])

    const getDisplayFormula = (formula: string) => {
        let display = formula
        discoveredVars.forEach(v => {
            const val = params[v]?.toFixed(2) || "1.00"
            display = display.replace(new RegExp(`\\b${v}\\b`, 'g'), val)
        })
        return display.replace(/\*/g, '×').replace(/\//g, '÷').replace(/\*\*/g, '^')
    }

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
                    try { y.push(f(xv, params)) 
                    } catch(e) { y.push(0) }
                }
                
                return {
                    x, y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color, width: 4, shape: 'spline', smoothing: 1.3 },
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

    const handleUnhover = useCallback(() => { setHoverPoints([]) }, [])

    const insertSymbol = (symbol: string, index: number) => {
        const newFormulas = [...formulas]
        newFormulas[index] = (newFormulas[index] || "") + symbol
        setFormulas(newFormulas)
    }

    const handleInject = async () => {
        if (!graphDiv || !onInjectImage) return
        try {
            const Plotly = (await import('plotly.js-dist-min')).default
            const dataUrl = await Plotly.toImage(graphDiv, {
                format: 'png',
                width: 1200,
                height: 800,
                scale: 2
            })
            onInjectImage(dataUrl)
            onClose()
        } catch (e) {
            console.error("Failed to capture plot:", e)
        }
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
                            MATH.LAB <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full not-italic tracking-tighter ml-2">INTERACTIVE</span>
                        </h2>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Scientific Readout</p>
                    </div>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
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
                        
                        <div className="space-y-4">
                            {formulas.map((f, i) => (
                                <div key={i} className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl group/field transition-all hover:border-zinc-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-[10px] font-black text-primary/60 italic uppercase tracking-widest">f{i+1} Definition</div>
                                        {formulas.length > 1 && (
                                            <button 
                                                onClick={() => setFormulas(formulas.filter((_, idx) => idx !== i))}
                                                className="text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover/field:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative mb-3">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 font-black italic text-sm">f(x)=</div>
                                        <Input 
                                            className="bg-black/40 border-zinc-800 h-11 pl-16 pr-4 text-base font-mono text-zinc-100 focus:ring-primary/50 rounded-xl border-none ring-1 ring-zinc-900 focus:ring-2"
                                            value={f}
                                            onChange={(e) => {
                                                const newF = [...formulas]
                                                newF[i] = e.target.value
                                                setFormulas(newF)
                                            }}
                                            placeholder="a * x^2 + b * x + c"
                                        />
                                    </div>
                                    <div className="px-1 py-1">
                                        <div className="text-[11px] font-mono text-zinc-500 overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span className="text-zinc-700">Display: </span>
                                            {getDisplayFormula(f)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {discoveredVars.length > 0 && (
                        <div className="space-y-6 pt-4">
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic flex items-center gap-2">
                                    <Variable className="w-3 h-3" /> Variable Sliders
                                </label>
                            </div>
                            <div className="space-y-8 px-2">
                                {discoveredVars.map((key) => (
                                    <div key={key} className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-xs font-black text-zinc-400 uppercase italic">
                                                Variable <span className="text-primary ml-1">{key}</span>
                                            </Label>
                                            <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md text-[11px] font-mono font-bold text-white shadow-inner">
                                                {(params[key] || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <Slider
                                            value={[params[key] ?? 1]}
                                            min={-10}
                                            max={10}
                                            step={0.1}
                                            onValueChange={([val]) => setParams(p => ({ ...p, [key]: val ?? 0 }))}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Operator Panel</label>
                        <div className="grid grid-cols-6 gap-2">
                            {[
                                { s: 'sqrt(', l: '√' }, { s: 'sin(', l: 'sin' }, { s: 'cos(', l: 'cos' }, { s: 'tan(', l: 'tan' }, { s: 'log(', l: 'log' }, { s: 'exp(', l: 'exp' },
                                { s: '^2', l: 'x²' }, { s: '^3', l: 'x³' }, { s: '^', l: 'xⁿ' }, { s: 'PI', l: 'π' }, { s: 'E', l: 'e' }, { s: 'abs(', l: '|x|' }
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
                    <Button 
                        variant="outline"
                        className="flex-1 h-12 border-zinc-900 bg-transparent text-zinc-500 hover:bg-zinc-800 rounded-xl font-bold transition-all" 
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button 
                        onClick={handleInject}
                        className="flex-2 h-12 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Inject Research
                    </Button>
                </div>
            </aside>

            <main className="flex-1 bg-[#050505] relative flex items-center justify-center overflow-hidden font-mono">
                <div className="w-full h-full p-12">
                     <div className="w-full h-full bg-zinc-950/30 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center p-8 transition-all duration-300 relative">
                        <Plot
                             data={plotData}
                             onHover={handleHover}
                             onUnhover={handleUnhover}
                             onInitialized={(_: any, div: any) => setGraphDiv(div)}
                             layout={{
                                 autosize: true,
                                 paper_bgcolor: 'rgba(0,0,0,0)',
                                 plot_bgcolor: 'rgba(0,0,0,0)',
                                 font: { color: '#ffffff', family: 'JetBrains Mono, monospace' },
                                 margin: { t: 20, r: 40, l: 40, b: 40 },
                                 showlegend: false,
                                 hovermode: 'closest',
                                 dragmode: false,
                                 xaxis: { 
                                     gridcolor: '#1a1a1a', 
                                     zerolinecolor: '#3b82f6', 
                                     zerolinewidth: 2,
                                     position: 0.5,
                                     showspikes: false,
                                     showticklabels: true,
                                     tickpadding: 10,
                                     ticklen: 0,
                                     tickfont: { color: '#ffffff', size: 12, family: 'monospace' },
                                     showgrid: true,
                                     dtick: 1, 
                                     range: [-10, 10],
                                     fixedrange: true,
                                     scaleanchor: 'y'
                                 },
                                 yaxis: { 
                                     gridcolor: '#1a1a1a', 
                                     zerolinecolor: '#3b82f6', 
                                     zerolinewidth: 2,
                                     position: 0.5,
                                     showspikes: false,
                                     showticklabels: true,
                                     tickpadding: 10,
                                     ticklen: 0,
                                     tickfont: { color: '#ffffff', size: 12, family: 'monospace' },
                                     showgrid: true,
                                     dtick: 1,
                                     range: [-5, 5],
                                     fixedrange: true
                                 }
                             }}
                             useResizeHandler={true}
                             className="w-full h-full"
                             config={{ displayModeBar: false, responsive: true }}
                        />
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
