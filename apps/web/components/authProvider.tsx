"use client"
import { useAppDispatch, useAppSelector } from '../app/store/hooks'
import { setUser, setLoading } from '../app/store/userSlice'
import { getMe } from '../app/api/router'
import { useEffect } from 'react'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const { isLoggedIn } = useAppSelector((state) => state.user)
    useEffect(() => {
        if (!isLoggedIn) {
            const fetchMe = async () => {
                try {
                    const data = await getMe()
                    console.log(data)
                    if (data && data.firebase_uid) dispatch(setUser(data))
                } catch (e) {
                    console.error("Not authorized")
                } finally {
                    dispatch(setLoading(false))
                }
            }
            fetchMe()
        }
    }, [isLoggedIn, dispatch])
    return <>{children}</>
}