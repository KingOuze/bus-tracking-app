"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MapInterface from "@/map-interface"
import ListInterface from "@/list-interface"
import MobileInterface from "@/mobile-interface"
import {Navigation} from "@/components/navigation"
import {useIsMobile} from "@/hooks/use-mobile"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"


export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const [currentView, setCurrentView] = useState("map")
  const isMobile = useIsMobile()
  const router = useRouter()
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole")
    if (!token && !userRole) {
      router.push("/login");
      return
    }
  
    fetch(`${API_URL}/auth/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Invalid token");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
        localStorage.removeItem("userRole")
        return
      })
  }, []);
  

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-700">Chargement...</span>
      </div>
    )
  }

  return (
      <div className="flex h-screen overflow-hidden">
      {!isMobile && <Navigation currentView={currentView} onViewChange={setCurrentView} isMobile={false} />}
      <main className="flex-1 flex flex-col overflow-hidden">
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <Navigation isMobile={true} currentView={currentView} onViewChange={setCurrentView} />
            <h1 className="text-xl font-bold">Bus Tracker</h1>
          </div>
        )}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {isMobile ? (
            <MobileInterface />
          ) : (
            <Card className="h-full flex flex-col">
              <CardContent className="flex-1 p-0">
                <Tabs value={currentView} onValueChange={setCurrentView} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
                    <TabsTrigger value="map" className="rounded-none data-[state=active]:shadow-none">
                      Carte
                    </TabsTrigger>
                    <TabsTrigger value="list" className="rounded-none data-[state=active]:shadow-none">
                      Liste
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="map" className="flex-1 p-4">
                    <MapInterface />
                  </TabsContent>
                  <TabsContent value="list" className="flex-1 p-4">
                    <ListInterface />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  )
}
