import { AppNavbar } from "@/components/appNavbar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="h-screen flex flex-col bg-background selection:bg-primary/10 overflow-hidden">
            <AppNavbar />
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    )
}