"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"
import { useState, useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<string>("dashboard")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("userRole")
    if (token && role) {
      setIsAuthenticated(true)
      setUserRole(role)
    } else {
      setIsAuthenticated(false)
      setUserRole(null)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement de l'application...</p>
      </div>
    )
  }

    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <Navigation 
            currentView={currentView}
            onViewChange={setCurrentView}
            isMobile={false}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
          <Toaster />
        </div>
      </SidebarProvider>
    )
  }
  

