import { Geist, Geist_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import { Navbar } from "@/components/navbar"
import { StoreProvider } from "@/components/storeProvider"
import { AuthProvider } from "@/components/authProvider"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", fontSans.variable)}>
      <body cz-shortcut-listen="true" suppressHydrationWarning>
        <ThemeProvider>
          <StoreProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
