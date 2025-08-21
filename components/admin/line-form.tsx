"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Line, lineSchema } from "@/types"
import { createLine, updateLine } from "@/lib/api"

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<Line>({
    resolver: zodResolver(lineSchema),
    defaultValues: line || {
      lineId: "",
      name: "",
      shortName: "",
      color: "#000000", // Default color
      status: "active",
      type: "bus", // Default type
      company: "", // Assuming company is required
    },
  })

  useEffect(() => {
    if (line) {
      reset(line)
    } else {
      reset({
        lineId: "",
        name: "",
        status: "active",
      })
    }
  }, [line, reset])

  const onSubmit = async (data: Line) => {
    try {
      
      console.log("Submitting line data:", data)

      if (line?._id) {
        console.log("Updating existing line with ID:", line._id)  
        // Update existing line
        await updateLine(line._id, data)
      } else {
        // Create new line
        await createLine(data)
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save line:", error)
      alert("Failed to save line. Please try again.")
    }
  }

   return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="grid gap-4 p-6 bg-white rounded-2xl shadow-md max-w-2xl mx-auto w-full"
    >
      {/* ID de ligne */}
      <div>
        <Label htmlFor="lineId">ID de la Ligne</Label>
        <Input id="lineId" {...register("lineId")} placeholder="ex: L01" />
        {errors.lineId && <p className="text-red-500 text-sm">{errors.lineId.message}</p>}
      </div>

      {/* Nom */}
      <div>
        <Label htmlFor="name">Nom de la Ligne</Label>
        <Input id="name" {...register("name")} placeholder="ex: Ligne 1 Dakar" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Nom court */}
      <div>
        <Label htmlFor="shortName">Nom court</Label>
        <Input id="shortName" {...register("shortName")} placeholder="ex: L1" />
        {errors.shortName && <p className="text-red-500 text-sm">{errors.shortName.message}</p>}
      </div>

      {/* Couleur */}
      <div>
        <Label htmlFor="color">Couleur</Label>
        <Input id="color" type="color" {...register("color")} />
        {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
      </div>

      {/* Type */}
      <div>
        <Label>Type</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="tram">Tram</SelectItem>
                <SelectItem value="metro">Métro</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      {/* Statut */}
      <div>
        <Label>Statut</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="maintenance">En maintenance</SelectItem>
                <SelectItem value="disrupted">Perturbé</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>

      {/* Bou\tons */}
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
