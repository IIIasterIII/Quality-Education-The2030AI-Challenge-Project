"use client"
import React from 'react'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { useAppSelector } from '@/app/store/hooks'

export function Hero() {
  const user = useAppSelector(state => state.user)

  return (
    <div className="max-w-4xl space-y-10 mx-auto">

      <h1 className='text-4xl font-bold text-center'>
        Stop simply consuming content. <br/>
        Transform lectures, videos, and presentations <br/>
        into a knowledge system with a single click.
      </h1>
      <div className="pt-4 gap-4 flex items-center justify-center">
        <Button asChild className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs shadow-2xl shadow-white/10 group">
         {user ? <Link href={`/app/roadmaps`}>Start Now</Link> : <Link href="/auth">Initialize Session</Link>}
        </Button>
        <Button variant="outline" className="h-14 px-10 rounded-2xl border-zinc-800 hover:bg-zinc-900 font-bold uppercase tracking-widest text-xs text-zinc-400">
          Documentation
        </Button>
      </div>
    </div>
  )
}
