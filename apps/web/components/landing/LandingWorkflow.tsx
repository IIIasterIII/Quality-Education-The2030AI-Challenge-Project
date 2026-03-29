"use client"
import React from 'react'
import { Sparkles, Layers, ShieldCheck, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
    { 
        id: "Step I", 
        title: "Information Capture", 
        desc: "Neural-aware ingestion of documents, transcripts, and notes into a raw substrate.",
        icon: Sparkles,
        theme: "text-blue-400"
    },
    { 
        id: "Step II", 
        title: "Structural Synthesis", 
        desc: "Automated mapping of conceptual dependencies to form a coherent knowledge topology.",
        icon: Layers,
        theme: "text-purple-400"
    },
    { 
        id: "Step III", 
        title: "Logical Integrity", 
        desc: "Final verification of formal deductions against established logic protocols.",
        icon: ShieldCheck,
        theme: "text-emerald-400"
    }
]

export function LandingWorkflow() {
  return (
    <section className="py-24 space-y-24 max-w-5xl mx-auto px-6 select-none">
      <div className="flex flex-col items-center text-center space-y-6">
          <h2 className="text-[3.5rem] font-bold tracking-tighter text-white leading-none">The Refinement Loop</h2>
          <p className="text-zinc-500 text-sm font-medium max-w-md">Cognito applies a three-stage structural refinement to ensure your knowledge is logically sound and topologically mapped.</p>
      </div>

      <div className="relative space-y-12">
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 hidden md:block" />
         
         {steps.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row items-center gap-12 relative ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
             <div className="flex-1 space-y-6 text-center md:text-left group">
                <div className={`text-[10px] font-bold uppercase tracking-widest ${step.theme} opacity-80`}>{step.id}</div>
                <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{step.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                        {step.desc}
                    </p>
                </div>
             </div>

             <div className="relative z-10">
                 <div className="w-24 h-24 rounded-full bg-[#050505] border border-white/5 flex items-center justify-center p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/0" />
                    <step.icon className={`w-8 h-8 ${step.theme} opacity-80`} />
                 </div>
                 
                 {i < steps.length - 1 && (
                    <div className="absolute top-28 left-1/2 -translate-x-1/2 text-zinc-800 animate-bounce hidden md:block">
                        <ArrowDown className="w-4 h-4 opacity-20" />
                    </div>
                 )}
             </div>

             <div className="flex-1 hidden md:block" />
          </motion.div>
         ))}
      </div>
    </section>
  )
}
