"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight, Settings, Globe, Lock, Plus } from "lucide-react"
import { AlertCreateNewRoadMap } from "@/components/alearCreateNewRoadMap"
import { RoadmapSettingsDialog } from "@/components/RoadmapSettingsDialog"
import { getRoadmaps } from '@/app/api/roadmap'
import { RoadMap } from '@/app/types/user'
import { useRouter } from 'next/navigation'
import Header from '@/components/roadMaps/header'

const RoadmapsPage = () => {
    const [createNew, setCreateNew] = useState(false)
    const [selectedRoadmap, setSelectedRoadmap] = useState<RoadMap | null>(null)
    const [showSettings, setShowSettings] = useState(false)
    const [roadmaps, setRoadmaps] = useState<RoadMap[]>([])
    const router = useRouter()

    const fetchRoadmapsData = async () => {
        const data = await getRoadmaps()
        setRoadmaps(data || [])
    }

    useEffect(() => { fetchRoadmapsData() }, [])

    const handleUpdateRoadmap = (updated: RoadMap) => {
        setRoadmaps(prev => prev.map(r => r.id === updated.id ? updated : r))
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto py-10 px-6">
                <Header setCreateNew={setCreateNew} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roadmaps.length > 0 && roadmaps.map((roadmap) => (
                        <Card key={roadmap.id} className="group overflow-hidden border-border/50 hover:border-border transition-all flex flex-col h-full">
                            <CardHeader className="p-0 relative">
                                <AspectRatio ratio={16 / 9}>
                                    <Image
                                        src={roadmap.image_url}
                                        alt={roadmap.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </AspectRatio>

                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedRoadmap(roadmap);
                                            setShowSettings(true);
                                        }}
                                    >
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-[10px] font-medium">
                                    {roadmap.is_public ? (
                                        <>
                                            <Globe className="w-3 h-3 text-primary" />
                                            <span>Public</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3 h-3 text-muted-foreground" />
                                            <span>Private</span>
                                        </>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-5 flex-1 flex flex-col gap-2">
                                <CardTitle className="text-xl line-clamp-1">
                                    {roadmap.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-sm">
                                    {roadmap.description}
                                </CardDescription>
                            </CardContent>

                            <CardFooter className="p-5 pt-0">
                                <Button
                                    className="w-full justify-between group/btn"
                                    variant="outline"
                                    onClick={() => router.push(`/app/roadmaps/${roadmap.id}`)}
                                >
                                    Review Path
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    <button
                        onClick={() => setCreateNew(true)}
                        className="group relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-all min-h-[300px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Architect Path</h3>
                        <p className="text-sm text-muted-foreground text-center mt-1">Create a new custom learning flow</p>
                    </button>
                </div>
            </div>

            <AlertCreateNewRoadMap open={createNew} setOpen={setCreateNew} roadmaps={roadmaps} setRoadmaps={setRoadmaps} />

            <RoadmapSettingsDialog
                roadmap={selectedRoadmap}
                open={showSettings}
                onOpenChange={setShowSettings}
                onUpdate={handleUpdateRoadmap}
            />
        </div>
    )
}

export default RoadmapsPage