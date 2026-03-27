"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"
import { Globe, Lock } from "lucide-react"
import { shareRoadmap, updateRoadmapMetadata, deleteRoadmap } from '@/app/api/roadmap'
import { RoadMap } from '@/app/types/user'
import { ImagePlus, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { useToast } from './toast'

interface RoadmapSettingsDialogProps {
    roadmap: RoadMap
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate: (updatedRoadmap: RoadMap) => void
}

export const RoadmapSettingsDialog: React.FC<RoadmapSettingsDialogProps> = ({ roadmap, open, onOpenChange, onUpdate }) => {
    const [isPublic, setIsPublic] = useState(roadmap.is_public || false)
    const [title, setTitle] = useState(roadmap.title)
    const [description, setDescription] = useState(roadmap.description || "")
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const { showToast } = useToast()
    const router = useRouter()
    const tags: string[] = []

    const handleSave = async () => {
        setLoading(true)
        try {
            const sharingResult = await shareRoadmap(roadmap.id.toString(), isPublic, tags)
            const metadataResult = await updateRoadmapMetadata(
                roadmap.id.toString(),
                title,
                description,
                image || undefined
            )

            if (sharingResult && metadataResult) {
                showToast("Roadmap updated successfully", "success")
                onUpdate({ 
                    ...roadmap, 
                    title,
                    description,
                    is_public: isPublic, 
                    tags,
                    image_url: metadataResult.image_url || roadmap.image_url 
                })
                onOpenChange(false)
            } else {
                showToast("Failed to update roadmap settings", "error")
            }
        } catch (err) {
            showToast("Something went wrong during update", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const result = await deleteRoadmap(roadmap.id.toString())
            if (result) {
                showToast("Roadmap deleted successfully", "success")
                onOpenChange(false)
                router.push('/app/roadmaps')
            } else {
                showToast("Failed to delete roadmap", "error")
            }
        } catch (err) {
            showToast("Something went wrong during deletion", "error")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        {isPublic ? <Globe className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                        <DialogTitle className="text-xl font-bold tracking-tight">Roadmap Settings</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm">
                        Manage your learning path's visibility and tags.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4 max-h-[60vh] overflow-y-auto no-scrollbar px-1">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Project Identity</Label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Roadmap Title"
                            className="h-10 rounded-lg bg-white/5 border-white/10"
                        />
                        <Textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="rounded-lg bg-white/5 border-white/10 min-h-[100px] resize-none text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Cover Image</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="Preview" />
                                ) : roadmap.image_url ? (
                                    <img src={roadmap.image_url} className="w-full h-full object-cover opacity-50" alt="Current" />
                                ) : (
                                    <ImagePlus className="w-6 h-6 text-muted-foreground/30" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                    className="h-9 text-[10px] border-dashed bg-transparent"
                                />
                                <p className="text-[9px] text-muted-foreground/50 italic pl-1">Recommended: 16:9 Aspect Ratio</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 transition-all hover:border-white/10">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold tracking-tight">Public Discovery</Label>
                                <p className="text-[11px] text-muted-foreground/60 leading-snug max-w-[200px]">
                                    Share this path with the community Explorer.
                                </p>
                            </div>
                            <Switch 
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-destructive flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
                                </p>
                                <p className="text-[10px] text-muted-foreground/60">This will permanently remove the roadmap and all its data.</p>
                            </div>
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3 text-[10px] font-bold">
                                        Delete Project
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-zinc-950 border-white/10">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground">
                                            This action cannot be undone. This will permanently delete your
                                            roadmap and remove the cover image from our storage.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={handleDelete}
                                            className="bg-destructive text-white hover:bg-destructive/90"
                                            disabled={deleting}
                                        >
                                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Roadmap"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button 
                        disabled={loading}
                        className="px-8 h-10 rounded-lg bg-primary text-black font-bold text-xs"
                        onClick={handleSave}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
