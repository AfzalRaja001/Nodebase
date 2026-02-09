import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppHeader = () => {
    return (
        <header className="flex h-14 shrink-0 items-centre gap-2 border-b px-4 bg-background">
            <SidebarTrigger/>
        </header>
    )


}