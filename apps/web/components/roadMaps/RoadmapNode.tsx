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
        <div className={`px-7 py-6 min-w-[280px] rounded-3xl border-2 transition-all duration-700 relative group
            ${isCompleted 
                ? 'border-primary/50 bg-primary/10 shadow-[0_0_40px_rgba(113,253,100,0.15)] ring-1 ring-primary/20' 
                : 'border-white/5 bg-zinc-950/60 backdrop-blur-3xl shadow-2xl'} 
            ${selected 
                ? 'border-primary shadow-[0_0_50px_rgba(113,253,100,0.25)] scale-[1.02]' 
                : 'hover:border-white/20'}`}>
            
            {/* Subtle Neon Accents */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px h-px w-1/3 bg-linear-to-r from-transparent via-primary/60 to-transparent transition-opacity duration-700 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px h-px w-1/3 bg-linear-to-r from-transparent via-primary/60 to-transparent transition-opacity duration-700 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-6">
                    <span className={`text-sm font-black uppercase tracking-wider text-white transition-colors duration-500 ${isCompleted ? 'text-primary' : ''}`}>{data.label}</span>
                    {isCompleted && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(113,253,100,0.3)] animate-in zoom-in-50 duration-500">
                            <Check size={14} className="text-primary stroke-[4px]" />
                        </div>
                    )}
                </div>
                {data.description && (
                   <span className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                       {data.description}
                   </span>
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