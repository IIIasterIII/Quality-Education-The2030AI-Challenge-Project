"use client"
import Link from "next/link"
import { Menu } from "lucide-react"

import {
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@workspace/ui/components/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { NavigationMenu } from "@workspace/ui/components/navigation-menu"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"
import { useAppSelector } from "@/app/store/hooks"
import { useRouter } from "next/navigation"
import { UserData } from "@/app/types/user"

export function AppNavbar() {
    const router = useRouter()
    const user = useAppSelector((state) => state.user)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center justify-center">
            <div className="h-16 flex items-center justify-between w-full max-w-[1200px]">

                <Link href="/" className="flex items-center space-x-2 mr-10">
                    <span className="font-bold inline-block">App</span>
                </Link>

                <div className="hidden md:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/app/roadmaps">
                                        Roadmaps
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/app/dashboard">
                                        Dashboard
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center space-x-4 ml-10">
                    {user.loading ? (
                        <Skeleton className="h-8 w-8 rounded-full" />
                    ) : user.isLoggedIn ? (
                        <UserAvatar user={user} />
                    ) : (
                        <Button onClick={() => router.push('/auth')} className="w-20">Start</Button>
                    )}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Choose a section to navigate to
                                </SheetDescription>

                                <nav className="flex flex-col gap-4 mt-8">
                                    <Link href="/editor" className="text-lg font-medium">Reduct 11</Link>
                                    <Link href="/dashboard" className="text-lg font-medium">Dashboard 22</Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}

export function UserAvatar({ user }: { user: UserData }) {
    const router = useRouter()
    return (
        <Avatar className="cursor-pointer" onClick={() => router.push(`/app/profiles/${user.firebase_uid}`)}>
            <AvatarImage src={user.avatar || ""} alt={user.username || "User"} />
            <AvatarFallback>{user.username}</AvatarFallback>
        </Avatar>
    )
}
