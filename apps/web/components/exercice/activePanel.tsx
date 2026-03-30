import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Card } from '@workspace/ui/components/card'
import { MathJax } from 'better-react-mathjax'
import { Button } from '@workspace/ui/components/button'
import { CheckCircle2, XCircle, Info, ChevronRight } from 'lucide-react'
import { ExerciseData, Status } from '@/app/types/exercise'

interface ActivePanelProps {
    status: Status,
    exercise: ExerciseData | null
    currentIdx: number
    answers: Record<number, string>
    showExplanation: boolean
    handleAnswer: (option: string) => void
    nextQuestion: () => void
    progressPercentage: number
    type: string
    level: string
}

const ActivePanel = ({
    status,
    exercise,
    currentIdx,
    answers,
    showExplanation,
    handleAnswer,
    nextQuestion,
    progressPercentage,
    type,
    level
}: ActivePanelProps) => {
    if (status != 'active') return null
    return (
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
                        {exercise?.items[currentIdx]?.question || ''}
                    </MathJax>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {(exercise?.items[currentIdx]?.options || []).map((opt, i) => {
                        const isSelected = answers[currentIdx] === opt
                        const isCorrect = opt === (exercise?.items[currentIdx]?.answer || '')

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
                                    {exercise?.items[currentIdx]?.explanation || ''}
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
    )
}

export default ActivePanel