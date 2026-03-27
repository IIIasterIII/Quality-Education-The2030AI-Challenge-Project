"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Brain, 
    Infinity, 
    Target, 
    ChevronRight, 
    ArrowLeft, 
    Loader2, 
    CheckCircle2, 
    XCircle,
    Info,
    RotateCcw,
    Sparkles,
    Atom,
    Dna,
    Award,
    Activity
} from 'lucide-react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { generateExercise, generateRandomExercise, getSingleNote } from '@/app/api/notes'
import { useToast } from '@/components/toast'

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
  }
};

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
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = params.id as string
    const topicParam = searchParams.get('topic')
    
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
        } else if (id === 'random' && topicParam) {
            setNote({ title: topicParam })
        }
    }, [id, topicParam])

    const isNoteEmpty = () => {
        if (!note) return true
        if (!note.content) return true
        const contentStr = typeof note.content === 'string' ? note.content : JSON.stringify(note.content)
        return contentStr.length < 50
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
                const repaired = cleaned.replace(/\\\\"/g, '\\"').replace(/\\\\n/g, '\\n')
                const parsed = JSON.parse(repaired)
                
                if (parsed.error === 'insufficient_content') {
                    showToast("Insufficient Context! Add more content to your note, or ensure the topic is a valid educational concept (not a placeholder like 'asd1').", "warning")
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
        if (!exercise || !exercise.items) return 0
        return exercise.items.reduce((acc: number, item: any, idx: number) => {
            return acc + (answers[idx] === item.answer ? 1 : 0)
        }, 0)
    }, [exercise, answers])

    const progressPercentage = exercise?.items ? ((currentIdx + 1) / exercise.items.length) * 100 : 0

    return (
        <MathJaxContext config={config}>
            <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-primary/20">
                <div className="max-w-4xl mx-auto space-y-12">
                    <header className="flex items-center justify-between">
                        <Button 
                            variant="ghost" 
                            onClick={() => router.back()}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-900 gap-2 cursor-pointer transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Notes
                        </Button>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                            <Activity className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Lab Active</span>
                        </div>
                    </header>   

                    <AnimatePresence mode="wait">
                        {status === 'selecting' && (
                            <motion.div 
                                key="selecting"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="space-y-3">
                                    <h1 className="text-5xl font-bold tracking-tight text-white">
                                        Exercise Room
                                    </h1>
                                    <p className="text-zinc-400 text-lg max-w-2xl font-medium">
                                        Test your understanding with AI-generated challenges based on your current study material.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Knowledge Depth</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { id: 'foundational', label: 'Foundational', icon: Atom },
                                                { id: 'advanced', label: 'Advanced', icon: Infinity },
                                                { id: 'expert', label: 'Expert', icon: Brain }
                                            ].map(lvl => (
                                                <button 
                                                    key={lvl.id}
                                                    onClick={() => setLevel(lvl.id)}
                                                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${level === lvl.id ? 'bg-zinc-100 text-zinc-950 border-white' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                                                >
                                                    <lvl.icon className="w-5 h-5" />
                                                    <span className="font-bold text-sm uppercase tracking-wide">{lvl.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Challenge Mode</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { id: 'quiz', label: 'Standard Quiz', icon: Target },
                                                { id: 'math_problems', label: 'Math Workbench', icon: Sparkles },
                                                { id: 'conceptual_questions', label: 'Deep Theory', icon: Dna }
                                            ].map(t => (
                                                <button 
                                                    key={t.id}
                                                    onClick={() => setType(t.id)}
                                                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${type === t.id ? 'bg-zinc-100 text-zinc-950 border-white' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                                                >
                                                    <t.icon className="w-5 h-5" />
                                                    <span className="font-bold text-sm uppercase tracking-wide">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-6">
                                    <Button 
                                        onClick={startGeneration}
                                        className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-widest shadow-xl transition-all group cursor-pointer"
                                    >
                                        Start Learning <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                                    <Loader2 className="w-12 h-12 text-zinc-400 animate-spin" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold">Generating Session...</h3>
                                    <p className="text-zinc-500 text-sm">Our AI is parsing your notes to build a unique roadmap.</p>
                                </div>
                                <div className="w-full max-w-sm p-4 rounded-2xl bg-zinc-900 border border-zinc-800 font-mono text-[9px] text-zinc-600 leading-relaxed overflow-hidden max-h-32 text-center opacity-30 select-none">
                                    {rawOutput || "> neural_core.initialize()"}
                                </div>
                            </motion.div>
                        )}

                        {status === 'active' && exercise && (
                            <motion.div 
                                key="active"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8 pb-12"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-bold text-white tracking-tight">{exercise?.title || 'Quiz'}</h2>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                    {type.replace('_', ' ')}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                    {level}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold tabular-nums text-zinc-500">
                                            {currentIdx + 1} / {exercise?.items?.length || 0}
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>

                                <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl p-8 space-y-8">
                                    <div className="text-xl font-semibold leading-relaxed text-zinc-100">
                                        <MathJax>
                                            {exercise.items[currentIdx]?.question || ''}
                                        </MathJax>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {(exercise.items[currentIdx]?.options || []).map((opt, i) => {
                                            const isSelected = answers[currentIdx] === opt
                                            const isCorrect = opt === (exercise.items[currentIdx]?.answer || '')
                                            
                                            let bgClass = "hover:bg-zinc-800/80 border-zinc-800"
                                            if (showExplanation) {
                                                if (isCorrect) bgClass = "bg-emerald-500/10 border-emerald-500 text-emerald-100"
                                                else if (isSelected) bgClass = "bg-rose-500/10 border-rose-500 text-rose-100"
                                                else bgClass = "opacity-40 border-zinc-800"
                                            } else if (isSelected) {
                                                bgClass = "bg-zinc-100 text-zinc-950 border-white"
                                            }

                                            return (
                                                <button 
                                                    key={i}
                                                    onClick={() => handleAnswer(opt)}
                                                    disabled={showExplanation}
                                                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${bgClass}`}
                                                >
                                                    <div className="text-base font-medium">
                                                        <MathJax dynamic inline>
                                                            {opt}
                                                        </MathJax>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                                        {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </Card>

                                <AnimatePresence>
                                    {showExplanation && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            <Card className="bg-zinc-100 text-zinc-950 p-6 space-y-2 border-none">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Info className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Logic & Explanation</span>
                                                </div>
                                                <div className="text-sm font-medium leading-relaxed">
                                                    <MathJax>
                                                        {exercise.items[currentIdx]?.explanation || ''}
                                                    </MathJax>
                                                </div>
                                            </Card>
                                            <div className="flex justify-end">
                                                <Button 
                                                    onClick={nextQuestion}
                                                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs cursor-pointer shadow-lg"
                                                >
                                                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {status === 'finished' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center space-y-12 py-12"
                            >
                                <Card className="bg-zinc-900/50 border-zinc-800 p-12 w-full max-w-xl text-center space-y-8 shadow-2xl">
                                    <div className="relative inline-flex items-center justify-center">
                                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                        <div className="relative w-32 h-32 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center bg-zinc-950">
                                            <span className="text-4xl font-bold">{Math.round((score/(exercise?.items.length || 1))*100)}%</span>
                                            <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-tighter">Correct</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-bold tracking-tight">Session Complete</h2>
                                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                                            You answered {score} out of {exercise?.items.length} questions correctly. 
                                            Review your weak points in the roadmap.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-2 pt-4">
                                        <Button 
                                            onClick={() => {
                                                setStatus('selecting')
                                                setCurrentIdx(0)
                                                setAnswers({})
                                                setShowExplanation(false)
                                            }}
                                            variant="outline"
                                            className="h-12 border-zinc-800 hover:bg-zinc-800 font-bold uppercase tracking-widest text-[10px] gap-2 cursor-pointer w-full sm:w-auto"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" /> Try Again
                                        </Button>
                                        <Button 
                                            onClick={() => router.back()}
                                            className="h-12 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] cursor-pointer w-full sm:w-auto"
                                        >
                                            Finish Session
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {ToastComponent}
            </div>
        </MathJaxContext>
    )
}

export default ExerciseLab
