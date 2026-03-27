import React from 'react'
import { RoadMap } from '@/app/types/user'
import { Card as Card1, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ArrowRight, CheckCircle2, User } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Card = ({ roadmap }: { roadmap: RoadMap }) => {
    const router = useRouter()
  return (
    <Card1 className="group overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm 
        hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
            <Image
                src={roadmap.image_url}
                alt={roadmap.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent 
                to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {roadmap.is_verified && (
                <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md gap-1 border-none 
                        font-bold text-[10px] py-0.5 px-2 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                    </Badge>
                </div>
            )}
        </div>

        <CardHeader className="p-6 pb-2 space-y-1">
            <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary 
                transition-colors cursor-pointer" onClick={() => router.push(`/app/roadmaps/${roadmap.id}`)}>
                {roadmap.title}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2 leading-relaxed text-muted-foreground/80 min-h-[40px]">
                {roadmap.description}
            </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-2 flex-1">
            {roadmap.tags && roadmap.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {roadmap.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] h-5 bg-muted/50 
                            text-muted-foreground border-border/50 hover:bg-muted transition-colors">
                            {tag}
                        </Badge>
                    ))}
                    {roadmap.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground font-medium ml-1 flex items-center">
                            +{roadmap.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}
        </CardContent>

        <div className="px-6 py-4 mt-auto border-t border-border/50 flex items-center justify-between gap-3 bg-muted/5">
            <div 
                className="flex items-center gap-2.5 cursor-pointer group/author"
                onClick={() => roadmap.owner_firebase_uid && router.push(`/app/profiles/${roadmap.owner_firebase_uid}`)}
            >
                <Avatar className="w-8 h-8 border border-border group-hover/author:border-primary transition-all duration-300">
                    <AvatarImage src={roadmap.owner_avatar} alt={roadmap.owner_username} />
                    <AvatarFallback>
                        <User className="w-4 h-4 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Contributor</span>
                    <span className="text-xs font-semibold group-hover/author:text-primary transition-colors max-w-[100px] truncate">
                        {roadmap.owner_username}
                    </span>
                </div>
            </div>

            <Button 
                size="sm"
                variant="secondary"
                className="rounded-lg h-9 px-4 lg:px-5 gap-2 group/btn font-medium bg-secondary/80 
                hover:bg-primary hover:text-primary-foreground transition-all duration-300" 
                onClick={() => router.push(`/app/roadmaps/${roadmap.id}`)}
            >
                <span className="hidden sm:inline">Explore</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
        </div>
    </Card1>
  )
}

export default Card