"use client"
import React from 'react'
import { Search, Settings2 } from 'lucide-react'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    totalNodes: number;
    isEditorOpen: boolean;
    setIsEditorOpen: (val: boolean) => void;
}

export const SubjectHeader: React.FC<HeaderProps> = ({ 
    searchTerm, 
    setSearchTerm, 
    totalNodes, 
    isEditorOpen, 
    setIsEditorOpen, 
}) => {
    return (
        <header className="h-16 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 relative z-50">
            <div className="flex flex-row items-center justify-between gap-6 w-full">
                <div className="flex items-center gap-4 w-1/4">
                    <Button 
                        variant={isEditorOpen ? "default" : "outline"} 
                        size="icon" 
                        className="rounded-xl shadow-lg transition-all"
                        onClick={() => setIsEditorOpen(!isEditorOpen)}
                    >
                        <Settings2 className="w-5 h-5" />
                    </Button>
                </div>

                <div className="relative w-1/2 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                        placeholder="Search subjects, topics, prerequisites..." 
                        className="bg-secondary/50 border-border/50 pl-12 h-11 rounded-2xl focus-visible:ring-primary/30 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-1/4 justify-end">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black uppercase text-muted-foreground opacity-50 tracking-widest">Active nodes</p>
                        <p className="text-sm font-black text-primary">{totalNodes}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
