"use client"
import React from 'react'
import { Infinity } from 'lucide-react'
import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-900 py-24 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Infinity className="w-6 h-6 text-black fill-black" />
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase italic text-white leading-none">Cognito</span>
              </div>
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.2em] pl-1">Discrete Knowledge Architectures</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300">Platform</h4>
                  <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <li><Link href="#" className="hover:text-white">Network</Link></li>
                    <li><Link href="#" className="hover:text-white">Roadmap</Link></li>
                    <li><Link href="#" className="hover:text-white">Lab</Link></li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300">Company</h4>
                  <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <li><Link href="#" className="hover:text-white">Security</Link></li>
                    <li><Link href="#" className="hover:text-white">Whitepaper</Link></li>
                    <li><Link href="#" className="hover:text-white">Careers</Link></li>
                  </ul>
               </div>
               <div className="hidden lg:block space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300">Legal</h4>
                  <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                    <li><Link href="#" className="hover:text-white">Terms</Link></li>
                  </ul>
               </div>
            </div>
        </div>
        <div className="max-w-6xl mx-auto pt-20 mt-20 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700">
            <span>© 2026 Cognito. Precision Intelligence.</span>
            <span className="mt-4 md:mt-0 tracking-widest">EST. 2026 // COGNITO</span>
        </div>
    </footer>
  )
}
