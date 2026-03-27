"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Badge } from "@workspace/ui/components/badge"
import { X, Tag as TagIcon, Globe, Lock } from "lucide-react"
import { shareRoadmap } from '@/app/api/roadmap'
import { RoadMap } from '@/app/types/user'
import { useToast } from './toast'

interface RoadmapSettingsDialogProps {
    roadmap: RoadMap
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate: (updatedRoadmap: RoadMap) => void
}

export const RoadmapSettingsDialog: React.FC<RoadmapSettingsDialogProps> = ({ roadmap, open, onOpenChange, onUpdate }) => {
    const [isPublic, setIsPublic] = useState(roadmap.is_public || false)
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()
    const tags : string[] = [] 

    const handleSave = async () => {
        setLoading(true)
        const result = await shareRoadmap(roadmap.id.toString(), isPublic, tags)
        if (result) {
            showToast("Project sharing updated", "success")
            onUpdate({ ...roadmap, is_public: isPublic, tags })
            onOpenChange(false)
        } else {
            showToast("Failed to update sharing settings", "error")
        }
        setLoading(false)
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

                <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-semibold">Public Discovery</Label>
                            <p className="text-[12px] text-muted-foreground leading-snug max-w-[240px]">
                                Share your progress with the community. Public paths are featured in the Explorer after verification.
                            </p>
                        </div>
                        <Switch 
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button 
                        disabled={loading}
                        className="px-6"
                        onClick={handleSave}
                    >
                        {loading ? "Updating..." : "Update Settings"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
