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
            linkColor={() => '#1a1a1a'}
            linkWidth={1.5}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.004}
            linkDirectionalParticleWidth={2}
            nodeRelSize={4}
            d3AlphaDecay={0.01}
            d3VelocityDecay={0.4}
            onNodeClick={handleNodeClick}
            warmupTicks={100}
            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const n = node as any;
                const isSelected = selectedNode?.id === n.id;
                const hasSub = !!n.subGraph;
                const label = n.name;
                const fontSize = 14 / globalScale;
                const r = Math.sqrt(n.val || 4) * 2.5;
                const color = groupColors[n.group] || '#737373';

                // Calculate "Aging" - if not opened for a long time, fade the node slightly
                let opacity = 1;
                if (n.last_opened) {
                    const last = new Date(n.last_opened).getTime();
                    const now = Date.now();
                    const diffDays = (now - last) / (1000 * 60 * 60 * 24);
                    if (diffDays > 3) opacity = 0.6; // Node is "stale"
                    if (diffDays > 7) opacity = 0.3; // Node is "forgotten"
                }

                ctx.save();
                ctx.globalAlpha = opacity;

                // Subtle Outer Glow for all nodes
                ctx.beginPath();
                ctx.arc(n.x, n.y, r + (2/globalScale), 0, 2 * Math.PI);
                ctx.shadowColor = color;
                ctx.shadowBlur = isSelected ? 30 : 10;
                ctx.fillStyle = isSelected ? 'rgba(255,255,255,0.1)' : color + '22';
                ctx.fill();
                ctx.shadowBlur = 0;

                // Cluster Ring
                if (hasSub) {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, r + (5/globalScale), 0, 2 * Math.PI);
                    ctx.strokeStyle = color + '66';
                    ctx.lineWidth = 1.5 / globalScale;
                    ctx.setLineDash([2, 2]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Core Node
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, 2 * Math.PI, false);
                ctx.fillStyle = isSelected ? '#fff' : color;
                ctx.fill();

                // Stale Indicator (Subtle ring if forgotten)
                if (opacity < 1) {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, r + (3/globalScale), 0, 2 * Math.PI);
                    ctx.strokeStyle = '#ef4444' + (opacity < 0.5 ? '44' : '22');
                    ctx.lineWidth = 1 / globalScale;
                    ctx.stroke();
                }

                ctx.restore();

                // Label
                if (globalScale > 0.5 || isSelected) {
                    ctx.font = `${isSelected ? '900' : '600'} ${fontSize}px "SF Pro Display", "Inter", sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Draw text shadow for better legibility on dark bg
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.shadowBlur = 4;
                    
                    ctx.fillStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.85)';
                    ctx.fillText(label, n.x, n.y + r + (14/globalScale));
                    ctx.shadowBlur = 0;
                }
            }}
        />
    )
}
