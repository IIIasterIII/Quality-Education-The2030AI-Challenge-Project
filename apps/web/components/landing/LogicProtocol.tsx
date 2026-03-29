"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    ShieldCheck, 
    Atom, 
    BookOpen,
    Terminal,
} from 'lucide-react'
import { MathJax } from 'better-react-mathjax'

const BentoCard = ({ children, className = "", title, description, accentColor = "blue" }: { 
  children?: React.ReactNode, 
  className?: string, 
  title: string, 
  description: string,
  accentColor?: string 
}) => {
  const accentClasses = {
    blue: "decoration-blue-500/50 group-hover:decoration-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.02)]",
    emerald: "decoration-emerald-500/50 group-hover:decoration-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.02)]",
    amber: "decoration-amber-500/50 group-hover:decoration-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.02)]",
    rose: "decoration-rose-500/50 group-hover:decoration-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.02)]",
    purple: "decoration-purple-500/50 group-hover:decoration-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.02)]"
  } as const;

  const accentClass = (accentClasses[accentColor as keyof typeof accentClasses] || accentClasses.blue) as string;

  return (
    <div className={`relative group h-full rounded-[32px] bg-zinc-950/40 
      border select-none border-white/5 overflow-hidden p-6 md:p-8 flex flex-col transition-all
      duration-500 hover:bg-zinc-950/70 hover:border-white/10 ${accentClass} ${className}`}>
      <div className="relative z-10 space-y-1.5 mb-4 pointer-events-none">
        <h3 className={`text-lg md:text-xl font-bold text-white tracking-widest uppercase italic underline underline-offset-4 transition-all decoration-2 ${accentClass.split(' ')[0]}`}>
          {title}
        </h3>
        <p className="text-zinc-600 text-[8px] font-bold leading-relaxed max-w-[180px] uppercase tracking-widest">{description}</p>
      </div>
      <div className="flex-1 relative flex items-center justify-center">
        {children}
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-white/1 to-transparent pointer-events-none" />
    </div>
  )
}

const MathPlotter = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full aspect-2/1 max-h-[180px]">
                <div className="absolute -top-6 left-0 text-[9px] font-black text-blue-500/40 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                    Function Analysis : Gaussian
                </div>
                <div className="absolute -bottom-6 right-0 text-[9px] font-black text-blue-500/40 uppercase tracking-widest">
                    Domain [t]
                </div>

                <div className="absolute inset-0 border-l border-b border-white/10">
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10 pointer-events-none">
                        {Array.from({length: 24}).map((_, i) => <div key={i} className="border-[0.5px] border-blue-500/30" />)}
                    </div>
                </div>

                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible translate-y-px">
                    <defs>
                        <linearGradient id="plotGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        d="M 0 40 Q 50 10, 100 40 L 100 40 L 0 40 Z"
                        fill="url(#plotGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    />

                    <motion.path
                        d="M 0 40 Q 50 10, 100 40"
                        fill="none"
                        stroke="rgba(59,130,246,0.8)"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    <motion.circle 
                        r="1.2"
                        fill="#fff"
                        animate={{ 
                            cx: [0, 50, 100], 
                            cy: [40, 10, 40],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="shadow-[0_0_10px_#fff]"
                    />
                </svg>

                <div className="absolute top-0 right-0 p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 scale-90 origin-top-right shadow-2xl">
                    <MathJax>{"$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$"}</MathJax>
                </div>
            </div>
        </div>
    )
}

const LiteratureLibrary = () => (
    <div className="relative w-full h-full flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-emerald-500/2 blur-[80px] rounded-full opacity-60" />
       <div className="relative z-10 grid grid-cols-1 gap-2.5 w-full max-w-[220px]">
          {[
              { a: "Fyodor Dostoyevsky", t: "Notes from Underground", c: "Existentialism" },
              { a: "Franz Kafka", t: "The Trial", c: "Absurdism" }
          ].map((book, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5, backgroundColor: "rgba(16,185,129,0.1)" }}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-center group/item transition-all select-none"
              >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">{book.a}</p>
                     <p className="text-[11px] font-bold text-white truncate leading-tight mt-0.5">{book.t}</p>
                     <div className="mt-1.5 px-2 py-0.5 rounded-md bg-white/5 text-[15px] font-bold text-zinc-300 inline-block">
                        {book.c}
                     </div>
                  </div>
              </motion.div>
          ))}
       </div>
    </div>
)

const SortVisualization = () => {
    const [arr, setArr] = useState([6, 2, 8, 3, 5])
    const [swapping, setSwapping] = useState<number[]>([])

    useEffect(() => {
        const int = setInterval(() => {
            setArr((prev) => {
                const next = [...prev];
                let swapped = false;
                for (let i = 0; i < next.length - 1; i++) {
                    const current = next[i];
                    const nextVal = next[i + 1];
                    if (current !== undefined && nextVal !== undefined && current > nextVal) {
                        setSwapping([i, i + 1])
                        next[i] = nextVal;
                        next[i + 1] = current;
                        swapped = true;
                        break;
                    }
                }
                if (!swapped) {
                    setSwapping([])
                    return [6, 2, 8, 3, 5].sort(() => Math.random() - 0.5);
                }
                return next;
            });
        }, 1200);
        return () => clearInterval(int);
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <div className="flex gap-2.5">
                {arr.map((val, i) => (
                    <motion.div
                        key={val}
                        layout
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-black font-mono shadow-2xl transition-all duration-300 ${
                            swapping.includes(i) 
                            ? 'bg-amber-500/20 border-amber-500 text-amber-500 scale-110' 
                            : 'bg-zinc-900 border-white/5 text-zinc-400'
                        }`}
                    >
                        {val}
                    </motion.div>
                ))}
            </div>
            <div className="mt-8 flex items-center gap-2.5 px-5 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <Terminal className="w-3 h-3 text-amber-500" />
                <span>Bubble_Sort::Recursive</span>
            </div>
        </div>
    )
}

const SecurityTrick = () => (
    <div className="relative w-full h-full flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-rose-500/2 blur-[80px] rounded-full scale-125 opacity-60" />
       <div className="relative flex items-center justify-center">
          {[1, 2, 3].map((i) => (
             <motion.div
               key={i}
               className="absolute rounded-full border border-rose-500/10"
               initial={{ width: 60, height: 60, opacity: 0.5 }}
               animate={{ width: 60 + i * 50, height: 60 + i * 50, opacity: 0 }}
               transition={{ duration: 4, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
             />
          ))}
          <div className="relative group">
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
            <ShieldCheck className="relative w-12 h-12 text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-transform group-hover:scale-110" />
          </div>
       </div>
    </div>
)

const PhysicsTrick = () => (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
       <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
       <div className="absolute inset-0 opacity-10">
          {Array.from({length: 20}).map((_, i) => (
             <motion.div key={i} className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ opacity: [0.2, 1, 0.2], y: [0, -10, 0] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }} />
          ))}
       </div>
       <div className="absolute inset-0 bg-purple-500/2 blur-[100px] rounded-full opacity-60 scale-150" />
       <div className="relative space-y-5 text-center transition-all duration-700">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Atom className="w-12 h-12 text-purple-400/80 mx-auto" />
          </motion.div>
          <div className="text-2xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
             <MathJax>{"$E=mc^2$"}</MathJax>
          </div>
       </div>
    </div>
)

export function LogicProtocol() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <section className="py-20 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto">
        <BentoCard 
          className="md:col-span-12 lg:col-span-7 h-[300px]"
          title="Mathematics"
          description="High-Fidelity Analysis"
          accentColor="blue"
        >
          <MathPlotter />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-5 h-[300px]"
          title="Literature"
          description="Knowledge Synthesis"
          accentColor="emerald"
        >
          <LiteratureLibrary />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-5 h-[260px]"
          title="Informatics"
          description="Algorithm Logic"
          accentColor="amber"
        >
          <SortVisualization />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-3 h-[260px]"
          title="Security"
          description="Integrity"
          accentColor="rose"
        >
          <SecurityTrick />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-4 h-[260px]"
          title="Physics"
          description="Natural Law"
          accentColor="purple"
        >
          <PhysicsTrick />
        </BentoCard>
      </div>
    </section>
  )
}
