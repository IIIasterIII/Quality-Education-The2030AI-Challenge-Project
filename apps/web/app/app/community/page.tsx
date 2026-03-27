"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight, Search, Tag, CheckCircle2, Globe, Filter } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { getCommunityRoadmaps } from '@/app/api/roadmap'
import { RoadMap } from '@/app/types/user'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const CommunityPage = () => {
    const [roadmaps, setRoadMaps] = useState<RoadMap[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const router = useRouter()

    const fetchRoadmaps = async () => {
        setLoading(true)
        const data = await getCommunityRoadmaps(1, 20, selectedTag || undefined)
        setRoadMaps(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchRoadmaps()
    }, [selectedTag])

    const filteredRoadmaps = roadmaps.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="max-w-7xl mx-auto py-10 px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
                            <Globe className="w-3 h-3" /> Community Explorer
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Explore Roadmaps</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Hand-curated learning paths verified by the Cognito team and shared by the community.
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2 mb-10 rounded-xl bg-muted/30 border border-border/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search paths..." 
                            className="pl-10 h-10 border-none bg-transparent focus-visible:ring-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[350px] rounded-xl bg-muted animate-pulse border border-border/50" />
                        ))}
                    </div>
                ) : filteredRoadmaps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredRoadmaps.map((roadmap, idx) => (
                                <motion.div
                                    key={roadmap.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                >
                                    <Card className="group overflow-hidden border-border/50 hover:border-border transition-all flex flex-col h-full">
                                        <div className="relative aspect-video overflow-hidden">
                                            <Image
                                                src={roadmap.image_url}
                                                alt={roadmap.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                            {roadmap.is_verified && (
                                                <div className="absolute top-2 left-2">
                                                    <Badge className="bg-primary text-primary-foreground gap-1 border-none font-bold text-[10px] uppercase">
                                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <CardHeader className="p-5 pb-2">
                                            <div className="flex gap-1.5 mb-2 flex-wrap">
                                                {roadmap.tags?.map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold text-primary">#{tag}</span>
                                                ))}
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {roadmap.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm line-clamp-2 mt-1">
                                                {roadmap.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardFooter className="p-5 mt-auto">
                                            <Button 
                                                className="w-full justify-between group/btn" 
                                                variant="outline"
                                                onClick={() => router.push(`/app/roadmaps/${roadmap.id}`)}
                                            >
                                                Explore Path
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="mt-10 text-center py-20 rounded-xl border border-dashed border-border bg-muted/10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4 text-muted-foreground">
                            <Filter className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold">No roadmaps found</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            Try adjusting your filters or search term to discover different paths.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommunityPage
