import React from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable'
import { ChevronRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph'
import { SubjectDetails } from '@/components/graph/SubjectDetails'
import { SubjectDirectory } from '@/components/graph/SubjectDirectory'
import { GraphLegend } from '@/components/graph/GraphLegend'

export const GraphWorkspace = ({ state, actions, refs }: { state: any; actions: any; refs: any; }) => {
    const {
        selectedNode,
        history,
        dimensions,
        filteredData,
        groupColors,
        filteredNodes
    } = state;

    const {
        handleNodeClick,
        goBack,
        handleDrillDown,
        handleUpdateNode,
        handleUpdateSubNote,
        setSelectedNode
    } = actions;

    const {
        graphRef,
        containerRef
    } = refs;

    return (
        <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
            <ResizablePanel className="relative overflow-hidden">
                <div ref={containerRef} className="h-full w-full bg-[#0a0a0a] relative overflow-hidden">
                    <GraphLegend groupColors={groupColors} />
                    {history.length > 0 && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
                            <Button 
                                onClick={goBack}
                                className="rounded-2xl bg-primary/20 hover:bg-primary/40 backdrop-blur-2xl border border-primary/30 text-primary font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180 mr-2" /> 
                                Back to Level {history.length}
                            </Button>
                        </div>
                    )}

                    <KnowledgeGraph 
                        graphRef={graphRef}
                        filteredData={filteredData}
                        dimensions={dimensions}
                        selectedNode={selectedNode}
                        groupColors={groupColors}
                        handleNodeClick={handleNodeClick}
                    />
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/20" />

            <ResizablePanel maxSize={500} minSize={300} defaultSize={400} className="relative overflow-hidden shrink-0">
                <div className="h-full bg-card/30 backdrop-blur-2xl flex flex-col overflow-hidden border-l border-border/10">
                    {selectedNode ? (
                        <SubjectDetails 
                            key={selectedNode.id}
                            selectedNode={selectedNode}
                            historyLength={history.length}
                            setSelectedNode={setSelectedNode}
                            handleNodeClick={handleDrillDown}
                            onUpdateNode={handleUpdateNode}
                            onUpdateSubNote={handleUpdateSubNote}
                        />
                    ) : (
                        <SubjectDirectory 
                            filteredNodes={filteredNodes}
                            historyLength={history.length}
                            groupColors={groupColors}
                            handleNodeClick={handleNodeClick}
                        />
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
