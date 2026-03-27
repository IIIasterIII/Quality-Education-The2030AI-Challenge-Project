import { Geist, Geist_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { StoreProvider } from "@/components/storeProvider"
import { AuthProvider } from "@/components/authProvider"
import { MathJaxProvider } from "@/components/MathJaxProvider"

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
    <html lang="en" suppressHydrationWarning className={cn("dark antialiased", fontMono.variable, "font-sans", fontSans.variable)} style={{ colorScheme: 'dark' }}>
      <body cz-shortcut-listen="true" suppressHydrationWarning className="bg-background text-foreground">
          <MathJaxProvider>
            <StoreProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </StoreProvider>
          </MathJaxProvider>
      </body>
    </html>
  )
}
