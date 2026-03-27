import { AppNavbar } from "@/components/appNavbar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="h-screen flex flex-col selection:bg-primary/10 overflow-hidden">
            <AppNavbar />
            {children}
        </div>
    )
}