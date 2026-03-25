"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import { GraphData, Node } from './types'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false }) as any;

interface KnowledgeGraphProps {
    graphRef: React.RefObject<any>;
    filteredData: GraphData;
    dimensions: { width: number; height: number };
    selectedNode: Node | null;
    groupColors: Record<number, string>;
    handleNodeClick: (node: Node) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
    graphRef,
    filteredData,
    dimensions,
    selectedNode,
    groupColors,
    handleNodeClick
}) => {
    React.useEffect(() => {
        if (graphRef.current) {
            const sim = graphRef.current;
            sim.d3Force('charge').strength(-300); 
            sim.d3Force('link').distance(60);
            sim.d3ReheatSimulation();
        }
    }, [filteredData, graphRef]);

    return (
        <ForceGraph2D
            ref={graphRef}
            graphData={filteredData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#0a0a0a"
            nodeId="id"
            nodeLabel="name"
            nodeVal={(node: any) => (node as any).val || 4}
            nodeColor={(node: any) => {
                const isSelected = selectedNode?.id === (node as any).id;
                if (isSelected) return '#fff';
                return groupColors[(node as any).group] || '#737373';
            }}
            linkColor={() => '#222'}
            linkWidth={1.2}
            linkDirectionalParticles={1}
            linkDirectionalParticleSpeed={0.005}
            nodeRelSize={4}
            d3AlphaDecay={0.015}
            d3VelocityDecay={0.3}
            onNodeClick={handleNodeClick}
            warmupTicks={100}
            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const n = node as any;
                const isSelected = selectedNode?.id === n.id;
                const hasSub = !!n.subGraph;
                const label = n.name;
                const fontSize = 14 / globalScale;
                ctx.font = `${isSelected ? '900' : 'bold'} ${fontSize}px Inter, sans-serif`;
                
                const r = Math.sqrt(n.val || 4) * 2.5;
                
                if (hasSub) {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, r + (4/globalScale), 0, 2 * Math.PI);
                    ctx.strokeStyle = (groupColors[n.group] || '#737373') + '44';
                    ctx.lineWidth = 2 / globalScale;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, 2 * Math.PI, false);
                
                if (isSelected) {
                    ctx.shadowColor = '#fff';
                    ctx.shadowBlur = 20;
                }

                ctx.fillStyle = isSelected ? '#fff' : (groupColors[n.group] || '#737373');
                ctx.fill();
                ctx.shadowBlur = 0;

                if (globalScale > 0.6 || isSelected) {
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.7)';
                    ctx.fillText(label, n.x, n.y + r + (12/globalScale));
                }
            }}
        />
    )
}
