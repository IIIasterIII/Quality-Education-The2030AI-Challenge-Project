"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { AlertCreateNewRoadMap } from "@/components/alearCreateNewRoadMap"
import { getRoadmaps } from '@/app/api/roadmap'
import { RoadMap } from '@/app/types/user'
import { useRouter } from 'next/navigation'

const page = () => {
    const [createNew, setCreateNew] = useState(false)
    const [roadmaps, setRoadMaps] = useState<RoadMap[]>([])
    const router = useRouter()

    useEffect(() => {
        const getRoadMaps = async () => {
            const data = await getRoadmaps()  
            setRoadMaps(data)
        }
        getRoadMaps()
    }, [])

    return (
        <div className="min-h-screen">
            <div className="max-w-[1400px] mx-auto py-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight">Learning Roadmaps</h1>
                    <p className="text-muted-foreground text-lg">Comprehensive guides to help you choose your path in tech.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
                    {roadmaps.length > 0 && roadmaps.map((roadmap) => (
                        <Card key={roadmap.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                            <CardHeader className="p-0">
                                <AspectRatio ratio={16 / 9}>
                                    <Image
                                        src={roadmap.image_url}
                                        alt={roadmap.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </AspectRatio>
                            </CardHeader>

                            <CardContent className="p-5 space-y-2">
                                <CardTitle className="text-xl line-clamp-1">
                                    {roadmap.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">
                                    {roadmap.description}
                                </CardDescription>
                            </CardContent>

                            <CardFooter className="p-5 pt-0">
                                <Button className="w-full group cursor-pointer" variant="secondary" onClick={(el) => router.push(`/app/roadmaps/${roadmap.id}`)}>
                                    View Path
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center">
                        <CardContent className="flex flex-col items-center justify-center">
                            <CardTitle>Create your own roadmap</CardTitle>
                            <CardDescription>Create your own roadmap</CardDescription>
                            <Button className="w-full group mt-2 cursor-pointer" variant="secondary" onClick={() => setCreateNew(true)}>
                                Create roadmap
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
            <AlertCreateNewRoadMap open={createNew} setOpen={setCreateNew} roadmaps={roadmaps} setRoadmaps={setRoadMaps} />
        </div>
    )
}

export default page