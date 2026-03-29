"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Fingerprint, Activity, MousePointer2, Layers } from 'lucide-react'

export function LandingSpotlight() {
  return (
    <section className="py-24 space-y-16 max-w-7xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
              <div className="space-y-6">
                  <h2 className="text-[4rem] font-bold leading-tight text-white tracking-tight">
                      Structural<br/>Knowledge mapping
                  </h2>
                  <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-lg">
                      Move beyond simple lists. Cognito visualizes your entire knowledge field as a dynamic neural topology, uncovering hidden dependencies and logical clusters.
                  </p>
              </div>

              <div className="space-y-8">
                  {[
                      { icon: Fingerprint, t: "Adaptive Nodes", d: "Nodes automatically resize based on real-time retention and cognitive load." },
                      { icon: Layers, t: "Multi-level Overlays", d: "View cross-disciplinary connections through interactive topological layers." },
                      { icon: Activity, t: "Real-time Dynamics", d: "Watch your knowledge field evolve as you discover new concepts and sub-links." }
                  ].map((item, i) => (
                      <div key={i} className="flex items-start gap-6 group select-none">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-white opacity-80" />
                          </div>
                          <div className="space-y-1 pt-1">
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.t}</h3>
                              <p className="text-sm text-zinc-500 font-medium max-w-md">{item.d}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="relative group p-10 lg:p-0">
              <div className="relative aspect-square w-full rounded-[4rem] bg-[#050505] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.3)] group-hover:border-white/10 transition-all duration-700">
                  <div className="absolute inset-0 flex items-center justify-center p-20">
                      <div className="relative w-full h-full">
                          <motion.div 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] z-20 cursor-pointer"
                          >
                              <GitBranch className="w-8 h-8 text-black" />
                          </motion.div>

                          {[
                            { x: "20%", y: "20%", c: "bg-blue-500", label: "Quantum Logic" },
                            { x: "80%", y: "30%", c: "bg-purple-500", label: "Hierarchies" },
                            { x: "30%", y: "80%", c: "bg-emerald-500", label: "Verified Proofs" },
                            { x: "75%", y: "75%", c: "bg-amber-500", label: "Neural Topology" },
                            { x: "50%", y: "15%", c: "bg-rose-500", label: "Drafting" }
                          ].map((node, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i }}
                                style={{ top: node.x, left: node.y }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group/node cursor-pointer"
                              >
                                  <div className={`w-14 h-14 rounded-full ${node.c} opacity-20 blur-[10px] group-hover/node:opacity-40 transition-opacity`} />
                                  <div className={`absolute inset-0 w-14 h-14 rounded-full border-2 border-white/20 bg-black flex items-center justify-center group-hover/node:border-white transition-colors`}>
                                      <div className={`w-3 h-3 rounded-full ${node.c}`} />
                                  </div>
                                  <div className="absolute top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all duration-300 pointer-events-none">
                                      <span className="text-[9px] font-black uppercase text-white bg-black/80 px-2.5 py-1.5 rounded-lg border border-white/10 tracking-widest whitespace-nowrap backdrop-blur-sm">
                                          {node.label}
                                      </span>
                                  </div>
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[200px] h-px bg-linear-to-r from-white/20 to-transparent rotate-0 origin-left opacity-10 group-hover/node:opacity-40" />
                              </motion.div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </section>
  )
}
