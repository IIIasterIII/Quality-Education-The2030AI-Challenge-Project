"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useRouter } from "next/navigation"
import { UserData } from "@/app/types/user"

export function UserAvatar({ user }: { user: UserData }) {
    const router = useRouter()
    return (
        <Avatar 
            className="h-9 w-9 cursor-pointer ring-2 ring-border/50 hover:ring-primary/50 transition-all duration-300 shadow-sm"
            onClick={() => router.push(`/app/profiles/${user.firebase_uid}`)}
        >
            <AvatarImage src={user.avatar || ""} alt={user.username || "User"} className="object-cover" />
            <AvatarFallback className="bg-linear-to-br from-primary/10 to-primary/20 text-primary uppercase font-bold text-xs">
                {user.username?.substring(0, 2) || "U"}
            </AvatarFallback>
        </Avatar>
    )
}