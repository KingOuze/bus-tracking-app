"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { stopSchema, type Stop } from "@/types"
import type { z } from "zod"

type StopFormValues = z.infer<typeof stopSchema>

interface StopFormProps {
  stop?: Stop | null
  onSuccess: () => void
  onCancel: () => void
}

export function StopForm({ stop, onSuccess, onCancel }: StopFormProps) {
  const { toast } = useToast()
  const form = useForm<StopFormValues>({
    resolver: zodResolver(stopSchema),
    defaultValues: {
      name: stop?.name || "",
      latitude: stop?.latitude || 0,
      longitude: stop?.longitude || 0,
      arrivalTime: stop?.arrivalTime || "",
      departureTime: stop?.departureTime || "",
      order: stop?.order || 0,
    },
  })

  useEffect(() => {
    if (stop) {
      form.reset({
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
        arrivalTime: stop.arrivalTime || "",
        departureTime: stop.departureTime || "",
        order: stop.order || 0,
      })
    } else {
      form.reset({
        name: "",
        latitude: 0,
        longitude: 0,
        arrivalTime: "",
        departureTime: "",
        order: 0,
      })
    }
  }, [stop, form])

  const onSubmit = async (values: StopFormValues) => {
    try {
      // No direct API call here, success is handled by parent component
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'opération.",
        variant: "destructive",
      })
      console.error("Stop form submission error:", error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Label htmlFor="name">Nom de l'arrêt</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="latitude">Latitude</Label>
        <Input id="latitude" type="number" step="any" {...form.register("latitude", { valueAsNumber: true })} />
        {form.formState.errors.latitude && (
          <p className="text-red-500 text-sm">{form.formState.errors.latitude.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="longitude">Longitude</Label>
        <Input id="longitude" type="number" step="any" {...form.register("longitude", { valueAsNumber: true })} />
        {form.formState.errors.longitude && (
          <p className="text-red-500 text-sm">{form.formState.errors.longitude.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="arrivalTime">Heure d'arrivée (HH:MM)</Label>
        <Input id="arrivalTime" {...form.register("arrivalTime")} placeholder="Ex: 14:30" />
        {form.formState.errors.arrivalTime && (
          <p className="text-red-500 text-sm">{form.formState.errors.arrivalTime.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="departureTime">Heure de départ (HH:MM)</Label>
        <Input id="departureTime" {...form.register("departureTime")} placeholder="Ex: 14:35" />
        {form.formState.errors.departureTime && (
          <p className="text-red-500 text-sm">{form.formState.errors.departureTime.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="order">Ordre dans l'itinéraire</Label>
        <Input id="order" type="number" {...form.register("order", { valueAsNumber: true })} />
        {form.formState.errors.order && <p className="text-red-500 text-sm">{form.formState.errors.order.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {stop ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}
