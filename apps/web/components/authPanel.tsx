"use client"
import { Button } from "@workspace/ui/components/button"
import { loginWithGoogle } from "@/app/api/router"
import { useAppDispatch } from "@/app/store/hooks"
import { setUser } from "@/app/store/userSlice"
import { motion } from "framer-motion"
import { Infinity } from "lucide-react"
import { useRouter } from "next/navigation"

export function AuthPanel() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const Google = () => {
    return (
        <svg className="w-5 h-5 transition-transform group-hover/btn:scale-110" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
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
    <div className="relative w-full max-w-md p-px rounded-[2.5rem] bg-linear-to-b from-white/80 to-transparent overflow-hidden group">
        <div className="relative bg-zinc-950 rounded-t-[2.4rem] p-10 md:p-14 space-y-12">
            
            <div className="space-y-6 text-center">
                <div>
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-tr from-zinc-200 to-white" />
                        <Infinity className="relative w-10 h-10 text-black fill-black" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white italic uppercase"> Cognito</h1>
                </div>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <Button 
                        onClick={handleGoogleLogin}
                        className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 group/btn shadow-xl shadow-white/5 active:scale-95"
                    >
                        <Google/>
                        Initialize with Google
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}
