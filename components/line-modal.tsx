"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Line } from "@/types"

interface LineModalProps {
  open: boolean
  onClose: () => void
  onSave: (line: Omit<Line, "_id" | "__v">, id?: string) => void
  initialData?: Line | null
}

export default function LineModal({ open, onClose, onSave, initialData }: LineModalProps) {
  const [form, setForm] = useState<Omit<Line, "_id" | "__v">>({
    lineId: "",
    name: "",
    shortName: "",
    color: "#000000",
    type: "bus",
    status: "active",
    company: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      const { _id, __v, ...rest } = initialData
      setForm(rest)
    } else {
      setForm({
        lineId: "",
        name: "",
        shortName: "",
        color: "#000000",
        type: "bus",
        status: "active",
        company: "",
      })
    }
    setErrors({})
  }, [initialData])

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const validateField = (field: keyof typeof form, value: string) => {
    let message = ""
    if (!value.trim()) {
      message = "Ce champ est obligatoire"
    }
    if (field === "lineId" && value.length < 2) {
      message = "L'ID doit contenir au moins 2 caractères"
    }
    if (field === "shortName" && value.length > 10) {
      message = "Nom court max 10 caractères"
    }
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  const isFormValid = () => {
    return (
      form.lineId.trim() &&
      form.name.trim() &&
      form.shortName.trim() &&
      form.company.trim() &&
      Object.values(errors).every((err) => !err)
    )
  }

  const handleSubmit = () => {
    if (!isFormValid()) return
    onSave(form, initialData?._id)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Modifier une ligne" : "Ajouter une ligne"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Numero de la ligne"
              value={form.lineId}
              onChange={(e) => handleChange("lineId", e.target.value)}
            />
            {errors.lineId && <p className="text-red-500 text-sm">{errors.lineId}</p>}
          </div>

          <div>
            <Input
              placeholder="Nom"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <Input
              placeholder="Nom court"
              value={form.shortName}
              onChange={(e) => handleChange("shortName", e.target.value)}
            />
            {errors.shortName && <p className="text-red-500 text-sm">{errors.shortName}</p>}
          </div>

          <Input
            type="color"
            value={form.color}
            onChange={(e) => handleChange("color", e.target.value)}
          />

          {/* Select Compagnie (saisie dure) */}
          <Select value={form.company} onValueChange={(v) => handleChange("company", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une compagnie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TATA">TATA</SelectItem>
              <SelectItem value="DDD">Dakar Dem Dikk(DDD)</SelectItem>
              <SelectItem value="TER">Train Express Regional(TER)</SelectItem>
              <SelectItem value="BRT">Bus Rapid Transit (BRT)</SelectItem>
            </SelectContent>
          </Select>
          {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}

          {/* Type */}
          <Select value={form.type} onValueChange={(v) => handleChange("type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Type de transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bus">🚌 Bus</SelectItem>
              <SelectItem value="tram">🚋 Tram</SelectItem>
              <SelectItem value="metro">🚇 Métro</SelectItem>
            </SelectContent>
          </Select>

          {/* Statut */}
          <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">✅ Active</SelectItem>
              <SelectItem value="inactive">⏸️ Inactive</SelectItem>
              <SelectItem value="maintenance">🛠️ Maintenance</SelectItem>
              <SelectItem value="disrupted">⚠️ Perturbée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            {initialData ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
