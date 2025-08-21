"use client"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Route, MapPin, Plus, X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Line, Stop } from "@/types"
import { fetchLines, fetchStopsByLine, createStopForLine, deleteStopForLine, fetchAllStops } from "@/lib/api"

interface LineWithStops extends Line {
  stops: { go: Stop[]; return: Stop[] }
}

interface StopWithOrder extends Stop {
  order: number
}

const LINES_PER_PAGE = 10
const STOPS_PER_PAGE = 20

export default function LinesPage() {
  const [lines, setLines] = useState<Line[]>([])
  const [selectedLine, setSelectedLine] = useState<Line | null>(null)
  const [selectedLineStops, setSelectedLineStops] = useState<{ go: Stop[]; return: Stop[] }>({ go: [], return: [] })
  const [selectedDirection, setSelectedDirection] = useState<"go" | "return">("go")
  const [allStops, setAllStops] = useState<Stop[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stopSearchTerm, setStopSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [currentStopPage, setCurrentStopPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [stopsLoading, setStopsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadLines = async () => {
      try {
        setLoading(true)
        const response = await fetchLines()
        setLines(response.lines)
      } catch (error) {
        console.error("Error loading lines:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les lignes. Vérifiez votre connexion.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    const loadAllStops = async () => {
      try {
        const response = await fetchAllStops()
        console.log("All stops loaded:", response.stops)
        setAllStops(response.stops)
      } catch (error) {
        console.error("Error loading all stops:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les arrêts disponibles.",
          variant: "destructive",
        })
      }
    }

    loadLines()
    loadAllStops()
  }, [toast])

  useEffect(() => {
    const loadLineStops = async () => {
      if (!selectedLine) return

      try {
        setStopsLoading(true)
        const response = await fetchStopsByLine(selectedLine._id)
        setSelectedLineStops(response.stops || { go: [], return: [] })
      } catch (error) {
        console.error("Error loading line stops:", error)
        setSelectedLineStops({ go: [], return: [] })
        toast({
          title: "Erreur",
          description: "Impossible de charger les arrêts de la ligne.",
          variant: "destructive",
        })
      } finally {
        setStopsLoading(false)
      }
    }

    loadLineStops()
  }, [selectedLine, toast])

  const filteredAndPaginatedLines = useMemo(() => {
    const filtered = lines.filter((line) => {
      const matchesSearch =
        line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        line.shortName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || line.type === typeFilter
      const matchesCompany = companyFilter === "all" || line.company === companyFilter

      return matchesSearch && matchesType && matchesCompany
    })

    const totalPages = Math.ceil(filtered.length / LINES_PER_PAGE)
    const startIndex = (currentPage - 1) * LINES_PER_PAGE
    const paginated = filtered.slice(startIndex, startIndex + LINES_PER_PAGE)

    return {
      lines: paginated,
      totalLines: filtered.length,
      totalPages,
      currentPage: Math.min(currentPage, totalPages || 1),
    }
  }, [lines, searchTerm, typeFilter, companyFilter, currentPage])

  const filteredAvailableStops = useMemo(() => {
    if (!selectedLine) return { stops: [], totalStops: 0, totalPages: 0 }

    const currentStops = selectedLineStops?.[selectedDirection] || []
    const assignedStopIds = currentStops.map((s) => s._id)
    const filtered = allStops.filter((stop) => {
      const matchesSearch = stop.name.toLowerCase().includes(stopSearchTerm.toLowerCase())
      const notAssigned = !assignedStopIds.includes(stop._id)
      return matchesSearch && notAssigned
    })

    const totalPages = Math.ceil(filtered.length / STOPS_PER_PAGE)
    const startIndex = (currentStopPage - 1) * STOPS_PER_PAGE
    const paginated = filtered.slice(startIndex, startIndex + STOPS_PER_PAGE)

    return {
      stops: paginated,
      totalStops: filtered.length,
      totalPages,
    }
  }, [allStops, stopSearchTerm, currentStopPage, selectedLine, selectedLineStops, selectedDirection])

  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(lines.map((line) => line.company))).sort()
  }, [lines])

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(lines.map((line) => line.type))).sort()
  }, [lines])

  const handleAssignStop = async (stop: Stop) => {
    if (!selectedLine) return

    try {
      await createStopForLine(selectedLine._id, stop, selectedDirection)

      const response = await fetchStopsByLine(selectedLine._id)
      setSelectedLineStops(response.stops)

      toast({
        title: "Arrêt assigné",
        description: `L'arrêt "${stop.name}" a été assigné à la ligne "${selectedLine.name}".`,
      })
    } catch (error) {
      console.error("Error assigning stop:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'assigner l'arrêt à la ligne.",
        variant: "destructive",
      })
    }
  }

  const handleUnassignStop = async (stopId: string) => {
    if (!selectedLine) return

    const stop = selectedLineStops[selectedDirection].find((s) => s._id === stopId)
    if (!stop) return

    try {
      await deleteStopForLine(selectedLine._id, stopId, selectedDirection)

      const response = await fetchStopsByLine(selectedLine._id)
      setSelectedLineStops(response.stops)

      toast({
        title: "Arrêt désassigné",
        description: `L'arrêt "${stop.name}" a été retiré de la ligne "${selectedLine.name}".`,
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error unassigning stop:", error)
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'arrêt de la ligne.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "maintenance":
        return "secondary"
      case "disrupted":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bus":
        return "🚌"
      case "tram":
        return "🚋"
      case "metro":
        return "🚇"
      default:
        return "🚌"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des lignes...</p>
        </div>
      </div>
    )
  }

  if (selectedLine) {
    const currentStops = selectedLineStops?.[selectedDirection] || []

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedLine(null)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux lignes
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: selectedLine.color }} />
              <div>
                <h1 className="text-3xl font-bold">{selectedLine.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{getTypeIcon(selectedLine.type)}</span>
                  <Badge variant={getStatusColor(selectedLine.status)}>{selectedLine.status}</Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{selectedLine.company}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                variant={selectedDirection === "go" ? "default" : "outline"}
                onClick={() => setSelectedDirection("go")}
              >
                Aller ({(selectedLineStops?.go || []).length} arrêts)
              </Button>
              <Button
                variant={selectedDirection === "return" ? "default" : "outline"}
                onClick={() => setSelectedDirection("return")}
              >
                Retour ({(selectedLineStops?.return || []).length} arrêts)
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ajouter un arrêt - Direction {selectedDirection === "go" ? "Aller" : "Retour"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher un arrêt à ajouter..."
                    value={stopSearchTerm}
                    onChange={(e) => setStopSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredAvailableStops.stops.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto border rounded-lg">
                    <div className="divide-y">
                      {filteredAvailableStops.stops.map((stop) => (
                        <div key={stop._id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{stop.name}</span>
                          </div>
                          <Button size="sm" onClick={() => handleAssignStop(stop)}>
                            <Plus className="w-4 h-4 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    {stopSearchTerm ? "Aucun arrêt trouvé" : "Tous les arrêts sont déjà assignés"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Arrêts - Direction {selectedDirection === "go" ? "Aller" : "Retour"} ({currentStops.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stopsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Chargement des arrêts...</p>
                </div>
              ) : currentStops.length > 0 ? (
                <div className="space-y-2">
                  {currentStops
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((stop, index) => (
                      <div key={stop._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{stop.name}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnassignStop(stop._id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Route className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun arrêt assigné pour cette direction</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Lignes</h1>
          <p className="text-muted-foreground">
            {lines.length} ligne{lines.length > 1 ? "s" : ""} • {allStops.length} arrêt
            {allStops.length > 1 ? "s" : ""} disponible{allStops.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une ligne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type de transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Compagnie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les compagnies</SelectItem>
              {uniqueCompanies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground flex items-center">
            {filteredAndPaginatedLines.totalLines} résultat{filteredAndPaginatedLines.totalLines > 1 ? "s" : ""}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredAndPaginatedLines.lines.map((line) => (
            <Card
              key={line._id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedLine(line)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: line.color }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(line.type)}</span>
                        <h3 className="font-semibold text-lg">{line.name}</h3>
                        <Badge variant={getStatusColor(line.status)}>{line.status}</Badge>
                      </div>
                      <p className="text-muted-foreground">{line.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">ID: {line.lineId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndPaginatedLines.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-muted-foreground">
              Page {filteredAndPaginatedLines.currentPage} sur {filteredAndPaginatedLines.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(filteredAndPaginatedLines.totalPages, prev + 1))}
                disabled={currentPage === filteredAndPaginatedLines.totalPages}
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {filteredAndPaginatedLines.lines.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucune ligne trouvée</h3>
              <p className="text-muted-foreground">Aucune ligne ne correspond à vos critères de recherche.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
