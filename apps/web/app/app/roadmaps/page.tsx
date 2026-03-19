"use client"
import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { AlertCreateNewRoadMap } from "@/components/alearCreateNewRoadMap"

const page = () => {
    const [createNew, setCreateNew] = useState(false)
    const roadmaps = [
        {
            "id": "1",
            "title": "Frontend Developer Roadmap",
            "description": "A comprehensive guide to becoming a frontend developer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "2",
            "title": "Backend Developer Roadmap",
            "description": "A comprehensive guide to becoming a backend developer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "3",
            "title": "Fullstack Developer Roadmap",
            "description": "A comprehensive guide to becoming a fullstack developer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "4",
            "title": "Mobile Developer Roadmap",
            "description": "A comprehensive guide to becoming a mobile developer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "5",
            "title": "Data Scientist Roadmap",
            "description": "A comprehensive guide to becoming a data scientist",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "6",
            "title": "Machine Learning Engineer Roadmap",
            "description": "A comprehensive guide to becoming a machine learning engineer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "7",
            "title": "DevOps Engineer Roadmap",
            "description": "A comprehensive guide to becoming a DevOps engineer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "8",
            "title": "Cloud Engineer Roadmap",
            "description": "A comprehensive guide to becoming a cloud engineer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "9",
            "title": "Cybersecurity Engineer Roadmap",
            "description": "A comprehensive guide to becoming a cybersecurity engineer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            "id": "10",
            "title": "Blockchain Developer Roadmap",
            "description": "A comprehensive guide to becoming a blockchain developer",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    ]
    return (
        <div className="min-h-screen">
            <div className="max-w-[1400px] mx-auto py-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight">Learning Roadmaps</h1>
                    <p className="text-muted-foreground text-lg">
                        Comprehensive guides to help you choose your path in tech.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
                    {roadmaps.map((roadmap) => (
                        <Card key={roadmap.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
                            <CardHeader className="p-0">
                                <AspectRatio ratio={16 / 9}>
                                    <Image
                                        src={roadmap.image}
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
                                <Button className="w-full group cursor-pointer" variant="secondary">
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
            <AlertCreateNewRoadMap open={createNew} setOpen={setCreateNew} />
        </div>
    )
}

export default page