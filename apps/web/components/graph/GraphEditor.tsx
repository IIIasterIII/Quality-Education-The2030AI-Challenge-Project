"use client"
import React from 'react'
import { Plus, Trash2, Edit3, Link as LinkIcon, Save, Activity } from 'lucide-react'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Slider } from '@workspace/ui/components/slider'
import { Node, GraphData } from './types'

interface GraphEditorProps {
    selectedNode: Node | null;
    currentData: GraphData;
    groupColors: Record<number, string>;
    addNode: () => void;
    removeNode: (id: string) => void;
    updateNode: (id: string, updates: Partial<Node>) => void;
    addLink: () => void;
    newLinkSource: string;
    setNewLinkSource: (id: string) => void;
    newLinkTarget: string;
    setNewLinkTarget: (id: string) => void;
}

export const GraphEditor: React.FC<GraphEditorProps> = ({
    selectedNode,
    currentData,
    groupColors,
    addNode,
    removeNode,
    updateNode,
    addLink,
    newLinkSource,
    setNewLinkSource,
    newLinkTarget,
    setNewLinkTarget
}) => {
    return (
        <div className="h-full bg-card/20 backdrop-blur-2xl border-r border-border/10 flex flex-col p-8 space-y-10 overflow-y-auto no-scrollbar animate-in slide-in-from-left duration-500">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tighter">Graph Editor</h3>
                    <Edit3 className="w-5 h-5 text-primary opacity-50" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
                    Customize knowledge structure
                </p>
            </div>

            <div className="space-y-4">
                <Button onClick={addNode} className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2">
                    <Plus className="w-4 h-4" /> Add New Subject
                </Button>
            </div>

            {selectedNode ? (
                <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Editing Node</Label>
                        <Button variant="ghost" size="icon" onClick={() => removeNode(selectedNode.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold opacity-50">Subject Name</Label>
                            <Input 
                                value={selectedNode.name} 
                                className="h-10 rounded-xl bg-white/5 border-white/10 text-xs font-bold"
                                onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold opacity-50">Category Group</Label>
                            <div className="flex gap-2">
                                {[1,2,3,4,5].map(g => (
                                    <button 
                                        key={g} 
                                        onClick={() => updateNode(selectedNode.id, { group: g })}
                                        className={`w-8 h-8 rounded-lg transition-all ${selectedNode.group === g ? 'ring-2 ring-white scale-110' : 'opacity-40 hover:opacity-100'}`}
                                        style={{ backgroundColor: groupColors[g] }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] uppercase font-bold opacity-50">Visual Mass</Label>
                                <span className="text-[10px] font-black">{selectedNode.val}</span>
                            </div>
                            <Slider 
                                value={[selectedNode.val]} 
                                min={4} 
                                max={30} 
                                step={1}
                                onValueChange={(val: number[]) => updateNode(selectedNode.id, { val: val[0] })}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-2xl bg-secondary/20 border border-dashed border-border/50 text-center space-y-3">
                    <Activity className="w-6 h-6 mx-auto opacity-20" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Select a node to edit properties</p>
                </div>
            )}

            <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Connect Subjects</Label>
                </div>
                
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold opacity-50 ml-1">Source node</Label>
                        <select 
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold outline-none"
                            value={newLinkSource}
                            onChange={(e) => setNewLinkSource(e.target.value)}
                        >
                            <option value="" disabled>Select Source...</option>
                            {currentData.nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold opacity-50 ml-1">Target node</Label>
                        <select 
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold outline-none"
                            value={newLinkTarget}
                            onChange={(e) => setNewLinkTarget(e.target.value)}
                        >
                            <option value="" disabled>Select Target...</option>
                            {currentData.nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                        </select>
                    </div>
                    <Button onClick={addLink} className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/20 border-white/10 font-bold uppercase text-[9px]">
                        Establish Relationship
                    </Button>
                </div>
            </div>

            <div className="mt-auto space-y-3 shrink-0">
                <Button variant="outline" className="w-full h-12 rounded-xl border-border/50 font-black uppercase text-[10px] tracking-widest hover:bg-secondary">
                    <Save className="w-4 h-4 mr-2" /> Local Persistence
                </Button>
            </div>
        </div>
    )
}
