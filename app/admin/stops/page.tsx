"use client"

import { useState, useEffect, useMemo, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { StopModal } from "@/components/stop-modal"
import { useToast } from "@/hooks/use-toast"
import { fetchAllStops, createStop, updateStop, deleteStop } from "@/lib/api"
import type { Stop } from "@/types" // or from "types/index" if that's the correct path

// Remove local Stop interface, use imported type

const ITEMS_PER_PAGE = 10

export default function StopsPage() {
  const [stops, setStops] = useState<Stop[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStop, setEditingStop] = useState<Stop | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStops = async () => {
      const response = await fetchAllStops()
      setStops(response.stops)
    }
    fetchStops()
    setLoading(false)
  }, [])

  const filteredAndPaginatedStops = useMemo(() => {
    const filtered = stops.filter((stop) => {
    if (!stop || !stop.name || !stop.address) return false; // Ignore les arrêts incomplets
    const matchesSearch =
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || stop.status === statusFilter

    return matchesSearch && matchesStatus
  })

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedStops = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return {
      stops: paginatedStops,
      totalStops: filtered.length,
      totalPages,
      currentPage: Math.min(currentPage, totalPages || 1),
    }
  }, [stops, searchTerm, statusFilter, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const handleAddStop = () => {
    setEditingStop(null)
    setIsModalOpen(true)
  }

  const handleEditStop = (stop: Stop) => {
    setEditingStop(stop)
    setIsModalOpen(true)
  }

  const handleDeleteStop = async (stopId: string) => {
    try {
      await deleteStop(stopId)
      setStops((prev) => prev.filter((stop) => stop._id !== stopId))
      toast({
        title: "Arrêt supprimé",
        description: "L'arrêt a été supprimé avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'arrêt. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleSaveStop = async (stopData: Omit<Stop, "_id" | "__v">) => {

    const safeStopData: Omit<Stop, "_id" | "__v"> = {
      ...stopData,
      latitude: typeof stopData.latitude === "number" ? stopData.latitude : Number(stopData.latitude) || 0,
      longitude: typeof stopData.longitude === "number" ? stopData.longitude : Number(stopData.longitude) || 0,
    }
    if (editingStop) {
      // Modification
      try {
        const updatedStop = { ...editingStop, ...safeStopData }
        await updateStop(editingStop._id, updatedStop)
        // Update local state
        setStops((prev) =>
          prev.map((stop) => (stop._id === editingStop._id ? { ...stop, ...updatedStop } : stop)),
        )
        toast({
          title: "Arrêt modifié",
          description: "L'arrêt a été modifié avec succès.",
        })
      } catch (error) {
        console.error("Erreur Update" + error)
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'arrêt. Veuillez réessayer.",
          variant: "destructive",
        })
      }
    } else {
      // Ajout
      if (!safeStopData.name || !safeStopData.address) {
        toast({
          title: "Erreur",
          description: "Le nom et l'adresse de l'arrêt sont requis.",
          variant: "destructive",
        })
        return
      }
      try {
        const newStop = await createStop(safeStopData)
        console.log("Nouveau Stop", newStop)
        setStops((prev) => [...prev, newStop.stop])
        toast({
          title: "Arrêt ajouté",
          description: "L'arrêt a été ajouté avec succès.",
        })
      } catch (error) {
        console.log("Erreur Ajout" + error)
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'arrêt. Veuillez réessayer.",
          variant: "destructive",
        })
      }

      setIsModalOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des arrêts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Arrêts</h1>
            <p className="text-muted-foreground">
              {stops.length} arrêt{stops.length > 1 ? "s" : ""} au total
              {filteredAndPaginatedStops.totalStops !== stops.length &&
                ` • ${filteredAndPaginatedStops.totalStops} affiché${filteredAndPaginatedStops.totalStops > 1 ? "s" : ""}`}
            </p>
          </div>
          <Button onClick={handleAddStop} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un arrêt
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un arrêt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs uniquement</SelectItem>
              <SelectItem value="inactive">Inactifs uniquement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredAndPaginatedStops.stops.map((stop) => (
            <Card key={stop._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">{stop.name}</h3>
                      <Badge variant={stop.status === "active" ? "default" : "secondary"}>
                        {stop.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{stop.address}</p>
                    {stop.latitude && stop.longitude && (
                      <p className="text-sm text-muted-foreground">
                        Coordonnées: {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Créé le {new Date(stop.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditStop(stop)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStop(stop._id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndPaginatedStops.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-muted-foreground">
              Page {filteredAndPaginatedStops.currentPage} sur {filteredAndPaginatedStops.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(filteredAndPaginatedStops.totalPages, prev + 1))}
                disabled={currentPage === filteredAndPaginatedStops.totalPages}
                className="flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {filteredAndPaginatedStops.stops.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucun arrêt trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Aucun arrêt ne correspond à vos critères de recherche."
                  : "Commencez par ajouter votre premier arrêt."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={handleAddStop} className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Ajouter un arrêt
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <StopModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStop}
          stop={editingStop}
        />
      </div>
    </div>
  )


}

