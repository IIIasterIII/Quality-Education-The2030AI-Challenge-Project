"use client"
import React from 'react'
import { Terminal } from 'lucide-react'

const steps = [
    { s: "Step 01", t: "Ingestion", d: "A single prompt or note triggers a neural topology scan." },
    { s: "Step 02", t: "Expansion", d: "AI builds a hierarchical structure of sub-concepts instantly." },
    { s: "Step 03", t: "Verification", d: "Every mathematical claim is vetted by our Python logic guard." }
]

export function LandingWorkflow() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center">
       {steps.map((step, i) => (
         <div key={i} className="space-y-6 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-900 relative group overflow-hidden">
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] font-mono">{step.s}</div>
            <h3 className="text-2xl font-bold tracking-tight text-white">{step.t}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">{step.d}</p>
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Terminal className="w-24 h-24 rotate-12" />
            </div>
         </div>
       ))}
    </section>
  )
}
