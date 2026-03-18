"use client"
import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { NavigationMenu } from "@workspace/ui/components/navigation-menu"
import { useRouter } from "next/navigation"

export function Navbar() {
  const router = useRouter()

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center justify-center">
      <div className="h-16 flex items-center justify-between w-full max-w-[1200px]">
    
        <Link href="/" className="flex items-center space-x-2 mr-10">
          <span className="font-bold inline-block">App</span>
        </Link>

        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/editor">
                    Редактор (Flow)
                    </Link>
                </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/dashboard">
                    Дашборд
                    </Link>
                </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4 ml-10">
          <Button variant="outline" className="hidden sm:flex">Войти</Button>
          <Button onClick={() => router.push('/auth')}>Начать</Button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/editor" className="text-lg font-medium">Редактор 11</Link>
                  <Link href="/dashboard" className="text-lg font-medium">Дашборд 22</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}