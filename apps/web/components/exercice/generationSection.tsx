import { Status } from '@/app/types/exercise'
import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const GenerationSection = ({ status, rawOutput }: { status: Status, rawOutput: string }) => {
    if (status !== 'generating') return null
    return (
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
    )
}

export default GenerationSection