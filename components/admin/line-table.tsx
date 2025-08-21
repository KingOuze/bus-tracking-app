"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Line } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { deleteLine } from "@/lib/api"
import Link from "next/link"

interface LineTableProps {
  lines: Line[]
  loading: boolean
  onEdit: (line: Line) => void
  onRefresh: () => void
}

export function LineTable({ lines, loading, onEdit, onRefresh }: LineTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lineToDelete, setLineToDelete] = useState<Line | null>(null)

  const handleDeleteClick = (line: Line) => {
    setLineToDelete(line)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (lineToDelete) {
      try {
        await deleteLine(lineToDelete._id)
        onRefresh()
        setIsDeleteDialogOpen(false)
        setLineToDelete(null)
      } catch (error) {
        console.error("Failed to delete line:", error)
        alert("Failed to delete line. Please try again.")
      }
    }
  }

  if (loading) {
    return <div>Chargement des lignes...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro de Ligne</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Aucune ligne trouvée.
              </TableCell>
            </TableRow>
          ) : (
            lines.map((line) => (
              <TableRow key={line._id}>
                <TableCell className="font-medium">{line.lineId}</TableCell>
                <TableCell>{line.shortName}</TableCell>
                <TableCell>{line.name || "N/A"}</TableCell>
                <TableCell>{line.type}</TableCell>
                <TableCell>{line.status}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/lines/${line._id}/stops`} passHref>
                    <Button variant="outline" size="sm" className="mr-2 bg-transparent">
                      Gérer les arrêts
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => onEdit(line)} className="mr-2">
                    Modifier
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(line)}>
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
            Êtes-vous sûr de vouloir supprimer la ligne "{lineToDelete?.name}" ? Cette action est irréversible.
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
