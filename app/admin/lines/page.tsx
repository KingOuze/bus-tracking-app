"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { LineTable } from "@/components/admin/line-table"
import { LineForm } from "@/components/admin/line-form"
import type { Line } from "@/types"
import { fetchLines } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LinesPage() {
  const [lines, setLines] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLine, setEditingLine] = useState<Line | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const [loadingAuth, setLoadingAuth] = useState(true)
  const router = useRouter()
  
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
        localStorage.removeItem("userRole")
        router.push("/login");
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

  const loadLines = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchLines()
      console.log(data.lines)
      setLines(data.lines)
    } catch (error) {
      console.error("Failed to fetch lines:", error)
      setLines([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLines()
  }, [loadLines])

  const handleAddLine = () => {
    setEditingLine(null)
    setShowForm(true)
  }

  const handleEditLine = (line: Line) => {
    setEditingLine(line)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingLine(null)
    loadLines()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingLine(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Lignes</h1>
        <Button onClick={handleAddLine}>Ajouter une Ligne</Button>
      </div>

      <LineTable lines={lines} loading={loading} onEdit={handleEditLine} onRefresh={loadLines} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingLine ? "Modifier la Ligne" : "Ajouter une Nouvelle Ligne"}</DialogTitle>
          </DialogHeader>
          <LineForm line={editingLine} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
