"use client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { loginWithGoogle } from "@/app/api/router"
import { useAppDispatch } from "@/app/store/hooks"
import { setUser } from "@/app/store/userSlice"
import { Infinity as InfinityIcon, Eye, EyeClosed } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function Page() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const Google = () => {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
        </svg>
    )
  }

  const handleGoogleLogin = async () => {
    const userData = await loginWithGoogle()
    if (userData) {
      dispatch(setUser(
        {
          id: userData.id,
          firebase_uid: userData.firebase_uid,
          email: userData.email,
          username: userData.username,
          avatar: userData.avatar
        }
      ))
      router.push(`/app/profiles/${userData.firebase_uid}`)
    }
  }

  return (
    <AnimatePresence>
        {!isMounted ? null : (
            <motion.div 
                key="auth-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed inset-0 min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-white selection:text-black overflow-hidden"
            >
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&display=swap');
                    
                    h1, h2, h3, .serif {
                        font-family: 'Playfair Display', serif !important;
                    }
                    body, input, button {
                        font-family: 'Inter', sans-serif !important;
                    }
                `}</style>
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1240px] h-full lg:max-h-[860px] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">
                    
                    <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden border-r border-white/5">
                        <div className="absolute inset-0 z-0">
                            <Image 
                                src="/assets/vibrant_neon_ribbons.png" 
                                alt="Vibrant Ribbons" 
                                className="object-cover scale-110 translate-x-2"
                                fill
                                priority
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent" />
                        </div>
                        
                        <div className="relative z-10 space-y-6 mt-auto select-none">
                            <h1 className="text-[5.5rem] leading-none font-normal text-white serif italic">
                                Master<br/>Your<br/>Knowledge
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

                        <div className="relative z-10 max-w-md mx-auto w-full space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-[3.5rem] leading-tight font-black serif text-white italic">Welcome Back</h2>
                                <p className="text-zinc-500 text-sm font-medium">Login by Google (Login by email and password - WIP)</p>
                            </div>

                            <div className="space-y-8">
                                <form className="space-y-6 text-left">
                                    <div className="space-y-2.5">
                                        <Label className="text-[11px] font-black uppercase text-zinc-400 ml-1 tracking-widest">Email Address</Label>
                                        <Input 
                                            placeholder="Enter your email" 
                                            className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10 transition-all font-medium text-white px-6 placeholder:text-zinc-700 placeholder:font-normal ring-0 focus-visible:ring-0"
                                        />
                                    </div>
                                    <div className="space-y-2.5 relative">
                                        <Label className="text-[11px] font-black uppercase text-zinc-400 ml-1 tracking-widest">Password</Label>
                                        <div className="relative">
                                            <Input 
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password" 
                                                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10 transition-all font-medium text-white px-6 pr-14 placeholder:text-zinc-700 placeholder:font-normal ring-0 focus-visible:ring-0"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeClosed className="w-4 h-4 opacity-40 hover:opacity-100" /> : <Eye className="w-4 h-4 opacity-40 hover:opacity-100" />}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div className="space-y-4">
                                    <Button className="w-full h-14 rounded-[1.2rem] bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-bold cursor-not-allowed uppercase tracking-[0.2em] text-[10px]">
                                        Sign In (WIP)
                                    </Button>
                                    <Button 
                                        onClick={handleGoogleLogin}
                                        className="w-full h-14 rounded-[1.2rem] bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <Google/>
                                        <span className="opacity-80">Sign In with Google</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  )
}


