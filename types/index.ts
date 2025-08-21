import { z } from "zod"

export type Bus = {
  _id: string
  busId: string
  capacity: number
  status: "active" | "inactive" | "maintenance"
  lineId: Line,
  currentLine?: string
  driverName?: string
  lastMaintenance?: Date
  __v?: number
}

export type Line = {
  _id: string
  lineId: string
  name: string
  status: "active" | "inactive" | "maintenance" | "disrupted"
  shortName: string
  color: string // Hex color code
  type: "bus" | "tram" | "metro"
  company: string
  __v?: number
}

export type Stop = {
  createdAt: string | number | Date
  _id: string
  name: string
  latitude?: number
  longitude?: number
  address: string
  status: "active" | "inactive"
  
  arrivalTime?: string // HH:MM format
  departureTime?: string // HH:MM format
  order?: number // Order in the route
  __v?: number
}

export type Prediction = {
  _id: string
  busId: string
  lineId: string
  stopId: string
  predictedArrivalTime: Date
  actualArrivalTime?: Date
  delayMinutes?: number
  accuracyScore?: number
  __v?: number
}

export type Alert = {
  _id: string
  type: "delay" | "diversion" | "cancellation" | "other"
  message: string
  lineId?: string
  busId?: string
  stopId?: string
  severity: "low" | "medium" | "high"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  __v?: number
}

export type User = {
  _id: string
  username: string
  email: string
  role: "admin" | "user"
  createdAt: Date
  __v?: number
}

export type StatisticsOverview = {
  averagePunctuality: any
  totalBuses: number
  activeBuses: number
  totalLines: number
  activeLines: number
  totalAlerts: number
  activeAlerts: number
  averageDelay: number
  predictionAccuracy: number
}

export type LinePerformance = {
  color: string | undefined
  name: string | number | undefined
  lineId: string
  lineNumber: string
  averageDelay: number
  onTimePercentage: number
  totalTrips: number
}

export type DelayDistribution = {
  delayRange: string // e.g., "0-5 min", "5-10 min"
  count: number
}

export type OccupancyTrend = {
  timestamp: string // e.g., "HH:00"
  averageOccupancy: number
}

export type PredictionAccuracy = {
  averageAccuracy: number
  date: string // YYYY-MM-DD
  accuracy: number
}

export type PredictiveAlert = {
  _id: string
  type: "predictive_delay" | "predictive_cancellation"
  message: string
  lineId: string
  busId: string
  predictedDelayMinutes: number
  timestamp: Date
}

// Zod Schemas for validation
export const busSchema = z.object({
  busId: z.string().min(1, "Le numéro de bus est requis."),
  capacity: z.coerce.number().min(1, "La capacité doit être au moins de 1."),
  status: z.enum(["active", "inactive", "maintenance"], {
    required_error: "Le statut est requis.",
  }),
  lineId: z.string().min(1, "La ligne est requise."),
  driverName: z.string().optional().nullable(),
  lastMaintenance: z.string().optional().nullable(), // Keep as string for form, convert to Date later
})

export const lineSchema =z.object({
  lineId: z.string().min(1, "L'ID de la ligne est requis"),
  name: z.string().min(1, "Le nom est requis"),
  shortName: z.string().min(1, "Le nom court est requis"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Couleur invalide").optional(),
  type: z.enum(["bus", "tram", "metro"]).optional(),
  status: z.enum(["active", "inactive", "maintenance", "disrupted"]).optional(),
  company: z.string().min(1, "La compagnie est requise"),
})

export const stopSchema = z.object({
  name: z.string().min(1, "Le nom de l'arrêt est requis."),
  latitude: z.coerce.number().min(-90, "Latitude invalide").max(90, "Latitude invalide"),
  longitude: z.coerce.number().min(-180, "Longitude invalide").max(180, "Longitude invalide"),
  arrivalTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format HH:MM requis")
    .optional()
    .nullable(),
  departureTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format HH:MM requis")
    .optional()
    .nullable(),
  order: z.coerce.number().min(0, "L'ordre doit être positif").optional().nullable(),
})

export const alertSchema = z.object({
  type: z.enum(["delay", "diversion", "cancellation", "other"], {
    required_error: "Le type d'alerte est requis.",
  }),
  message: z.string().min(1, "Le message est requis."),
  lineId: z.string().optional().nullable(),
  busId: z.string().optional().nullable(),
  stopId: z.string().optional().nullable(),
  severity: z.enum(["low", "medium", "high"], {
    required_error: "La sévérité est requise.",
  }),
  isActive: z.boolean().default(true),
})

export const predictionSchema = z.object({
  busId: z.string().min(1, "L'ID du bus est requis."),
  lineId: z.string().min(1, "L'ID de la ligne est requis."),
  stopId: z.string().min(1, "L'ID de l'arrêt est requis."),
  predictedArrivalTime: z.string().min(1, "L'heure d'arrivée prédite est requise."), // ISO string
  actualArrivalTime: z.string().optional().nullable(), // ISO string
  delayMinutes: z.coerce.number().optional().nullable(),
  accuracyScore: z.coerce.number().optional().nullable(),
})
