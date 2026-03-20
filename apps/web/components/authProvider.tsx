"use client"
import { useAppDispatch, useAppSelector } from '../app/store/hooks'
import { setUser, setLoading } from '../app/store/userSlice'
import { getMe } from '../app/api/router'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const { isLoggedIn } = useAppSelector((state) => state.user)
    useEffect(() => {
        if (!isLoggedIn) {
            const fetchMe = async () => {
                try {
                    const data = await getMe()
                    if (data && data.firebase_uid) dispatch(setUser(data))
                    else if (pathname.startsWith('/app')) router.push('/auth')
                } catch (e) {
                    console.error("Not authorized")
                    if (pathname.startsWith('/app')) router.push('/auth')
                } finally {
                    dispatch(setLoading(false))
                }
            }
            fetchMe()
        }
    }, [isLoggedIn, dispatch, pathname, router])
    return <>{children}</>
}