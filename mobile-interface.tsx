"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  MapPin,
  Clock,
  Star,
  Bell,
  Navigation,
  Filter,
  Home,
  List,
  Map,
  User,
  RefreshCw,
  ChevronRight,
  Zap,
} from "lucide-react"

export default function MobileInterface() {
  const [activeTab, setActiveTab] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")

  const quickAccess = [
    { id: "work", name: "Travail", stop: "Place de la République", line: "L1", time: "2 min" },
    { id: "home", name: "Maison", stop: "Avenue des Champs", line: "L2", time: "5 min" },
    { id: "uni", name: "Université", stop: "Campus Nord", line: "L3", time: "8 min" },
  ]

  const nearbyBuses = [
    {
      id: "B001",
      line: "L1",
      color: "bg-blue-500",
      destination: "Gare Centrale",
      stop: "Place République",
      arrival: "2 min",
      delay: 0,
    },
    {
      id: "B002",
      line: "L2",
      color: "bg-green-500",
      destination: "Université",
      stop: "Av. des Champs",
      arrival: "5 min",
      delay: 3,
    },
    {
      id: "B003",
      line: "L3",
      color: "bg-red-500",
      destination: "Aéroport",
      stop: "Métro Châtelet",
      arrival: "8 min",
      delay: -1,
    },
    {
      id: "B004",
      line: "L4",
      color: "bg-yellow-500",
      destination: "Centre Commercial",
      stop: "Bibliothèque",
      arrival: "11 min",
      delay: 0,
    },
  ]

  const alerts = [
    { id: "A001", type: "info", message: "Ligne L2 : Léger retard dû au trafic" },
    { id: "A002", type: "warning", message: "Travaux sur L4 : Déviation en cours" },
  ]

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">BusTracker</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Où voulez-vous aller ?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <TabsContent value="home" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  {/* Accès rapide */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      Accès rapide
                    </h2>
                    <div className="space-y-2">
                      {quickAccess.map((item) => (
                        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{item.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.line}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{item.stop}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-blue-600">{item.time}</div>
                                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Alertes */}
                  {alerts.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Alertes</h2>
                      <div className="space-y-2">
                        {alerts.map((alert) => (
                          <Card key={alert.id} className="border-l-4 border-l-orange-400">
                            <CardContent className="p-3">
                              <p className="text-sm">{alert.message}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* À proximité */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold">À proximité</h2>
                      <Button variant="ghost" size="sm">
                        <Navigation className="w-4 h-4 mr-1" />
                        Localiser
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {nearbyBuses.slice(0, 3).map((bus) => (
                        <Card key={bus.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${bus.color}`} />
                                <span className="font-semibold">{bus.line}</span>
                                <span className="text-sm text-gray-600">→ {bus.destination}</span>
                              </div>
                              <Badge
                                variant={bus.delay > 0 ? "destructive" : bus.delay < 0 ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {bus.delay > 0 ? `+${bus.delay}min` : bus.delay < 0 ? `${bus.delay}min` : "À l'heure"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{bus.stop}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="font-medium text-blue-600">{bus.arrival}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="list" className="h-full m-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Tous les bus</h2>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filtrer
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-3">
                    {nearbyBuses.map((bus) => (
                      <Card key={bus.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${bus.color}`} />
                              <span className="font-semibold text-lg">{bus.line}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-blue-600">{bus.arrival}</div>
                              <Badge
                                variant={bus.delay > 0 ? "destructive" : bus.delay < 0 ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {bus.delay > 0 ? `+${bus.delay}min` : bus.delay < 0 ? `${bus.delay}min` : "À l'heure"}
                              </Badge>
                            </div>
                          </div>
                          <p className="font-medium mb-1">{bus.destination}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{bus.stop}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="map" className="h-full m-0">
              <div className="h-full bg-gray-100 flex items-center justify-center relative">
                <div className="text-center">
                  <Map className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Carte Interactive</h3>
                  <p className="text-gray-500 text-sm">Visualisation en temps réel</p>
                </div>
                <Button className="absolute bottom-4 right-4" size="icon">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Mon Profil</h2>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Favoris</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {quickAccess.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>{item.name}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Alertes de retard</span>
                            <div className="w-10 h-6 bg-blue-600 rounded-full"></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Rappels de départ</span>
                            <div className="w-10 h-6 bg-gray-300 rounded-full"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>

          {/* Navigation bottom */}
          <TabsList className="grid w-full grid-cols-4 rounded-none border-t bg-white h-16">
            <TabsTrigger value="home" className="flex-col gap-1 h-full">
              <Home className="w-4 h-4" />
              <span className="text-xs">Accueil</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex-col gap-1 h-full">
              <List className="w-4 h-4" />
              <span className="text-xs">Liste</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex-col gap-1 h-full">
              <Map className="w-4 h-4" />
              <span className="text-xs">Carte</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-col gap-1 h-full">
              <User className="w-4 h-4" />
              <span className="text-xs">Profil</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
