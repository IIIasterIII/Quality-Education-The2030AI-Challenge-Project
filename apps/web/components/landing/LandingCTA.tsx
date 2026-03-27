"use client"
import React from 'react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'

export function LandingCTA() {
  return (
    <section className="text-center space-y-12">
      <div className="space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter italic">Ready to Begin.</h2>
          <p className="text-zinc-500 text-lg font-medium max-w-xl mx-auto">Join the next generation of researchers using formally verified intelligence.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="h-16 px-12 rounded-3xl bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs shadow-3xl shadow-white/5">
              <Link href="/auth">Create Account</Link>
          </Button>
          <Button variant="outline" className="h-16 px-12 rounded-3xl border-zinc-800 hover:bg-zinc-900 font-bold uppercase tracking-widest text-xs text-zinc-400">
              Consult Experts
          </Button>
      </div>
    </section>
  )
}
