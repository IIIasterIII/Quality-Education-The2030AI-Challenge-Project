import React from 'react'
import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"

const SearchSection = ({searchTerm, setSearchTerm, filteredRoadmaps}: {searchTerm: string, setSearchTerm: (value: string) => void, filteredRoadmaps: any[]}) => {
  return (
    <div className="relative flex flex-col md:flex-row gap-4 items-center justify-between p-3 rounded-xl bg-background/50 backdrop-blur-xl border border-border/50 shadow-sm">
        <div className="relative w-full md:w-[500px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
            <Input 
                placeholder="Search by title or description..." 
                className="pl-11 h-12 border-none bg-transparent focus-visible:ring-0 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto px-2">
            <div className="h-8 w-px bg-border hidden md:block"></div>
            <p className="text-xs text-muted-foreground font-medium hidden md:block">
                Showing {filteredRoadmaps.length} results
            </p>
        </div>
    </div>
  )
}

export default SearchSection