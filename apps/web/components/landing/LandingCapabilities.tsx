"use client"
import React from 'react'
import { 
    GitBranch, 
    BookOpen, 
    Target, 
    Pi, 
    LayoutDashboard, 
    ShieldCheck, 
    Search, 
    Infinity 
} from 'lucide-react'

const features = [
  {
    title: "Knowledge Topologies",
    description: "Visualize subjects as interconnected nodes. Map complex dependencies between cross-disciplinary fields.",
    icon: GitBranch,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Hierarchical Drafting",
    description: "Draft research notes with native MathJax support and AI-assisted conceptual expansion.",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Verified Exercises",
    description: "Solve challenges where every mathematical step is verified against Python-based logic protocols.",
    icon: Target,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "Numerical Workbench",
    description: "High-fidelity rendering of derivations and formulas for deep-dive scientific analysis.",
    icon: Pi,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Growth Roadmaps",
    description: "Dynamic study paths that adjust based on your real-time performance and retention metrics.",
    icon: LayoutDashboard,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Integrity Engine",
    description: "A backend validation layer ensuring that AI-generated content adheres to formal logic.",
    icon: ShieldCheck,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    title: "Real-time Search",
    description: "Instantly index your entire knowledge graph with semantically aware deep-search.",
    icon: Search,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    title: "Neural Synergy",
    description: "Collaborative AI that learns your specific research style to suggest relevant sub-nodes.",
    icon: Infinity,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
]

export function LandingCapabilities() {
  return (
    <section className="space-y-16">
      <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-zinc-600 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-900" />
              Core Platform Capabilities
              <div className="h-px flex-1 bg-zinc-900" />
          </h2>
          <p className="text-zinc-500 text-center text-sm font-medium">A modular ecosystem for deep research and hierarchical learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
          {features.map((f, i) => (
          <div key={i} className="p-10 bg-zinc-950 space-y-6 group hover:bg-zinc-900/50 transition-all cursor-default">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{f.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium transition-colors group-hover:text-zinc-400">
                      {f.description}
                  </p>
              </div>
          </div>
          ))}
      </div>
    </section>
  )
}
