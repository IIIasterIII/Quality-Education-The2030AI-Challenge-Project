"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ArrowRight, CheckCircle2, User } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { RoadMap } from '@/app/types/user'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar"
import PageNavbar from './components/pageNavbar'
import SearchSection from './components/searchSection'
import NotFound from './components/notFound'
import RoadMapList from './components/element/roadMapList'

const CommunityList = ({ roadmaps }: { roadmaps: RoadMap[] }) => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const router = useRouter()

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
