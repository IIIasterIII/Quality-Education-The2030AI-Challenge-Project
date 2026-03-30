import { User } from 'lucide-react'
import React from 'react'

const NotFoundProfile = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
                <User className="w-10 h-10 text-zinc-700" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Profile not found</h2>
            <p className="text-zinc-500 max-w-xs mb-8">
                The user you are looking for does not exist or has private visibility settings.
            </p>
        </div>
    )
}

export default NotFoundProfile