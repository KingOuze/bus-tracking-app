"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { type Line, lineSchema } from "@/types"

interface LineFormProps {
  line?: Line | null
  onSuccess: () => void
  onCancel: () => void
}

export function LineForm({ line, onSuccess, onCancel }: LineFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Line>({
    resolver: zodResolver(lineSchema),
    defaultValues: line || {
      lineNumber: "",
      name: "",
      description: "",
      status: "active",
      frequency: 0,
    },
  })

  useEffect(() => {
    if (line) {
      reset(line)
    } else {
      reset({
        lineNumber: "",
        name: "",
        description: "",
        status: "active",
        frequency: 0,
      })
    }
  }, [line, reset])

  const onSubmit = async (data: Line) => {
    try {
      const payload = {
        ...data,
        frequency: Number(data.frequency),
      }

      if (line?._id) {
        // Update existing line
        await fetch(`/api/lines/${line._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        // Create new line
        await fetch("/api/lines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save line:", error)
      alert("Failed to save line. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div>
        <Label htmlFor="lineNumber">Numéro de Ligne</Label>
        <Input id="lineNumber" {...register("lineNumber")} />
        {errors.lineNumber && <p className="text-red-500 text-sm">{errors.lineNumber.message}</p>}
      </div>
      <div>
        <Label htmlFor="name">Nom de la Ligne</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="status">Statut</Label>
        <Select
          onValueChange={(value) => setValue("status", value as "active" | "inactive")}
          value={line?.status || "active"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>
      <div>
        <Label htmlFor="frequency">Fréquence (minutes)</Label>
        <Input id="frequency" type="number" {...register("frequency", { valueAsNumber: true })} />
        {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  )
}
