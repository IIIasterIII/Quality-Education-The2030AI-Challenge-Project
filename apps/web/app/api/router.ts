import { NextResponse } from "next/server"
import { auth, googleProvider } from "./firebase"
import { signInWithPopup } from "firebase/auth"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function GET() {
    return NextResponse.json({ message: "Hello World" })
}

export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider)
        const idToken = await result.user.getIdToken(true)
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Backend sync failed')
        return {
            uid: result.user.uid,
            email: result.user.email
        }
    } catch (error) {
        console.error("Login error:", error)
        return null
    }
}

export async function logoutFromBackend() {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        return await response.json()
    } catch (error) {
        return null
    }
}