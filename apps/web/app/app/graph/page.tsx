"use client"
import React from 'react'
import { useGraphState } from '@/components/graph/components/useGraphState'
import { GraphHeader } from '@/components/graph/components/GraphHeader'
import { GraphWorkspace } from '@/components/graph/components/GraphWorkspace'

const Page = () => {
    const { state, actions, refs, ToastComponent } = useGraphState()
    if (!state.mounted) return null;

    return (
        <div className="h-full w-full bg-[#050505] overflow-hidden flex flex-col">
            {ToastComponent}
            <GraphHeader graphData={state.graphData} />
            <GraphWorkspace
                state={state}
                actions={actions}
                refs={refs}
            />
        </div>
    )
}

export default Page;