"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StopTable } from "@/components/admin/stop-table"
import { StopForm } from "@/components/admin/stop-form"
import type { Stop, Line } from "@/types"
import { fetchLineById, createStopForLine, updateStopForLine, deleteStopForLine } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

export default function LineStopsPage() {
  const params = useParams()
  const lineId = params.lineId as string

  const [line, setLine] = useState<Line | null>(null)
  const [goStops, setGoStops] = useState<Stop[]>([])
  const [returnStops, setReturnStops] = useState<Stop[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStop, setEditingStop] = useState<Stop | null>(null)
  const [currentRouteType, setCurrentRouteType] = useState<"go" | "return">("go")

  const loadStops = useCallback(async () => {
    setLoading(true)
    try {
      const { line: fetchedLine } = await fetchLineById(lineId)
      console.log(fetchedLine)
      setLine(fetchedLine)
      setGoStops(fetchedLine.stops?.go ?? [])
      setReturnStops(fetchedLine.stops?.return ?? [])
    } catch (error) {
      console.error("Failed to fetch line stops:", error)
      toast({
        title: "Erreur",
        description: "Échec du chargement des arrêts de la ligne.",
        variant: "destructive",
      })
      setGoStops([])
      setReturnStops([])
    } finally {
      setLoading(false)
    }
  }, [lineId])

  useEffect(() => {
    if (lineId) {
      loadStops()
    }
  }, [lineId, loadStops])

  const handleAddStop = () => {
    setEditingStop(null)
    setShowForm(true)
  }

  const handleEditStop = (stop: Stop) => {
    setEditingStop(stop)
    setShowForm(true)
  }

  const handleFormSuccess = async (stopData: Stop) => {
    try {
      if (editingStop?._id) {
        await updateStopForLine(lineId, editingStop._id, stopData, currentRouteType)
        toast({
          title: "Succès",
          description: "Arrêt mis à jour avec succès.",
        })
      } else {
        await createStopForLine(lineId, stopData, currentRouteType)
        toast({
          title: "Succès",
          description: "Arrêt ajouté avec succès.",
        })
      }
      setShowForm(false)
      setEditingStop(null)
      loadStops()
    } catch (error) {
      console.error("Failed to save stop:", error)
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de l'arrêt. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStop = async (stopId: string) => {
    try {
      await deleteStopForLine(lineId, stopId, currentRouteType)
      toast({
        title: "Succès",
        description: "Arrêt supprimé avec succès.",
      })
      loadStops()
    } catch (error) {
      console.error("Failed to delete stop:", error)
      toast({
        title: "Erreur",
        description: "Échec de la suppression de l'arrêt. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingStop(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Arrêts pour la Ligne: {line?.name || lineId}</h1>
        <Button onClick={handleAddStop}>Ajouter un Arrêt</Button>
      </div>

      <Tabs value={currentRouteType} onValueChange={(value) => setCurrentRouteType(value as "go" | "return")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="go">Itinéraire Aller</TabsTrigger>
          <TabsTrigger value="return">Itinéraire Retour</TabsTrigger>
        </TabsList>
        <TabsContent value="go">
          <StopTable stops={goStops} loading={loading} onEdit={handleEditStop} onDelete={handleDeleteStop} />
        </TabsContent>
        <TabsContent value="return">
          <StopTable stops={returnStops} loading={loading} onEdit={handleEditStop} onDelete={handleDeleteStop} />
        </TabsContent>
      </Tabs>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStop ? "Modifier l'Arrêt" : "Ajouter un Nouvel Arrêt"}</DialogTitle>
          </DialogHeader>
          <StopForm
            stop={editingStop}
            onSuccess={() => handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
