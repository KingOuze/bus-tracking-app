"use client"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Bus, busSchema } from "@/types"
import { z } from "zod"

interface BusFormProps {
  bus?: Bus | null,
  lines: Array<{ _id: string; name: string }>
  onSuccess: () => void
  onCancel: () => void,
}


export function BusForm(
  { bus, lines, onSuccess, onCancel }: BusFormProps 
) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    control 
  } = useForm<z.infer<typeof busSchema>>({
    resolver: zodResolver(busSchema),
    defaultValues: bus
      ? {
          ...bus,
          lineId: typeof bus.lineId === "object" && bus.lineId !== null ? bus.lineId._id : bus.lineId,
          lastMaintenance: bus.lastMaintenance
            ? bus.lastMaintenance.toISOString().split("T")[0]
            : "",
        }
      : {
          busId: "",
          capacity: 0,
          status: "active",
          lineId: "",
      driverName: "",
      lastMaintenance: undefined,
    },
  })

  useEffect(() => {
    if (bus) {
      reset({
        ...bus,
        lineId: bus.lineId._id ,
        lastMaintenance: bus.lastMaintenance
          ? bus.lastMaintenance.toISOString().split("T")[0]
          : "",
      })
    } else {
      reset({
        busId: "",
        capacity: 0,
        status: "active",
        lineId: "",
        driverName: "",
        lastMaintenance: undefined,
      })
    }
  }, [bus, reset])
  

  

  const onSubmit = async (data: z.infer<typeof busSchema>) => {
    try {
      const payload = {
        ...data,
        capacity: Number(data.capacity),
        lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : undefined,
      }

      if (bus?._id) {
        // Update existing bus
        console.log(payload)
        await fetch(`${API_URL}/buses/${bus._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        // Create new bus
        await fetch(`${API_URL}/buses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save bus:", error)
      alert("Failed to save bus. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div>
        <Label htmlFor="busId">Numéro de Bus</Label>
        <Input id="busId" {...register("busId")} />
        {errors.busId && <p className="text-red-500 text-sm">{errors.busId.message}</p>}
      </div>
      <div>
        <Label htmlFor="capacity">Capacité</Label>
        <Input id="capacity" type="number" {...register("capacity", { valueAsNumber: true })} />
        {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
      </div>
      <div>
        <Label htmlFor="status">Statut</Label>
        <Select
          onValueChange={(value) => setValue("status", value as "active" | "inactive" | "maintenance")}
          value={bus?.status || "active"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>
      <div>
        <Label htmlFor="lineId">Ligne Actuelle</Label>
        <Controller
          name="lineId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value || ""} // ceci va afficher la ligne du bus si présente
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une ligne" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(lines) && lines.length > 0 ? (
                  lines.map((line) => (
                    <SelectItem key={line._id} value={line._id}>
                      {line.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Aucune ligne disponible</div>
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.lineId && (
          <p className="text-red-500 text-sm">
            {errors.lineId.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="driverName">Nom du Conducteur</Label>
        <Input id="driverName" {...register("driverName")} />
        {errors.driverName && <p className="text-red-500 text-sm">{errors.driverName.message}</p>}
      </div>
      <div>
        <Label htmlFor="lastMaintenance">Dernière Maintenance</Label>
        <Input id="lastMaintenance" type="date" {...register("lastMaintenance")} />
        {errors.lastMaintenance && <p className="text-red-500 text-sm">{errors.lastMaintenance.message}</p>}
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
