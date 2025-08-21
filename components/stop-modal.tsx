"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Stop {
  id: string
  name: string
  address: string
  latitude?: number
  longitude?: number
  status: "active" | "inactive"
  createdAt: string
}

interface StopModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (stop: Omit<Stop, "_id" | "createdAt">) => void
  stop?: Stop | null
}

export function StopModal({ isOpen, onClose, onSave, stop }: StopModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "active" as "active" | "inactive",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (stop) {
      setFormData({
        name: stop.name,
        address: stop.address,
        latitude: stop.latitude?.toString() || "",
        longitude: stop.longitude?.toString() || "",
        status: stop.status,
      })
    } else {
      setFormData({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        status: "active",
      })
    }
    setErrors({})
  }, [stop, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis"
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise"
    }

    if (formData.latitude && isNaN(Number(formData.latitude))) {
      newErrors.latitude = "La latitude doit être un nombre valide"
    }

    if (formData.longitude && isNaN(Number(formData.longitude))) {
      newErrors.longitude = "La longitude doit être un nombre valide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const stopData = {
      // Assuming stop._id is not needed for the form submission
      // If you need it, you can add it back
      id: stop?.id || "",
      name: formData.name.trim(),
      address: formData.address.trim(),
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
      status: formData.status,
      createdAt: stop ? stop.createdAt : new Date().toISOString(),
    }

    onSave(stopData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{stop ? "Modifier l'arrêt" : "Ajouter un arrêt"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'arrêt *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Gare Centrale"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Ex: 123 Rue de la Gare, Paris"
              className={errors.address ? "border-destructive" : ""}
              rows={3}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                placeholder="48.8566"
                type="number"
                step="any"
                className={errors.latitude ? "border-destructive" : ""}
              />
              {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                placeholder="2.3522"
                type="number"
                step="any"
                className={errors.longitude ? "border-destructive" : ""}
              />
              {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{stop ? "Modifier" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
