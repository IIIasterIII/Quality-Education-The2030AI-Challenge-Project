"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { MathJaxContext } from 'better-react-mathjax'
import { Button } from '@workspace/ui/components/button'
import { generateExercise, generateRandomExercise, getSingleNote } from '@/app/api/notes'
import { useToast } from '@/components/toast'
import { ExerciseData, Status } from '@/app/types/exercise'
import ResultPanel from '@/components/exercice/resultPanel'
import GenerationSection from '@/components/exercice/generationSection'
import SelectingPanel from '@/components/exercice/selectingPanel'
import ActivePanel from '@/components/exercice/activePanel'

const config = {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]], displayMath: [["$$", "$$"], ["\\[", "\\]"]] }
};


const ExerciseLab = () => {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = params.id as string
    const topicParam = searchParams.get('topic')
    const [note, setNote] = useState<any>(null)
    const [status, setStatus] = useState<Status>('selecting')
    const [level, setLevel] = useState('foundational')
    const [type, setType] = useState('quiz')
    const [rawOutput, setRawOutput] = useState("")
    const [exercise, setExercise] = useState<ExerciseData | null>(null)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [showExplanation, setShowExplanation] = useState(false)
    const { showToast, ToastComponent } = useToast()

    useEffect(() => {
        (id && id !== 'random') ? getSingleNote(id).then(setNote) : ((id === 'random' && topicParam) && setNote({ title: topicParam }))
    }, [id, topicParam])

    const isNoteEmpty = () => {
        if (!note?.content) return true
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
            id === 'random' ? await generateRandomExercise(note?.title || "General Science", level, onChunk) : await generateExercise(id, level, type, onChunk)

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
        return exercise.items.reduce((acc: number, item: any, idx: number) => { return acc + (answers[idx] === item.answer ? 1 : 0) }, 0)
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
                    </header>

                    <AnimatePresence mode="wait">
                        <SelectingPanel
                            status={status}
                            level={level}
                            setLevel={setLevel}
                            type={type}
                            setType={setType}
                            startGeneration={startGeneration}
                        />

                        <GenerationSection status={status} rawOutput={rawOutput} />

                        <ActivePanel
                            status={status}
                            exercise={exercise}
                            currentIdx={currentIdx}
                            answers={answers}
                            showExplanation={showExplanation}
                            handleAnswer={handleAnswer}
                            nextQuestion={nextQuestion}
                            progressPercentage={progressPercentage}
                            type={type}
                            level={level}
                        />

                        <ResultPanel
                            status={status}
                            score={score}
                            exercise={exercise}
                            setStatus={setStatus}
                            setCurrentIdx={setCurrentIdx}
                            setAnswers={setAnswers}
                            setShowExplanation={setShowExplanation}
                        />
                    </AnimatePresence>
                </div>
                {ToastComponent}
            </div>
        </MathJaxContext>
    )
}

export default ExerciseLab
