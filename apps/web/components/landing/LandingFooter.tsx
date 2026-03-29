"use client"
import React from 'react'
import { Infinity } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-900 py-10 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Infinity className="w-6 h-6 text-black fill-black" />
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase italic text-white leading-none">Cognito</span>
              </div>
            </div>
        </div>
        <div className="max-w-6xl mx-auto mt-5 border-t border-zinc-900/50 flex flex-col md:flex-row
         items-center justify-between text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
            <span>© 2026 Cognito. Precision Intelligence.</span>
            <span className="mt-4 md:mt-0 tracking-widest">EST. 2026 // COGNITO</span>
        </div>
    </footer>
  )
}
