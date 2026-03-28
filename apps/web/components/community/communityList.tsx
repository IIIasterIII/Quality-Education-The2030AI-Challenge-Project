"use client"
import React, { useState } from 'react'
import { RoadMap } from '@/app/types/user'
import PageNavbar from './pageNavbar'
import SearchSection from './searchSection'
import NotFound from './notFound'
import RoadMapList from './element/roadMapList'

const CommunityList = ({ roadmaps }: { roadmaps: RoadMap[] }) => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const filteredRoadmaps = roadmaps.filter(
        r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="max-w-7xl mx-auto py-10 px-6">
                <PageNavbar title={"Explore Roadmaps"} bio={"Maps from the community for learning many new and interesting things"}/>

                <div className="relative group mb-12">
                    <SearchSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredRoadmaps={filteredRoadmaps}/>
                </div>

                <NotFound filteredRoadmaps={filteredRoadmaps}/>
                <RoadMapList filteredRoadmaps={filteredRoadmaps}/>
            </div>
        </div>
    )
}

export default CommunityList
