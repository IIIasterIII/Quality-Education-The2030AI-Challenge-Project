import { Button } from '@workspace/ui/components/button'
import { Plus } from 'lucide-react'
import React from 'react'

const Header = ({ setCreateNew }: { setCreateNew: (value: boolean) => void }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight">My Roadmaps</h1>
                <p className="text-muted-foreground text-lg">Build, track and share your learning progress.</p>
            </div>
            <Button
                onClick={() => setCreateNew(true)}
                size="lg"
                className="gap-2"
            >
                <Plus className="w-5 h-5" />
                New Roadmap
            </Button>
        </div>
    )
}

export default Header