"use client"
import React from 'react'
import { 
    GitBranch, 
    BookOpen, 
    Target, 
    Pi, 
    LayoutDashboard, 
    UploadCloud,
    FileJson,
    Share2,
    Timer,
    Globe,
    Code2,
    Activity
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
    description: "Self-verifying mathematical solutions that minimize erroneous questions and ensure logical integrity.",
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
    description: "Adaptive learning paths that can be crafted by the community or designed by yourself.",
    icon: LayoutDashboard,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "S3 Media Pipeline",
    description: "Secure and ultra-fast media management for images, diagrams, and assets.",
    icon: UploadCloud,
    color: "text-sky-500",
    bg: "bg-sky-500/10"
  },
  {
    title: "Structured Exports",
    description: "Convert your research into clean PDF, Markdown, or LaTeX with a single click.",
    icon: FileJson,
    color: "text-lime-500",
    bg: "bg-lime-500/10"
  },
  {
    title: "Knowledge Sharing",
    description: "Publish your topologies to the community hub and collaborate in real-time.",
    icon: Share2,
    color: "text-violet-500",
    bg: "bg-violet-500/10"
  },
  {
    title: "Mindful Timer",
    description: "Optimize focus with integrated deep-work metrics and retention-based intervals.",
    icon: Timer,
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    title: "Open Ecosystem",
    description: "Connect your research with external datasets and global knowledge sources.",
    icon: Globe,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10"
  },
  {
    title: "Logic Sandbox",
    description: "Test complex formulas and algorithms in an isolated, secure backend environment.",
    icon: Code2,
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  },
  {
    title: "Cognitive Analytics",
    description: "Analyze your retention curves and cognitive load with high-fidelity performance metrics.",
    icon: Activity,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  }
]

export function LandingCapabilities() {
  return (
    <section className="space-y-16 py-20 select-none">
      <div className="space-y-6 max-w-2xl mx-auto text-center">
          <h3 className="text-[3rem] font-bold leading-tight text-white">The New Research Standard</h3>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            A modular ecosystem designed for deep learning, architectural research, and verified growth.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
          {features.map((f, i) => (
          <div key={i} className="p-10 bg-zinc-950 space-y-6 group transition-all cursor-default">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <f.icon className={`w-6 h-6 ${f.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
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
