"use client";
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
  "/": "Operations Manager Dashboard",
  "/search": "Coolers",
  "/reports": "Reports",
  "/settings": "Settings",
  "/coolers/geofencing": "Geofencing",
  "/coolers/alerts": "Alerts",
  // Add more routes and titles as needed
}

export function SiteHeader() {
  const pathname = usePathname()
  // Find the best match for the current path
  const title =
    Object.entries(pageTitles).find(([route]) =>
      pathname === route || pathname.startsWith(route + "/")
    )?.[1] || "Dashboard"

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
