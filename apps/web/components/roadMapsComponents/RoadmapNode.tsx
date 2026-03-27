import { Handle, Position } from "@xyflow/react";
import { NodeData, NodeHandle } from "@/app/types/user";
import { Check } from "lucide-react";

const getHandlePosition = (pos: string) => {
    switch (pos) {
        case 'top': return Position.Top;
        case 'bottom': return Position.Bottom;
        case 'left': return Position.Left;
        case 'right': return Position.Right;
        default: return Position.Top;
    }
};

const DefaultHandle = ({ type, position, id }: { type: 'source' | 'target', position: Position, id?: string }) => (
    <Handle 
        type={type} 
        position={position} 
        id={id}
        style={{ width: '8px', height: '8px', background: '#71fd64', border: 'none', boxShadow: '0 0 10px rgba(113, 253, 100, 0.4)' }}
        className="z-50 hover:scale-150 transition-transform bg-primary! border-none!" 
    />
);

export const RoadmapNode = ({ data, selected }: { data: NodeData, selected: boolean }) => {
    const isCompleted = data.isCompleted;
    const hasCustomHandles = data.customHandles && data.customHandles.length > 0;

    return (
        <div className={`px-6 py-5 min-w-[240px] rounded-2xl border transition-all duration-500 group
            ${isCompleted 
                ? 'border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(113,253,100,0.05)]' 
                : 'border-white/10 bg-card/40 backdrop-blur-2xl'} 
            ${selected 
                ? 'ring-2 ring-primary/40 border-primary shadow-[0_0_30px_rgba(113,253,100,0.1)]' 
                : 'hover:border-white/20'}`}>
            
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold tracking-tight text-white/90">{data.label}</span>
                    {isCompleted && (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                            <Check size={12} className="text-primary" />
                        </div>
                    )}
                </div>
                {data.description && (
                   <span className="text-[10px] text-muted-foreground/60 leading-relaxed line-clamp-2 font-medium">{data.description}</span>
                )}
            </div>

            {hasCustomHandles ? (
                data.customHandles!.map((h: NodeHandle) => (
                    <DefaultHandle 
                        key={h.id} 
                        id={h.id} 
                        type={h.type} 
                        position={getHandlePosition(h.position)} 
                    />
                ))
            ) : (
                <>
                    <DefaultHandle type="target" position={Position.Top} />
                    <DefaultHandle type="source" position={Position.Bottom} />
                </>
            )}
        </div>
    );
};