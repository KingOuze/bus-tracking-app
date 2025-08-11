"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Stop } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface StopTableProps {
  stops: Stop[]
  loading: boolean
  onEdit: (stop: Stop) => void
  onDelete: (stopId: string) => void
}

export function StopTable({ stops, loading, onEdit, onDelete }: StopTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [stopToDelete, setStopToDelete] = useState<Stop | null>(null)

  const handleDeleteClick = (stop: Stop) => {
    setStopToDelete(stop)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (stopToDelete?._id) {
      onDelete(stopToDelete._id)
      setIsDeleteDialogOpen(false)
      setStopToDelete(null)
    }
  }

  if (loading) {
    return <div>Chargement des arrêts...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de l'arrêt</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Arrivée</TableHead>
            <TableHead>Départ</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stops.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Aucun arrêt trouvé pour cet itinéraire.
              </TableCell>
            </TableRow>
          ) : (
            stops.map((stop) => (
              <TableRow key={stop._id}>
                <TableCell className="font-medium">{stop.name}</TableCell>
                <TableCell>{stop.latitude}</TableCell>
                <TableCell>{stop.longitude}</TableCell>
                <TableCell>{stop.arrivalTime || "N/A"}</TableCell>
                <TableCell>{stop.departureTime || "N/A"}</TableCell>
                <TableCell>{stop.order}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onEdit(stop)} className="mr-2">
                    Modifier
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(stop)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Êtes-vous sûr de vouloir supprimer l'arrêt "{stopToDelete?.name}" ? Cette action est irréversible.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
