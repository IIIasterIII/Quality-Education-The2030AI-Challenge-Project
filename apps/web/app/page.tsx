"use client"
import React from 'react'
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/landing/Hero"
import { LandingCapabilities } from "@/components/landing/LandingCapabilities"
import { LandingWorkflow } from "@/components/landing/LandingWorkflow"
import { LogicProtocol } from "@/components/landing/LogicProtocol"
import { LandingCTA } from "@/components/landing/LandingCTA"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white selection:text-black font-sans overflow-x-hidden">
      <Navbar />
      
      <main className="pt-32 pb-40 px-6 relative">
        <div className="max-w-6xl mx-auto space-y-40">
          <Hero />
          <LandingCapabilities />
          <LandingWorkflow />
          <LogicProtocol />
          <LandingCTA />
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
