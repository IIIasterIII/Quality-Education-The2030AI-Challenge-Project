'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/app/api/firebase'
import { useAppDispatch } from '@/app/store/hooks'
import { setUser, logout } from '@/app/store/userSlice'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setUser({ 
                    uid: user.uid, 
                    email: user.email || "" 
                }))
            } else {
                dispatch(logout())
            }
        })

        return () => unsubscribe()
    }, [dispatch])

    return <>{children}</>
}
