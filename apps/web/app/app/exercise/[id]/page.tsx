"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Brain, 
    Zap, 
    Target, 
    ChevronRight, 
    ArrowLeft, 
    Loader2, 
    CheckCircle2, 
    XCircle,
    Info,
    RotateCcw,
    FlaskConical,
    Sparkles,
    Atom,
    Dna
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { generateExercise, getSingleNote, generateRandomExercise } from '@/app/api/notes'
import { useToast } from '@/components/toast'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import katex from 'katex'

interface QuizItem {
    question: string
    options: string[]
    answer: string
    explanation: string
}

interface ExerciseData {
    title: string
    items: QuizItem[]
}

const ExerciseLab = () => {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    
    const [note, setNote] = useState<any>(null)
    const [status, setStatus] = useState<'selecting' | 'generating' | 'active' | 'finished'>('selecting')
    const [level, setLevel] = useState('foundational')
    const [type, setType] = useState('quiz')
    const [rawOutput, setRawOutput] = useState("")
    const [exercise, setExercise] = useState<ExerciseData | null>(null)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [showExplanation, setShowExplanation] = useState(false)
    const { showToast, ToastComponent } = useToast()

    useEffect(() => {
        if (id && id !== 'random') {
            getSingleNote(id).then(setNote)
        }
    }, [id])

    const isNoteEmpty = () => {
        if (!note) return true
        if (!note.content) return true
        // Basic check for meaningful content in TipTap JSON or string
        const contentStr = typeof note.content === 'string' ? note.content : JSON.stringify(note.content)
        return contentStr.length < 50 // roughly 10 words + JSON overhead
    }

    const startGeneration = async () => {
        if (id !== 'random' && isNoteEmpty()) {
            showToast("Your note is empty! Write something before starting the Lab.", "warning")
            return
        }
        setStatus('generating')
        setRawOutput("")
        let fullText = ""

        const onChunk = (chunk: string) => {
            fullText += chunk
            setRawOutput(fullText)
        }

        try {
            if (id === 'random') {
                await generateRandomExercise(note?.title || "General Science", level, onChunk)
            } else {
                await generateExercise(id, level, type, onChunk)
            }

            try {
                const cleaned = fullText.substring(fullText.indexOf('{'), fullText.lastIndexOf('}') + 1)
                
                // MULTI-STAGE REPAIR: Fixes LLM-generated JSON with naked LaTeX backslashes.
                const repaired = cleaned
                    .replace(/\\/g, '\\\\')    // Double ALL backslashes first.
                    .replace(/\\\\"/g, '\\"')   // Restore escaped quotes.
                    .replace(/\\\\n/g, '\\n')   // Restore escaped newlines.
                    .replace(/\\\\r/g, '\\r')   // Restore carriage returns.
                    .replace(/\\\\t/g, '\\t')   // Restore tabs.
                    .replace(/\\\\f/g, '\\f')   // Restore formfeeds.
                    .replace(/\\\\b/g, '\\b');  // Restore backspaces.

                const parsed = JSON.parse(repaired)
                
                if (parsed.error === 'insufficient_content') {
                    showToast("Not enough context! Add more content to your note to generate specific exercises.", "warning")
                    setStatus('selecting')
                    return
                }

                setExercise(parsed)
                setStatus('active')
            } catch (e) {
                console.error("Failed to parse AI output", e)
                showToast("Brain Overload! The AI had trouble synthesizing this quiz. Try again.", "error")
                setStatus('selecting')
            }
        } catch (err) {
            console.error(err)
            setStatus('selecting')
        }
    }

    const handleAnswer = (option: string) => {
        if (showExplanation) return
        setAnswers({ ...answers, [currentIdx]: option })
        setShowExplanation(true)
    }

    const nextQuestion = () => {
        if (currentIdx < (exercise?.items.length || 0) - 1) {
            setCurrentIdx(currentIdx + 1)
            setShowExplanation(false)
        } else {
            setStatus('finished')
        }
    }

    const score = useMemo(() => {
        if (!exercise) return 0
        return exercise.items.reduce((acc, item, idx) => {
            return acc + (answers[idx] === item.answer ? 1 : 0)
        }, 0)
    }, [exercise, answers])

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 relative overflow-hidden font-sans">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="flex items-center justify-between mb-12">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Notes
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-px bg-zinc-800" />
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900/50 border border-white/5">
                            <FlaskConical className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Exercise Lab v1.0</span>
                        </div>
                    </div>
                </header>   

                <AnimatePresence mode="wait">
                    {status === 'selecting' && (
                        <motion.div 
                            key="selecting"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black tracking-tighter leading-none italic">
                                    Knowledge <span className="text-primary italic">Stress-Test.</span>
                                </h1>
                                <p className="text-lg text-zinc-500 max-w-2xl font-medium leading-relaxed">
                                    Prepare for mastery. Our AI generates unique challenges based on your notes and identifies knowledge gaps in real-time.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Configure Atmosphere</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'foundational', label: 'Foundational', desc: 'Core concepts & basic logic', icon: Atom },
                                            { id: 'advanced', label: 'Advanced', desc: 'Complex systems & integration', icon: Zap },
                                            { id: 'expert', label: 'Expert', desc: 'Critical analysis & edge cases', icon: Brain }
                                        ].map(lvl => (
                                            <button 
                                                key={lvl.id}
                                                onClick={() => setLevel(lvl.id)}
                                                className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden group ${level === lvl.id ? 'bg-primary/10 border-primary/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'bg-zinc-900/40 border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${level === lvl.id ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                                        <lvl.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase tracking-wider">{lvl.label}</p>
                                                        <p className="text-[10px] text-zinc-500 font-bold">{lvl.desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500/60">Choose Subject Focus</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'quiz', label: 'Standard Quiz', desc: 'Multiple choice mastery', icon: Target },
                                            { id: 'math_problems', label: 'Math Workbench', desc: 'Derivations & calculations', icon: Sparkles },
                                            { id: 'conceptual_questions', label: 'Deep Context', desc: 'Open-ended critical thinking', icon: Dna }
                                        ].map(t => (
                                            <button 
                                                key={t.id}
                                                onClick={() => setType(t.id)}
                                                className={`p-5 rounded-3xl border text-left transition-all group ${type === t.id ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-zinc-900/40 border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === t.id ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                                        <t.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase tracking-wider">{t.label}</p>
                                                        <p className="text-[10px] text-zinc-500 font-bold">{t.desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-8">
                                <Button 
                                    onClick={startGeneration}
                                    className="h-16 px-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(59,130,246,0.2)] hover:scale-[1.02] transition-all group"
                                >
                                    Ignite Lab <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'generating' && (
                        <motion.div 
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 space-y-8"
                        >
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                                <Sparkles className="absolute top-0 right-0 w-6 h-6 text-yellow-500 animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black italic">Synthesizing Challenge...</h3>
                                <p className="text-zinc-500 font-medium italic">Our AI is analyzing {note?.title || 'the subject'} for potential weaknesses.</p>
                            </div>
                            <div className="w-full max-w-lg p-6 rounded-3xl bg-zinc-900/50 border border-white/5 font-mono text-[10px] text-primary/40 leading-relaxed overflow-hidden max-h-48 whitespace-pre-wrap">
                                {rawOutput || "> Establishing connection to Neural Core..."}
                            </div>
                        </motion.div>
                    )}

                    {status === 'active' && exercise && (
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-12"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black tracking-tight">{exercise.title}</h2>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{type} • Level: {level}</p>
                                </div>
                                <div className="px-5 py-2 rounded-2xl bg-zinc-900 border border-white/10 font-black text-sm tabular-nums">
                                    {currentIdx + 1} <span className="text-zinc-600">/</span> {exercise.items.length}
                                </div>
                            </div>

                            <div className="space-y-8">
                                     <div className="text-2xl font-bold leading-tight prose prose-invert max-w-none">
                                        {(() => {
                                            const text = exercise.items[currentIdx]?.question || '';
                                            if (text.includes('\\') || text.includes('begin{')) {
                                                try {
                                                    const html = katex.renderToString(text, { displayMode: true, throwOnError: false });
                                                    return <div dangerouslySetInnerHTML={{ __html: html }} />;
                                                } catch (e) {
                                                    return (
                                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                            {text.includes('$$') ? text : `$$${text}$$`}
                                                        </ReactMarkdown>
                                                    );
                                                }
                                            }
                                            return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{text}</ReactMarkdown>;
                                        })()}
                                     </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {(exercise.items[currentIdx]?.options || []).map((opt, i) => {
                                        const isSelected = answers[currentIdx] === opt
                                        const isCorrect = opt === (exercise.items[currentIdx]?.answer || '')
                                        
                                        let borderClass = "border-white/5 hover:border-white/20 bg-zinc-900/20"
                                        if (showExplanation) {
                                            if (isCorrect) borderClass = "border-emerald-500/50 bg-emerald-500/10"
                                            else if (isSelected) borderClass = "border-rose-500/50 bg-rose-500/10"
                                        }

                                        return (
                                            <button 
                                                key={i}
                                                onClick={() => handleAnswer(opt)}
                                                disabled={showExplanation}
                                                className={`p-6 rounded-3xl border text-left transition-all flex items-center justify-between group ${borderClass}`}
                                            >
                                                <div className="text-lg font-medium prose prose-invert">
                                                    {(() => {
                                                        if (opt.includes('\\') || opt.includes('begin{')) {
                                                            try {
                                                                const html = katex.renderToString(opt, { displayMode: false, throwOnError: false });
                                                                return <span dangerouslySetInnerHTML={{ __html: html }} />;
                                                            } catch (e) {
                                                                return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`$${opt}$`}</ReactMarkdown>;
                                                            }
                                                        }
                                                        return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{opt}</ReactMarkdown>;
                                                    })()}
                                                </div>
                                                {showExplanation && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                                                {showExplanation && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500" />}
                                            </button>
                                        )
                                    })}
                                </div>

                                <AnimatePresence>
                                    {showExplanation && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-6"
                                        >
                                            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <Info className="w-4 h-4" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Logic & Explanation</span>
                                                </div>
                                                <div className="text-sm font-medium leading-relaxed text-zinc-300 italic prose prose-invert">
                                                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                        {(() => {
                                                            let text = exercise.items[currentIdx]?.explanation || '';
                                                            if ((text.includes('\\') || text.includes('begin{')) && !text.includes('$$')) {
                                                                return `$$${text}$$`;
                                                            }
                                                            return text;
                                                        })()}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button 
                                                    onClick={nextQuestion}
                                                    className="h-14 px-10 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
                                                >
                                                    Next Module <ChevronRight className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {status === 'finished' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-10 py-12"
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                <div className="relative w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center bg-zinc-900 shadow-2xl">
                                    <span className="text-7xl font-black italic">{Math.round((score/(exercise?.items.length || 1))*100)}%</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black tracking-tighter italic">Lab Report <span className="text-zinc-500 italic">Finalized.</span></h2>
                                <p className="text-zinc-500 font-medium">
                                    You achieved {score} correct out of {exercise?.items.length} units tested. 
                                    Continue practicing to improve your retention.
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Button 
                                    onClick={() => {
                                        setStatus('selecting')
                                        setCurrentIdx(0)
                                        setAnswers({})
                                        setShowExplanation(false)
                                    }}
                                    variant="outline"
                                    className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" /> Retry Test
                                </Button>
                                <Button 
                                    onClick={() => router.back()}
                                    className="h-14 px-8 rounded-2xl bg-primary font-bold uppercase tracking-widest"
                                >
                                    End Session
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {ToastComponent}
        </div>
    )
}

export default ExerciseLab
