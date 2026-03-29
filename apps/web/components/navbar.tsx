"use client"
import React from "react"
import { NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle, NavigationMenu } from "@workspace/ui/components/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@workspace/ui/components/sheet"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"
import { useAppSelector } from "@/app/store/hooks"
import { useRouter, usePathname } from "next/navigation"
import { UserAvatar } from "./userAvatar"
import { Menu, Infinity } from "lucide-react"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAppSelector((state) => state.user)

  const navLinks = [
    { title: "Ecosystem", href: "#ecosystem" },
    { title: "Spotlight", href: "#spotlight" },
    { title: "Methodology", href: "#process" },
    { title: "Verification", href: "#logic" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault()
      const element = document.getElementById(href.slice(1))
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: "smooth"
        })
      }
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl supports-backdrop-filter:bg-zinc-950/60 transition-all select-none">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
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
                <NavigationMenuList className="gap-1">
                    {navLinks.map((link) => (
                        <NavigationMenuItem key={link.href}>
                            <NavigationMenuLink 
                                asChild
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    "relative h-9 px-4 py-2 bg-transparent hover:bg-zinc-900/50 hover:text-white focus:bg-transparent duration-300 transition-all cursor-pointer text-zinc-400 font-medium text-[11px] uppercase tracking-widest"
                                )}
                            >
                                <Link 
                                    href={link.href}
                                    onClick={(e) => handleScroll(e, link.href)}
                                >
                                    {link.title}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {user.loading ? (
            <Skeleton className="h-9 w-9 rounded-full bg-zinc-800" />
          ) : user.isLoggedIn ? (
            <UserAvatar user={user} />
          ) : (
            <Button 
                onClick={() => router.push('/auth')} 
                className="h-9 px-6 font-bold uppercase tracking-widest text-[10px] bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/5 active:scale-95 transition-all duration-200"
            >
                Initialize
            </Button>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-zinc-950 border-zinc-800 p-0 w-72">
                <div className="p-6 border-b border-zinc-800">
                  <SheetTitle className="text-white text-sm font-bold uppercase tracking-widest">Navigation</SheetTitle>
                  <SheetDescription className="text-zinc-500 text-xs mt-1">Access your learning tools</SheetDescription>
                </div>

                <nav className="flex flex-col p-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      onClick={(e) => handleScroll(e as any, link.href)}
                      className="text-sm font-medium text-zinc-400 hover:text-white p-3 rounded-xl transition-colors hover:bg-zinc-900"
                    >
                      {link.title}
                    </Link>
                  ))}
                  {!user.isLoggedIn && (
                    <Button 
                        onClick={() => router.push('/auth')} 
                        className="mt-4 w-full bg-white text-black font-bold uppercase tracking-widest text-[10px]"
                    >
                        Sign In
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}