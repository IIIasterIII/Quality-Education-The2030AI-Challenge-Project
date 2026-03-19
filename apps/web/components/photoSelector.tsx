"use client"
import React, { useRef } from 'react'
import { Label } from "@workspace/ui/components/label"
import { X, UploadCloud } from "lucide-react"
import Image from "next/image"

interface PhotoSelectorProps {
    title: string
    previewUrl: string | null
    setPreviewUrl: (url: string | null) => void
    setImageFile: (file: File | null) => void
}

const PhotoSelector = ({ title, previewUrl, setPreviewUrl, setImageFile }: PhotoSelectorProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setImageFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div className="grid gap-2">
            <Label className="text-sm font-medium">{title}</Label>

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative mt-2 flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all
                    ${previewUrl
                        ? 'border-transparent'
                        : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
                    }`}
            >
                {previewUrl ? (
                    <>
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
                            <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Change Image</p>
                        </div>
                        <button
                            onClick={handleRemoveImage}
                            className="absolute cursor-pointer right-3 top-3 z-10 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-transform active:scale-95"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                        <div className="rounded-full bg-muted p-3">
                            <UploadCloud className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold">Click to upload</p>
                            <p className="text-xs">PNG, JPG or WebP (max. 5MB)</p>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}

export default PhotoSelector