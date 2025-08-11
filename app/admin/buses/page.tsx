"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { BusForm } from "@/components/admin/bus-form"
import { BusTable } from "@/components/admin/bus-table"
import { fetchBuses, fetchLines } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Bus } from "@/types"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function BusManagementPage() {
  const { toast } = useToast()
  const [buses, setBuses] = useState<Bus[]>([])
  const [lines, setLines] = useState<{_id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const [loadingAuth, setLoadingAuth] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole")
    console.log(token)
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

  const loadBuses = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchBuses({
          limit: 0,
          lat: 0,
          lng: 0,
          radius: 0
      })
      console.log(data.buses)
      setBuses(data.buses)
      
      const dataLines = await fetchLines()
      setLines(dataLines.lines)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les bus.",
        variant: "destructive",
      })
      console.error("Failed to fetch buses:", error)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadBuses()
  }, [loadBuses])

  const handleAddBus = () => {
    setEditingBus(null)
    setIsFormModalOpen(true)
  }

  const handleEditBus = (bus: Bus) => {
    setEditingBus(bus)
    setIsFormModalOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormModalOpen(false)
    setEditingBus(null)
    loadBuses()
  }

  const handleFormCancel = () => {
    setIsFormModalOpen(false)
    setEditingBus(null)
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Bus</h1>
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddBus}>Ajouter un Bus</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBus ? "Modifier le Bus" : "Ajouter un Nouveau Bus"}</DialogTitle>
            </DialogHeader>
            <BusForm
              bus={editingBus}
              lines={lines}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
  
      <BusTable
        buses={buses}
        loading={loading}
        onEdit={handleEditBus}
        onRefresh={loadBuses}
      />
    </div>
  )
  
}
