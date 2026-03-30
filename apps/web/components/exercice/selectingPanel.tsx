import React from 'react'
import { motion } from 'framer-motion'
import { Atom, Infinity, Brain, Target, Sparkles, Dna, ChevronRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Status } from '@/app/types/exercise'

const SelectingPanel = (
    { status, level, setLevel, type, setType, startGeneration }:
        {
            status: Status,
            level: string,
            setLevel: (level: string) => void,
            type: string,
            setType: (type: string) => void,
            startGeneration: () => void
        }) => {

    if (status !== 'selecting') return null

    return (
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
    )
}

export default SelectingPanel