"use client"
import React from 'react'
import { Home } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useRouter } from 'next/navigation'

const NotFound = () => {
    const router = useRouter()
    return (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 select-none">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-9xl font-bold tracking-tighter text-zinc-800">404</h1>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
                    <p className="text-zinc-500 text-sm">
                        The page you are looking for doesn't exist or has been moved to a different location.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Button className="h-11 bg-zinc-100 text-black hover:bg-zinc-200
                     gap-2 font-medium px-8 transition-colors cursor-pointer" onClick={() => router.replace('/app/roadmaps')}>
                        <Home className="w-4 h-4" /> Go back home
                    </Button>
                    <Button variant="outline" className="h-11 border-zinc-800
                     hover:bg-zinc-900 gap-2 px-8 cursor-pointer" onClick={() => router.replace('/app/notes')}>
                        Browse Notes
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound