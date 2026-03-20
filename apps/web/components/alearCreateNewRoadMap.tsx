"use client"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import PhotoSelector from "./photoSelector"
import { createRoadmap } from "@/app/api/roadmap"
import { RoadMapCreateData, RoadMap } from "@/app/types/user"

export function AlertCreateNewRoadMap(
    { open, setOpen, roadmaps, setRoadmaps } :
        { open: boolean, setOpen: (open: boolean) => void, roadmaps: RoadMap[], setRoadmaps: (roadmaps: RoadMap[]) => void }) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleCreate = async () => {
        if (!title || !imageFile) return
        const roadMapData: RoadMapCreateData = { title, description, image: imageFile }
        try {
            setIsLoading(true)
            const data = await createRoadmap(roadMapData)   
            setRoadmaps([...roadmaps, data])
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
            setOpen(false)
            resetForm()
        }
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setImageFile(null)
        setPreviewUrl(null)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl">Create New Roadmap</AlertDialogTitle>
                </AlertDialogHeader>

                <div className="grid gap-5 py-4">
                    <PhotoSelector title="Roadmap Cover Image" previewUrl={previewUrl}
                        setPreviewUrl={setPreviewUrl} setImageFile={setImageFile} />

                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe this roadmap"
                            rows={3}
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreate} className={`cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!title || !imageFile || isLoading}>
                        {isLoading ? "Creating..." : "Create"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}