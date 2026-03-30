"use client"
import { Infinity as InfinityIcon } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import AuthForm from "@/components/auth/authForm"

export default function Page() {
    const [showPassword, setShowPassword] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => { setIsMounted(true) }, [])

    return (
        <div>
            <AnimatePresence>
                {!isMounted ? null : (
                    <motion.div
                        key="auth-panel"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="fixed inset-0 min-h-screen w-full bg-[#050505] flex items-center
                     justify-center p-4 md:p-10 font-sans selection:bg-white selection:text-black overflow-hidden"
                    >
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&display=swap');
                            h1, h2, h3, .serif { font-family: 'Playfair Display', serif !important; }
                            body, input, button { font-family: 'Inter', sans-serif !important; }
                        `}} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1240px] h-full lg:max-h-[860px]
                     bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">

                            <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden border-r border-white/5">
                                <div className="absolute inset-0 z-0">
                                    <Image src="/assets/vibrant_neon_ribbons.png" alt="Vibrant Ribbons" className="object-cover scale-110 translate-x-2" fill priority />
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent" />
                                </div>

                                <div className="relative z-10 space-y-6 mt-auto select-none">
                                    <h1 className="text-[5.5rem] leading-none font-normal text-white serif italic">
                                        Master<br />Your<br />Knowledge
                                    </h1>
                                    <p className="max-w-[340px] text-sm leading-relaxed text-white/40 font-medium tracking-wide">
                                        Build structural connections between ideas. Cognito is your cognitive lab for reinforced learning and knowledge mastery.
                                    </p>
                                </div>
                            </div>

                            <div className="p-10 md:p-24 flex flex-col justify-between bg-[#0a0a0a] overflow-y-auto relative">
                                <div className="relative z-10 flex justify-center items-center gap-2 mb-12">
                                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <InfinityIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-bold text-sm tracking-tight uppercase text-white/90">Cognito</span>
                                </div>

                                <AuthForm
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
