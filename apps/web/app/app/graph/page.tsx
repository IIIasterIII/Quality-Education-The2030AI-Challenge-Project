"use client"
import React from 'react'
import { useGraphState } from './components/useGraphState'
import { GraphHeader } from './components/GraphHeader'
import { GraphWorkspace } from './components/GraphWorkspace'

const Page = () => {
    const { state, actions, refs, ToastComponent } = useGraphState()

    if (!state.mounted) return null;

    return (
        <div className="h-screen w-full bg-[#050505] overflow-hidden flex flex-col">
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