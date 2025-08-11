"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Bus } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { deleteBus } from "@/lib/api"

interface BusTableProps {
  buses: Bus[],
  loading: boolean
  onEdit: (bus: Bus) => void
  onRefresh: () => void
}

export function BusTable({ buses, loading, onEdit, onRefresh }: BusTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [busToDelete, setBusToDelete] = useState<Bus | null>(null)

  const handleDeleteClick = (bus: Bus) => {
    setBusToDelete(bus)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (busToDelete) {
      try {
        await deleteBus(busToDelete._id)
        onRefresh()
        setIsDeleteDialogOpen(false)
        setBusToDelete(null)
      } catch (error) {
        console.error("Failed to delete bus:", error)
        alert("Failed to delete bus. Please try again.")
      }
    }
  }

  if (loading) {
    return <div>Chargement des bus...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro de Bus</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Ligne Actuelle</TableHead>
            <TableHead>Conducteur</TableHead>
            <TableHead>Dernière Maintenance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Aucun bus trouvé.
              </TableCell>
            </TableRow>
          ) : (
            buses.map((bus) => (
              <TableRow key={bus._id}>
                <TableCell className="font-medium">{bus.busId}</TableCell>
                <TableCell>{bus.capacity || "N/A"}</TableCell>
                <TableCell>{bus.status}</TableCell>
                <TableCell>{bus.lineId.name}</TableCell>
                <TableCell>{bus.driverName || "N/A"}</TableCell>
                <TableCell>
                  {bus.lastMaintenance ? new Date(bus.lastMaintenance).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onEdit(bus)} className="mr-2">
                    Modifier
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(bus)}>
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
            Êtes-vous sûr de vouloir supprimer le bus "{busToDelete?.busId}" ? Cette action est irréversible.
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
