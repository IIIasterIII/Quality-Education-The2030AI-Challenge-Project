import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Eye, EyeClosed, Loader2, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loginByEmail, registerByEmail, loginWithGoogle } from '@/app/api/router'
import { setUser } from '@/app/store/userSlice'
import { useAppDispatch } from '@/app/store/hooks'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
    showPassword: boolean
    setShowPassword: (showPassword: boolean) => void
}

const AuthForm = ({ showPassword, setShowPassword }: AuthFormProps) => {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingGoogle, setLoadingGoogle] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const Google = () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
        </svg>
    )

    const handleSuccess = (userData: any) => {
        dispatch(setUser({
            id: userData.id,
            firebase_uid: userData.firebase_uid,
            email: userData.email,
            username: userData.username,
            avatar: userData.avatar
        }))
        router.push(`/app/profiles/${userData.firebase_uid}`)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const userData = mode === 'login'
                ? await loginByEmail(email, password)
                : await registerByEmail(email, password)

            if (userData) {
                handleSuccess(userData)
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLoginClick = async () => {
        setLoadingGoogle(true)
        setError(null)
        try {
            const userData = await loginWithGoogle()
            if (userData) {
                handleSuccess(userData)
            } else {
                setError("Google login failed. Please try again.")
            }
        } catch (err: any) {
            setError(err.message || "Google login error")
        } finally {
            setLoadingGoogle(false)
        }
    }

    return (
        <div className="relative z-10 max-w-sm mx-auto w-full flex flex-col items-center">
            <div className="text-center space-y-3 mb-10">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[3.5rem] leading-tight font-black serif text-white italic"
                    >
                        {mode === 'login' ? 'Welcome Back' : 'Get Started'}
                    </motion.h2>
                </AnimatePresence>
                <p className="text-zinc-500 text-sm font-medium">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="ml-2 text-white hover:underline transition-all font-bold"
                    >
                        {mode === 'login' ? 'Create one' : 'Sign in'}
                    </button>
                </p>
            </div>

            <div className="w-full space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-zinc-400 ml-1 tracking-widest opacity-60">Email Address</Label>
                        <Input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10 
                        transition-all font-medium text-white px-5 placeholder:text-zinc-700 
                        placeholder:font-normal ring-0 focus-visible:ring-0 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5 relative">
                        <div className="flex items-center justify-between ml-1">
                            <Label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest opacity-60">Password</Label>
                            {mode === 'login' && (
                                <button type="button" className="text-[10px] text-zinc-500 hover:text-white transition-colors font-medium">
                                    Forgot?
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                required
                                minLength={6}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-white/20
                            focus:bg-white/10 transition-all font-medium text-white px-5 pr-12
                            placeholder:text-zinc-700 placeholder:font-normal ring-0 focus-visible:ring-0 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600
                            hover:text-white transition-colors p-1"
                            >
                                {showPassword ? <EyeClosed className="w-3.5 h-3.5 opacity-40 hover:opacity-100" /> : <Eye className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                            >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        disabled={loading || loadingGoogle}
                        className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200
                        transition-all duration-300 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0a0a0a] px-4 text-zinc-600 font-bold">Or continue with</span></div>
                </div>

                <Button
                    type="button"
                    disabled={loading || loadingGoogle}
                    onClick={handleGoogleLoginClick}
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white
                    hover:bg-white/10 hover:border-white/20 transition-all duration-300 font-bold uppercase tracking-widest text-[11px]
                    flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    {loadingGoogle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Google />}
                    <span>Google</span>
                </Button>
            </div>
        </div>
    )
}

export default AuthForm