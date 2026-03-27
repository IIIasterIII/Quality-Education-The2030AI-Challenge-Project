"use client"
import { NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@workspace/ui/components/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@workspace/ui/components/sheet"
import { NavigationMenu } from "@workspace/ui/components/navigation-menu"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector } from "@/app/store/hooks"
import { cn } from "@workspace/ui/lib/utils"
import { UserAvatar } from "./userAvatar"
import { Menu, Infinity } from "lucide-react"
import Link from "next/link"


export function AppNavbar() {
    const router = useRouter()
    const pathname = usePathname()
    const user = useAppSelector((state) => state.user)

    const navItems = [
        { label: "Roadmaps", href: "/app/roadmaps" },
        { label: "Graph", href: "/app/graph" },
        { label: "Notes", href: "/app/notes" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 
        backdrop-blur-xl supports-backdrop-filter:bg-background/60">
            <div className="h-16 flex items-center justify-between w-full max-w-7xl mx-auto px-6">

                <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <Infinity className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white uppercase italic">Cognito</span>
                </Link>
                </div>

                <div className="hidden md:flex flex-1 justify-center">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink 
                                        asChild
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "relative h-9 px-4 py-2 bg-transparent hover:bg-transparent focus:bg-transparent duration-300 transition-all cursor-pointer",
                                            pathname === item.href 
                                                ? "text-primary font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary" 
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Link href={item.href}>
                                            {item.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center space-x-4">
                    {user.loading ? (
                        <Skeleton className="h-9 w-9 rounded-full ring-2 ring-border/50" />
                    ) : user.isLoggedIn ? (
                        <UserAvatar user={user} />
                    ) : (
                        <Button 
                            onClick={() => router.push('/auth')} 
                            className="h-9 px-6 font-semibold shadow-md shadow-primary/20
                             hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-200"
                        >
                            Start
                        </Button>
                    )}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-accent transition-colors">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetTitle className="text-xl font-bold tracking-tight mb-4">Navigation Menu</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Choose a section to navigate to
                                </SheetDescription>

                                <nav className="flex flex-col gap-2 mt-4">
                                    {navItems.map((item) => (
                                        <Link 
                                            key={item.href}
                                            href={item.href} 
                                            className={cn(
                                                "px-4 py-3 rounded-xl text-lg font-medium transition-all",
                                                pathname === item.href 
                                                    ? "bg-primary/10 text-primary" 
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
