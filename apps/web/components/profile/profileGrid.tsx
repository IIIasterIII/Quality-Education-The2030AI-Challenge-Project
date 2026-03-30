import React from 'react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { BookOpen, Layout } from 'lucide-react'

const ProfileGrid = ({ profile }: { profile: any }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-zinc-500">Knowledge Units</p>
                        <p className="text-4xl font-bold tracking-tight">{profile.stats.notes}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                        <BookOpen className="w-6 h-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-zinc-500">Learning Paths</p>
                        <p className="text-4xl font-bold tracking-tight">{profile.stats.roadmaps}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                        <Layout className="w-6 h-6" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfileGrid