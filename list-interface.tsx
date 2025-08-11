"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Clock, MapPin, Bus, ArrowUpDown, Star, Bell, RefreshCw } from "lucide-react"
import { fetchBuses, fetchLines } from "@/lib/api"
import { type Line } from "@/types"

export default function ListInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLines, setSelectedLines] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("arrival")
  const [busData, setBusData] = useState<any[]>([])
  const [availableBusLines, setAvailableBusLines] = useState<Line[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        // Provide required lat, lng, and radius for fetchBuses
        const [busesRes, linesRes] = await Promise.all([
          fetchBuses({ limit: 20, lat: 48.8566, lng: 2.3522, radius: 5000 }),
          fetchLines()
        ])
        setBusData(busesRes.buses)
        setAvailableBusLines(linesRes.lines)
      } catch (err: any) {
        setError(err?.message ?? "Une erreur est survenue")
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    loadData()

  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Erreur: {error}</div>

  const getOccupancyColor = (occupancyLevel: string) => {
    switch (occupancyLevel) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "full":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Suivi des Bus en Temps Réel</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Alertes
              </Button>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un arrêt, une ligne, une destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arrival">Temps d'arrivée</SelectItem>
                  <SelectItem value="line">Ligne</SelectItem>
                  <SelectItem value="delay">Retard</SelectItem>
                  <SelectItem value="occupancy">Affluence</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </div>

          {/* Filtres par ligne */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-medium text-gray-700">Lignes :</span>
            <div className="flex gap-2">
              {availableBusLines.map((line) => (
                <div key={line._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={line._id}
                    checked={selectedLines.includes(line._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLines([...selectedLines, line._id])
                      } else {
                        setSelectedLines(selectedLines.filter((l) => l !== line._id))
                      }
                    }}
                  />
                  <label htmlFor={line._id} className="text-sm font-medium">
                    {line.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des données */}
      <div className="max-w-7xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="w-5 h-5" />
              Prochains passages ({busData.length} bus)
            </CardTitle>
            <CardDescription>Informations en temps réel sur les bus à proximité</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold">
                      Ligne
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>Itinéraire</TableHead>
                  <TableHead>Arrêt</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold">
                      Arrivée
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>Suivant</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead>Affluence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {busData.map((bus:any) => (
                  <TableRow key={bus._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${bus.lineId.color}`} />
                        <span className="font-semibold">{bus.lineId.lineId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={`${bus.currentStop} → ${bus.destination}`}>
                        {bus.currentStop} → {bus.destination}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{bus.currentStop}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">
                          {bus.estimatedArrival
                            ? new Date(bus.estimatedArrival).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">N/A</TableCell>
                    {/* L'API ne fournit pas directement le "nextArrival" pour l'instant */}
                    <TableCell>
                      <Badge variant={bus.delay > 0 ? "destructive" : bus.delay < 0 ? "default" : "secondary"}>
                        {bus.delay > 0 ? `+${bus.delay}min` : bus.delay < 0 ? `${bus.delay}min` : "À l'heure"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getOccupancyColor(bus.occupancy.level)}>
                        {bus.occupancy.level} ({bus.occupancy.percentage}%)
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Star className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bell className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Bus actifs</p>
                  <p className="text-xl font-bold">{busData.filter((b:any) => b.status === "active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">À l'heure</p>
                  <p className="text-xl font-bold">{busData.filter((b:any) => b.delay === 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">En retard</p>
                  <p className="text-xl font-bold">{busData.filter((b:any) => b.delay > 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Arrêts</p>
                  <p className="text-xl font-bold">156</p>
                  {/* Cette donnée n'est pas directement dans l'API de bus, il faudrait une route spécifique pour les arrêts */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
