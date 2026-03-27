"use client"
import React, { useState } from 'react'
import { 
    Target, 
    GraduationCap, 
    Layers, 
    ChevronRight, 
    X, 
    Sparkles, 
    BarChart3, 
    Clock, 
    BookOpen,
    BrainCircuit,
    ArrowUpRight,
    Loader2,
    Activity
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Node } from './types'
import { generateNoteSummary } from '@/app/api/notes'
import Link from 'next/link'

interface SubjectDetailsProps {
    selectedNode: Node;
    historyLength: number;
    setSelectedNode: (node: Node | null) => void;
    handleNodeClick: (node: Node) => void;
}

export const SubjectDetails: React.FC<SubjectDetailsProps> = ({
    selectedNode,
    setSelectedNode,
    handleNodeClick
}) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [summary, setSummary] = useState<string | null>(selectedNode.summary || null)
    const [error, setError] = useState<string | null>(null)

    const handleGenerateSummary = async () => {
        setIsGenerating(true)
        setError(null)
        try {
            const result = await generateNoteSummary(selectedNode.id)
            if (result?.error === "insufficient_content") {
                setError("Insufficient content to generate a summary. Add more notes!")
            } else if (result?.summary) {
                setSummary(result.summary)
            }
        } catch (err) {
            setError("Failed to generate summary. Please try again later.")
        } finally {
            setIsGenerating(false)
        }
    }

    const formatTime = (seconds: number) => {
        if (!seconds) return "0m"
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        if (hours > 0) return `${hours}h ${mins}m`
        return `${mins}m`
    }

    return (
        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar min-h-0 bg-background/50 backdrop-blur-xl border-l border-border/50"
        >
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            ID: {selectedNode.id}
                        </div>
                        {selectedNode.subGraph && (
                            <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Layers className="w-3 h-3" /> Clusters
                            </div>
                        )}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedNode(null)} 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground leading-none">
                        {selectedNode.name}
                    </h2>
                    <div className="h-1 w-12 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                </div>
            </div>

            {/* AI Insights Card */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-primary" /> AI Insights
                </div>
                <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-muted/50 to-background p-5 transition-all hover:shadow-2xl hover:shadow-primary/5">
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-6 gap-3"
                            >
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                <p className="text-xs text-muted-foreground font-medium animate-pulse">Synthesizing knowledge...</p>
                            </motion.div>
                        ) : summary ? (
                            <motion.div 
                                key="summary"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm leading-relaxed text-muted-foreground italic font-medium"
                            >
                                "{summary}"
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <p className="text-sm text-muted-foreground/60 leading-relaxed font-medium">
                                    No AI summary available for this node yet. Generate one based on your current notes.
                                </p>
                                <Button 
                                    onClick={handleGenerateSummary}
                                    variant="outline" 
                                    className="w-full h-10 border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary transition-all rounded-xl text-xs font-bold gap-2"
                                >
                                    <BrainCircuit className="w-3.5 h-3.5" /> Generate Summary
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {error && (
                        <p className="mt-2 text-[10px] text-destructive font-bold uppercase tracking-tight">
                            {error}
                        </p>
                    )}
                    <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all rounded-full" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    <BarChart3 className="w-3 h-3 text-primary" /> Metrics
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1 group hover:bg-muted/50 transition-colors">
                        <BookOpen className="w-4 h-4 mx-auto text-primary/60 group-hover:text-primary transition-colors" />
                        <div className="text-lg font-bold text-foreground">{(selectedNode as any).notesCount || 0}</div>
                        <div className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Notes</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1 group hover:bg-muted/50 transition-colors capitalize">
                        <div className="flex justify-center gap-0.5 mb-1">
                            {[1, 2, 3].map((i) => (
                                <div 
                                    key={i} 
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        (selectedNode.complexity === 'expert' || 
                                        (selectedNode.complexity === 'advanced' && i <= 2) || 
                                        (selectedNode.complexity === 'beginner' && i === 1) ||
                                        (!selectedNode.complexity && i === 1)) 
                                        ? 'bg-primary shadow-[0_0_5px_rgba(var(--primary),0.5)]' 
                                        : 'bg-muted-foreground/30'
                                    }`} 
                                />
                            ))}
                        </div>
                        <div className="text-[10px] font-bold text-foreground mt-1 truncate">
                            {selectedNode.complexity || 'Beginner'}
                        </div>
                        <div className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Level</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1 group hover:bg-muted/50 transition-colors">
                        <Clock className="w-4 h-4 mx-auto text-primary/60 group-hover:text-primary transition-colors" />
                        <div className="text-lg font-bold text-foreground">{formatTime(selectedNode.time_spent || 0)}</div>
                        <div className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Spent</div>
                    </div>
                </div>
            </div>

            {/* Persistence Timeline */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <Activity className="w-3 h-3 text-primary" /> Persistence
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground/50 uppercase">7-Day Trend</div>
                </div>
                <div className="h-16 w-full rounded-2xl bg-muted/20 border border-border/40 flex items-end justify-between p-3 gap-1 overflow-hidden group">
                    {[0.3, 0.5, 0.8, 0.4, 0.9, 0.6, 1.0].map((v, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${v * 100}%` }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            className={`flex-1 rounded-t-sm bg-primary/20 group-hover:bg-primary/40 transition-colors relative`}
                        >
                            {i === 6 && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1">
                                    <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Resources Loop */}
            {selectedNode.subNotes && selectedNode.subNotes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <ArrowUpRight className="w-3 h-3 text-primary" /> Resource Loop
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedNode.subNotes.map((sub, i) => (
                            <Link 
                                key={sub.id} 
                                href={`/app/notes?id=${selectedNode.id}&sub=${sub.id}`}
                                className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-[11px] font-bold text-muted-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
                            >
                                {sub.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-6 mt-auto">
                <Link href={`/app/exercise/random?topic=${encodeURIComponent(selectedNode.name)}`}>
                    <Button 
                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 overflow-hidden group"
                    >
                        <Target className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        Verify Knowledge
                    </Button>
                </Link>

                {selectedNode.subGraph && (
                    <Button 
                        variant="secondary"
                        onClick={() => handleNodeClick(selectedNode)}
                        className="w-full h-12 rounded-2xl border border-border/50 bg-muted/30 font-bold text-xs uppercase tracking-widest hover:bg-muted/50 transition-all gap-2"
                    >
                        Explore Synthesis <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </motion.div>
    )
}
