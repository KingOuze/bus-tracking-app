"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Clock, Filter, Navigation, Star, AlertCircle, CheckCircle } from "lucide-react"
import { fetchBuses, fetchLines } from "@/lib/api"

export default function MapInterface() {
  const [selectedLine, setSelectedLine] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [busLines, setBusLines] = useState<any[]>([])
  const [nearbyBuses, setNearbyBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [linesData, busesData] = await Promise.all([
          fetchLines(),
          fetchBuses({ limit: 10, lat: 48.8566, lng: 2.3522, radius: 10 }), // Exemple de position (Paris)
        ])
        setBusLines(linesData.lines)
        setNearbyBuses(busesData.buses)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Une erreur est survenue")
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Erreur: {error}</div>

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panneau latéral */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">BusTracker</h1>

          {/* Recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un arrêt, une ligne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-2 mb-4">
            <Select value={selectedLine} onValueChange={setSelectedLine}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Toutes les lignes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les lignes</SelectItem>
                {busLines.map((line: any) => (
                  <SelectItem key={line.lineId} value={line.lineId}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${line.color}`} />
                      {line.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <Button className="w-full mb-4 bg-transparent" variant="outline">
            <Navigation className="w-4 h-4 mr-2" />
            Ma position
          </Button>
        </div>

        {/* Contenu */}
        <ScrollArea className="flex-1">
          <Tabs defaultValue="nearby" className="p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nearby">À proximité</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
            </TabsList>

            <TabsContent value="nearby" className="space-y-4 mt-4">
              {nearbyBuses.map((bus: any) => (
                <Card key={bus.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${busLines.find((l) => l.lineId === bus.lineId.lineId)?.color}`}
                        />
                        <span className="font-semibold">{bus.lineId.lineId}</span>
                      </div>
                      <Badge variant={bus.delay > 0 ? "destructive" : bus.delay < 0 ? "default" : "secondary"}>
                        {bus.delay > 0 ? `+${bus.delay}min` : bus.delay < 0 ? `${bus.delay}min` : "À l'heure"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{bus.destination}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{bus.arrival}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="favorites" className="mt-4">
              <div className="text-center text-gray-500 py-8">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucun favori enregistré</p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* État du réseau */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="font-semibold mb-2">État du réseau</h3>
          <div className="space-y-2">
            {busLines.map((line: any) => {
              const lineStatus = nearbyBuses.some((bus: any) => bus.lineId.lineId === line.lineId && bus.delay > 0)
                ? "delayed"
                : "normal"
              return (
                <div key={line.lineId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${line.color}`} />
                    <span>{line.name}</span>
                  </div>
                  {lineStatus === "normal" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Zone carte */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Carte Interactive</h2>
            <p className="text-gray-500">Visualisation en temps réel des bus sur la carte</p>
          </div>
        </div>

        {/* Contrôles de la carte */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button size="icon" variant="outline" className="bg-white">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
