"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Hash, Binary, Users, ShieldCheck } from 'lucide-react'
import { getStats } from '@/app/api/router'

export function LandingStats() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function loadStats() {
        const stats = await getStats()
        if (stats) {
            setData(stats)
        }
    }
    loadStats()
  }, [])

  const stats = [
    { 
        label: "Active Knowledge Nodes", 
        value: data ? data.nodes : 0, 
        icon: Hash, 
        desc: "Interconnected data points mapped", 
        color: "text-blue-500" 
    },
    { 
        label: "Verified Logic Proofs", 
        value: data ? data.proofs : 0, 
        icon: Binary, 
        desc: "Mathematical claims vetted", 
        color: "text-emerald-500" 
    },
    { 
        label: "Platform Researchers", 
        value: data ? data.users : 0, 
        icon: Users, 
        desc: "Collaborating across domains", 
        color: "text-purple-500" 
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-px lg:justify-items-center">
        {stats.map((s, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4 relative z-10"
            >
                <div className="flex flex-col lg:flex-row items-center gap-4 border border-white/5 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <s.icon className={`w-5 h-5 ${s.color} opacity-60`} />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.label}</span>
                        <div className="text-[2.5rem] font-bold text-white tracking-tighter leading-none">{s.value}</div>
                    </div>
                </div>
                <p className="text-sm text-zinc-400 tracking-wide">{s.desc}</p>
            </motion.div>
        ))}
    </div>
  )
}
