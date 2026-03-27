import { RoadMap } from '@/app/types/user'
import React from 'react'

const NotFound = ({filteredRoadmaps}: {filteredRoadmaps: RoadMap[]}) => {
    if (filteredRoadmaps.length === 0) {
        return (
            <div className="mt-10 text-center py-20 rounded-xl border border-dashed border-border bg-muted/10">
                <h3 className="text-lg font-semibold">No roadmaps found</h3>
                <p className="text-muted-foreground text-sm mt-1">
                    Try adjusting your filters or search term to discover different paths.
                </p>
            </div>
        )
    }
}

export default NotFound