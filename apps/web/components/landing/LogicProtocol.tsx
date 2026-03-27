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
    <div className={`relative group h-full rounded-[32px] bg-zinc-950/40 border border-white/5 overflow-hidden p-6 md:p-8 flex flex-col transition-all duration-500 hover:bg-zinc-950/70 hover:border-white/10 ${accentClass} ${className}`}>
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
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-blue-500/2 blur-[60px] rounded-full scale-125 transition-opacity" />
            <div className="relative w-full h-24 border-l border-b border-zinc-800/80">
               <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-10 pointer-events-none">
                  {Array.from({length: 18}).map((_, i) => <div key={i} className="border border-zinc-700" />)}
               </div>
               
               <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <motion.path
                    d="M 0 20 Q 25 0, 50 20 T 100 20"
                    fill="none"
                    stroke="rgba(59,130,246,0.8)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
               </svg>

               <div className="absolute -top-6 right-0 text-xl font-bold text-white italic drop-shadow-xl select-none">
                  <MathJax>{"$y = \\sin(x)$"}</MathJax>
               </div>
            </div>
        </div>
    )
}

const LiteratureLibrary = () => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
       <div className="absolute inset-0 bg-emerald-500/2 blur-[80px] rounded-full opacity-60" />
       <div className="relative z-10 flex flex-col gap-2 w-full max-w-[180px]">
          {[
              { a: "Dostoyevsky", t: "The Idiot" },
              { a: "Kafka", t: "The Metamorphosis" }
          ].map((book, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group/item hover:bg-emerald-500/10 transition-colors">
                  <div className="space-y-0.5">
                     <p className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest">{book.a}</p>
                     <p className="text-[9px] italic font-serif text-white/80">{book.t}</p>
                  </div>
                  <BookOpen className="w-2.5 h-2.5 text-zinc-700 group-hover/item:text-emerald-500 transition-colors" />
              </div>
          ))}
       </div>
    </div>
)

const SortVisualization = () => {
    const [arr, setArr] = useState([6, 2, 8, 3, 5])
    useEffect(() => {
        const int = setInterval(() => {
            setArr((prev) => {
                const next = [...prev];
                let swapped = false;
                for (let i = 0; i < next.length - 1; i++) {
                    const current = next[i];
                    const nextVal = next[i + 1];
                    if (current !== undefined && nextVal !== undefined && current > nextVal) {
                        next[i] = nextVal;
                        next[i + 1] = current;
                        swapped = true;
                        break;
                    }
                }
                return swapped ? next : [6, 2, 8, 3, 5].sort(() => Math.random() - 0.5);
            });
        }, 1500);
        return () => clearInterval(int);
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <div className="flex gap-2">
                {arr.map((val) => (
                    <motion.div
                        key={val}
                        layout
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-xs font-black font-mono text-amber-500 shadow-xl"
                    >
                        {val}
                    </motion.div>
                ))}
            </div>
            <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-[8px] font-mono text-zinc-600">
                <Terminal className="w-2.5 h-2.5 text-amber-500" />
                <span>Bubble_Sort::Active</span>
            </div>
        </div>
    )
}

const SecurityTrick = () => (
    <div className="relative w-full h-full flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-rose-500/2 blur-[80px] rounded-full scale-125 opacity-60" />
       <div className="relative flex items-center justify-center">
          {[1, 2].map((i) => (
             <motion.div
               key={i}
               className="absolute rounded-full border border-rose-500/20"
               initial={{ width: 40, height: 40, opacity: 0.5 }}
               animate={{ width: 40 + i * 40, height: 40 + i * 40, opacity: 0 }}
               transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
             />
          ))}
          <ShieldCheck className="w-10 h-10 text-rose-500/80 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]" />
       </div>
    </div>
)

const PhysicsTrick = () => (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
       <div className="absolute inset-0 opacity-10">
          {Array.from({length: 12}).map((_, i) => (
             <motion.div key={i} className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }} />
          ))}
       </div>
       <div className="absolute inset-0 bg-purple-500/2 blur-[80px] rounded-full opacity-60 scale-125" />
       <div className="relative space-y-4 text-center group-hover:scale-110 transition-transform duration-700">
          <Atom className="w-10 h-10 text-purple-400/80 mx-auto animate-[spin_10s_linear_infinite]" />
          <div className="text-xl font-black text-white italic leading-none opacity-90">
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <BentoCard 
          className="md:col-span-12 lg:col-span-7 h-[280px]"
          title="Mathematics"
          description="High-Fidelity Analysis"
          accentColor="blue"
        >
          <MathPlotter />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-5 h-[280px]"
          title="Literature"
          description="Knowledge Synthesis"
          accentColor="emerald"
        >
          <LiteratureLibrary />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-5 h-[240px]"
          title="Informatics"
          description="Algorithm Logic"
          accentColor="amber"
        >
          <SortVisualization />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-3 h-[240px]"
          title="Security"
          description="Integrity"
          accentColor="rose"
        >
          <SecurityTrick />
        </BentoCard>

        <BentoCard 
          className="md:col-span-6 lg:col-span-4 h-[240px]"
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
