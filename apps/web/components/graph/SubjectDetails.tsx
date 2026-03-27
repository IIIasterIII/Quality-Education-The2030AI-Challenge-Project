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
    Loader2
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
    onUpdateNode?: (nodeId: string, updates: Partial<Node>) => void;
    onUpdateSubNote?: (subNoteId: number, updates: { summary: string }) => void;
}

const SubNoteItem: React.FC<{ sub: any, pageId: string, onUpdate?: (id: number, updates: { summary: string }) => void }> = ({ sub, pageId, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [summary, setSummary] = useState(sub.summary || "")
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(sub.summary || "")
    const [isSaving, setIsSaving] = useState(false)

    React.useEffect(() => {
        setSummary(sub.summary || "")
        setEditValue(sub.summary || "")
    }, [sub.summary, sub.id])

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const api = await import('@/app/api/notes')
            const result = await api.generateSubNoteSummary(pageId, sub.id.toString())
            if (result?.summary) {
                const truncated = result.summary.slice(0, 200)
                setSummary(truncated)
                setEditValue(truncated)
                await api.editSubNote(pageId, sub.id.toString(), undefined, undefined, truncated)
                onUpdate?.(sub.id, { summary: truncated })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const api = await import('@/app/api/notes')
            await api.editSubNote(pageId, sub.id.toString(), undefined, undefined, editValue)
            setSummary(editValue)
            onUpdate?.(sub.id, { summary: editValue })
            setIsEditing(false)
        } catch (err) {
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden transition-all hover:bg-muted/30">
            <div className="p-3 flex items-center justify-between group">
                <Link 
                    href={`/app/notes?id=${pageId}&sub=${sub.id}`}
                    className="text-[11px] font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <BookOpen className="w-3 h-3 text-primary/60" />
                    {sub.title}
                </Link>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-tighter"
                    >
                        {isExpanded ? "Close" : "Insight"}
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3 pb-3 border-t border-border/20 pt-3 space-y-3"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-2 py-2">
                                <Loader2 className="w-3 h-3 text-primary animate-spin" />
                                <span className="text-[10px] text-muted-foreground animate-pulse">Analyzing...</span>
                            </div>
                        ) : isEditing ? (
                            <div className="space-y-2">
                                <textarea 
                                    className="w-full h-16 bg-transparent border-none text-[11px] text-muted-foreground italic focus:ring-0 resize-none p-0"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value.slice(0, 200))}
                                    autoFocus
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-bold text-muted-foreground">{editValue.length}/200</span>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" className="h-6 text-[9px] px-2" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button size="sm" className="h-6 text-[9px] px-3" onClick={handleSave} disabled={isSaving}>{isSaving ? "..." : "Save"}</Button>
                                    </div>
                                </div>
                            </div>
                        ) : summary ? (
                            <div className="relative group/text">
                                <p className="text-[11px] leading-relaxed text-muted-foreground italic">"{summary}"</p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="absolute top-0 right-0 opacity-0 group-hover/text:opacity-100 text-[8px] font-bold text-primary uppercase"
                                >
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 h-7 text-[9px] border-dashed"
                                    onClick={handleGenerate}
                                >
                                    <Sparkles className="w-2.5 h-2.5 mr-1" /> AI Summary
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 h-7 text-[9px] border-dashed"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Write
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export const SubjectDetails: React.FC<SubjectDetailsProps> = ({
    selectedNode,
    setSelectedNode,
    handleNodeClick,
    onUpdateNode,
    onUpdateSubNote
}) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [summary, setSummary] = useState<string | null>(selectedNode.summary || null)
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(selectedNode.summary || "")
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Sync local state when selectedNode changes
    React.useEffect(() => {
        setSummary(selectedNode.summary || null)
        setEditValue(selectedNode.summary || "")
        setIsEditing(false)
        setError(null)
    }, [selectedNode.id, selectedNode.summary])

    const handleGenerateSummary = async () => {
        setIsGenerating(true)
        setError(null)
        try {
            const result = await generateNoteSummary(selectedNode.id)
            if (result?.error === "insufficient_content") {
                setError("Insufficient content to generate a summary. Add more notes!")
            } else if (result?.summary) {
                const truncated = result.summary.slice(0, 200)
                setEditValue(truncated)
                setSummary(truncated)
                await import('@/app/api/notes').then(api => api.editNote(parseInt(selectedNode.id), { summary: truncated }))
            }
        } catch (err) {
            setError("Failed to generate summary. Please try again later.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSaveManual = async () => {
        if (editValue.length > 200) return
        setIsSaving(true)
        try {
            const api = await import('@/app/api/notes')
            await api.editNote(parseInt(selectedNode.id), { summary: editValue })
            setSummary(editValue)
            onUpdateNode?.(selectedNode.id, { summary: editValue })
            setIsEditing(false)
        } catch (err) {
            setError("Failed to save summary.")
        } finally {
            setIsSaving(false)
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <Sparkles className="w-3 h-3 text-primary" /> {isEditing ? "Edit Summary" : "AI Insights"}
                    </div>
                    {summary && !isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                        >
                            Edit
                        </button>
                    )}
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
                        ) : isEditing ? (
                            <motion.div 
                                key="editing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                <textarea 
                                    className="w-full h-24 bg-transparent border-none text-sm text-foreground italic focus:ring-0 resize-none p-0 placeholder:text-muted-foreground/40"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value.slice(0, 200))}
                                    placeholder="Write a custom summary..."
                                    autoFocus
                                />
                                <div className="flex items-center justify-between pt-2 border-t border-border/20">
                                    <div className={`text-[9px] font-bold uppercase tracking-widest ${editValue.length >= 190 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        {editValue.length} / 200
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase" onClick={() => { setIsEditing(false); setEditValue(summary || ""); }}>Cancel</Button>
                                        <Button size="sm" className="h-7 text-[10px] font-bold uppercase px-4" onClick={handleSaveManual} disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                </div>
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
                                    No summary available. Generate one with AI or write your own.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                        onClick={handleGenerateSummary}
                                        variant="outline" 
                                        className="h-10 border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary transition-all rounded-xl text-[10px] font-bold gap-2"
                                    >
                                        <BrainCircuit className="w-3.5 h-3.5" /> AI Generate
                                    </Button>
                                    <Button 
                                        onClick={() => setIsEditing(true)}
                                        variant="outline" 
                                        className="h-10 border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary transition-all rounded-xl text-[10px] font-bold gap-2"
                                    >
                                        <BookOpen className="w-3.5 h-3.5" /> Write own
                                    </Button>
                                </div>
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

            {/* Resources Loop */}
            {selectedNode.subNotes && selectedNode.subNotes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <ArrowUpRight className="w-3 h-3 text-primary" /> Resource Loop
                    </div>
                    <div className="flex flex-col gap-3">
                        {selectedNode.subNotes.map((sub, i) => (
                            <SubNoteItem 
                                key={sub.id} 
                                sub={sub} 
                                pageId={selectedNode.id}
                                onUpdate={onUpdateSubNote}
                            />
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
