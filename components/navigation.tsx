"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Bus, Route, Bell, BarChart, Settings, Menu, LogOut, MapPin } from "lucide-react"

interface NavigationProps {
  isMobile?: boolean
  currentView?: string
  onViewChange?: (view: string) => void
}

export function Navigation({ isMobile = false, currentView, onViewChange }: NavigationProps) {
  const pathname = usePathname()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const navItems = [
    { name: "Accueil", href: "/", icon: Home, adminOnly: true },
    
    { name: "Gestion des Bus", href: "/admin/buses", icon: Bus, adminOnly: true }, 
    { name: "Gestion des Arrêts", href: "/admin/stops", icon: MapPin, adminOnly: true },
    { name: "Gestion des Lignes", href: "/admin/lines", icon: Route, adminOnly: true },
    { name: "Alertes", href: "/alerts", icon: Bell, adminOnly: true },
    { name: "Statistiques", href: "/statistics", icon: BarChart, adminOnly: true },
    { name: "Paramètres", href: "/settings", icon: Settings, adminOnly: true },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const renderNavLinks = (isAdmin: boolean) => (
    <nav className="grid items-start gap-2 px-4 text-sm font-medium">
      {navItems.map((item) => {
        if (item.adminOnly && !isAdmin) {
          return null
        }
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 ${
              isActive ? "bg-gray-100 text-gray-900" : "text-gray-500"
            }`}
            onClick={() => {
              if (isMobile) setIsSheetOpen(false)
              if (onViewChange && !item.adminOnly) onViewChange(item.name)
            }}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
      {isAdmin && (
        <Button
          variant="ghost"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      )}
    </nav>
  )

  // Check if user is admin
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null
  const isAdmin = userRole === "admin"

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden bg-transparent"
            onClick={() => setIsSheetOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Bus className="h-6 w-6" />
            <span>Bus Tracker</span>
          </Link>
          {renderNavLinks(isAdmin)}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 h-full shadow-lg">
      <div className="hidden border-r bg-gray-100/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <Bus className="h-6 w-6" />
              <span className="">Bus Tracker</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">{renderNavLinks(isAdmin)}</div>
        </div>
      </div>
    </aside>
  )
}
