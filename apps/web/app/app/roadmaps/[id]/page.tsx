import React from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable'

const page = () => {
    return (
        <ResizablePanelGroup orientation="horizontal" className="h-screen w-full">
            <ResizablePanel minSize={200} defaultSize="10%">
                <div className="flex h-screen items-center justify-center p-6">
                    <span className="font-semibold">One</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="90%">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel defaultSize="100%">
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Three</span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={100} defaultSize="10%">
                <div className="flex h-screen items-center justify-center p-6">
                    <span className="font-semibold">One</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default page