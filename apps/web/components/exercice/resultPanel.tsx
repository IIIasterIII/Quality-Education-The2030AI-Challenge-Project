import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ExerciseData, Status } from '@/app/types/exercise'

const ResultPanel = (
    { status, score, exercise, setStatus, setCurrentIdx, setAnswers, setShowExplanation }:
        {
            status: Status; score: number; exercise: ExerciseData | null; setStatus: (status: Status) => void;
            setCurrentIdx: (idx: number) => void; setAnswers: (answers: Record<number, string>) => void;
            setShowExplanation: (showExplanation: boolean) => void;
        }) => {
    const router = useRouter()

    if (status !== 'finished') return null
    const result = Math.round((score / (exercise?.items.length || 1)) * 100)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-12 py-12"
        >
            <Card className="bg-zinc-900/50 border-zinc-800 p-12 w-full max-w-xl text-center space-y-8 shadow-2xl">
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="relative w-32 h-32 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center bg-zinc-950">
                        <span className="text-4xl font-bold">{result}%</span>
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
                        className="h-12 border-zinc-800 hover:bg-zinc-800 font-bold uppercase 
                    tracking-widest text-[10px] gap-2 cursor-pointer w-full sm:w-auto"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Try Again
                    </Button>
                    <Button
                        onClick={() => router.back()}
                        className="h-12 bg-primary hover:bg-primary/90 text-white
                    font-bold uppercase tracking-widest text-[10px] cursor-pointer w-full sm:w-auto"
                    >
                        Finish Session
                    </Button>
                </div>
            </Card>
        </motion.div>
    )
}

export default ResultPanel