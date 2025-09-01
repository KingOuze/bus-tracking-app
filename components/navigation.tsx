"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Bus, Route, Bell, Settings, Menu, LogOut, MapPin, Plus, Brain, TrendingUp } from "lucide-react"

interface NavigationProps {
  isMobile?: boolean
  currentView?: string
  onViewChange?: (view: string) => void
}

export function Navigation({ isMobile = false, currentView, onViewChange }: NavigationProps) {
  const pathname = usePathname()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const navSections = [
    {
      title: "Tableau de bord",
      items: [{ name: "Accueil", href: "/", icon: Home, adminOnly: true, color: "text-blue-600" }],
    },
    {
      title: "Gestion",
      items: [
        { name: "Gestion des Bus", href: "/admin/buses", icon: Bus, adminOnly: true, color: "text-green-600" },
        { name: "Gestion des Arrêts", href: "/admin/stops", icon: MapPin, adminOnly: true, color: "text-green-600" },
        { name: "Gestion des Lignes", href: "/admin/lines", icon: Route, adminOnly: true, color: "text-green-600" },
      ],
    },
    {
      title: "Alertes & Monitoring",
      items: [
        { name: "Alertes", href: "/alerts", icon: Bell, adminOnly: true, color: "text-orange-600" },
        { name: "Créer une alerte", href: "/admin/alerts", icon: Plus, adminOnly: true, color: "text-orange-600" },
      ],
    },
    {
      title: "Analyses & IA",
      items: [
        { name: "Analyses", href: "/statistics", icon: TrendingUp, adminOnly: true, color: "text-purple-600" },
        { name: "Prédictions IA", href: "/predictions", icon: Brain, adminOnly: true, color: "text-purple-600" },
      ],
    },
    {
      title: "Configuration",
      items: [{ name: "Paramètres", href: "/settings", icon: Settings, adminOnly: true, color: "text-gray-600" }],
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const renderNavLinks = (isAdmin: boolean) => (
    <nav className="flex flex-col gap-6 px-4 py-2">
      {navSections.map((section) => {
        const visibleItems = section.items.filter((item) => !item.adminOnly || isAdmin)
        if (visibleItems.length === 0) return null

        return (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-800 shadow-sm border border-blue-200"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    onClick={() => {
                      if (isMobile) setIsSheetOpen(false)
                      if (onViewChange && !item.adminOnly) onViewChange(item.name)
                    }}
                  >
                    <item.icon
                      className={`h-6 w-6 transition-colors ${
                        isActive
                          ? "text-blue-700"
                          : `${item.color} group-hover:text-gray-800 dark:group-hover:text-white`
                      }`}
                    />
                    <span className="truncate font-medium">{item.name}</span>
                    {isActive && <div className="ml-auto h-2.5 w-2.5 rounded-full bg-blue-700" />}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}

      {isAdmin && (
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-800 dark:hover:text-red-300 transition-all duration-200 justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
            <span className="font-medium">Déconnexion</span>
          </Button>
        </div>
      )}
    </nav>
  )

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
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <Bus className="h-7 w-7" />
            <div>
              <h1 className="text-lg font-bold">Bus Tracker</h1>
              <p className="text-xs text-blue-100">Administration</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto">{renderNavLinks(isAdmin)}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 h-full shadow-xl border-r border-gray-200">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex items-center gap-3 px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <Bus className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Bus Tracker</h1>
            <p className="text-sm text-blue-100">Panneau d'administration</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4">{renderNavLinks(isAdmin)}</div>
      </div>
    </aside>
  )
}
