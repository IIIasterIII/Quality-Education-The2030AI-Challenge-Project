import { Handle, Position } from "@xyflow/react";
import { NodeData } from "@/app/types/user";
import { Check } from "lucide-react";

export const RoadmapNode = ({ data, selected }: { data: NodeData, selected: boolean }) => {
    const isCompleted = data.isCompleted
    return (
        <div className={`px-5 py-4 min-w-[220px] shadow-2xl rounded-2xl border bg-card/80 backdrop-blur-sm text-card-foreground transition-all duration-300 
            ${isCompleted ? 'border-green-500 bg-green-500/10' : ''} 
            ${selected ? 'ring-1 ring-primary border-primary shadow-primary/20' : 'hover:border-primary/20'}`}>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-base font-bold tracking-tight">{data.label}</span>
                    {isCompleted && <span className="text-green-500 text-lg"><Check/></span>}
                </div>
                {data.description && (
                   <span className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{data.description}</span>
                )}
            </div>
            <Handle 
                type="target" 
                position={Position.Top} 
                style={{ width: '12px', height: '12px', background: '#3b82f6', border: '2px solid white' }}
                className="z-50 hover:scale-150 transition-transform" 
            />
            <Handle 
                type="source" 
                position={Position.Bottom} 
                style={{ width: '12px', height: '12px', background: '#3b82f6', border: '2px solid white' }}
                className="z-50 hover:scale-150 transition-transform" 
            />
        </div>
    );
};