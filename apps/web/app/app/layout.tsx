import { AppNavbar } from "@/components/appNavbar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div><AppNavbar />{children}</div>
}