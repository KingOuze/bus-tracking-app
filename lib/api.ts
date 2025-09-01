import axios from "axios"
import type {
  Bus,
  Line,
  Alert,
  Prediction,
  StatisticsOverview,
  LinePerformance,
  DelayDistribution,
  OccupancyTrend,
  PredictionAccuracy,
  PredictiveAlert,
  Stop,
} from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Création d'une instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Helper générique
async function fetcher<T>(url: string, options?: any): Promise<T> {
  try {
    const response = await api({ url, ...options })
    return response.data as T
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || `Erreur HTTP: ${error.response.status}`)
    }
    throw new Error(error.message || "Erreur inconnue")
  }
}

/* =============================
   🚍  Bus API
============================= */
export const fetchBuses = async (): Promise<{ buses: Bus[] }> => fetcher("/buses")
export const fetchBusById = async (id: string): Promise<{ bus: Bus }> => fetcher(`/buses/${id}`)
export const createBus = async (busData: Omit<Bus, "_id" | "__v">): Promise<{ bus: Bus }> =>
  fetcher("/buses", { method: "POST", data: busData })
export const updateBus = async (id: string, busData: Partial<Bus>): Promise<{ bus: Bus }> =>
  fetcher(`/buses/${id}`, { method: "PUT", data: busData })
export const deleteBus = async (id: string): Promise<{ message: string }> =>
  fetcher(`/buses/${id}`, { method: "DELETE" })

/* =============================
   🚏  Line API
============================= */
export const fetchLines = async (): Promise<{ lines: Line[] }> => fetcher("/lines")
export const fetchLineById = async (id: string): Promise<{ line: Line }> => fetcher(`/lines/${id}`)
export const createLine = async (lineData: Omit<Line, "_id" | "__v" | "stops">): Promise<{ line: Line }> =>
  fetcher("/lines", { method: "POST", data: lineData })
export const updateLine = async (id: string, lineData: Partial<Omit<Line, "stops">>): Promise<{ line: Line }> =>
  fetcher(`/lines/${id}`, { method: "PUT", data: lineData })
export const deleteLine = async (id: string): Promise<{ message: string }> =>
  fetcher(`/lines/${id}`, { method: "DELETE" })

/* =============================
   🛑  Stops API
============================= */
export const fetchStopsByLine = async (lineId: string): Promise<{ stops: { go: Stop[]; return: Stop[] } }> =>
  fetcher(`/lines/${lineId}/stops`)

export const fetchStopById = async (lineId: string, stopId: string): Promise<{ stop: Stop }> =>
  fetcher(`/lines/${lineId}/stops/${stopId}`)

export const createStop = async (stopData: Omit<Stop, "_id" | "__v">): Promise<{ stop: Stop }> =>
  fetcher("/stops", { method: "POST", data: stopData })

export const updateStop = async (id: string, stopData: Partial<Stop>): Promise<{ stop: Stop }> =>
  fetcher(`/stops/${id}`, { method: "PUT", data: stopData })

export const deleteStop = async (id: string): Promise<{ message: string }> =>
  fetcher(`/stops/${id}`, { method: "DELETE" })

export const createStopForLine = async (
  data: any,
  direction: "go" | "return",
): Promise<{ stop: Stop }> =>
  fetcher(`/lines/stops?direction=${direction}`, {
    method: "POST",
    data: data,
  })

export const fetchAllStops = async (): Promise<{ stops: Stop[] }> => fetcher("/stops")

export const deleteStopForLine = async (
  data: any, 
  direction: "go" | "return",
): Promise<{ message: string }> =>
  fetcher(`/lines/${data.lineId}/stops/${data.stopId}?direction=${direction}`, { 
      method: "DELETE",
      data: data 
    })

/* =============================
   ⚠️ Alerts API
============================= */
export const fetchAlerts = async (): Promise<{ alerts: Alert[] }> => fetcher("/alerts")
export const fetchAlertById = async (id: string): Promise<{ alert: Alert }> => fetcher(`/alerts/${id}`)
export const createAlert = async (
  alertData: Omit<Alert, "_id" | "__v" | "createdAt" | "updatedAt">,
): Promise<{ alert: Alert }> => fetcher("/alerts", { method: "POST", data: alertData })
export const updateAlert = async (id: string, alertData: Partial<Alert>): Promise<{ alert: Alert }> =>
  fetcher(`/alerts/${id}`, { method: "PUT", data: alertData })
export const deleteAlert = async (id: string): Promise<{ message: string }> =>
  fetcher(`/alerts/${id}`, { method: "DELETE" })

/* =============================
   📊 Statistics API
============================= */
export const fetchStatisticsOverview = async (): Promise<{ overview: StatisticsOverview }> =>
  fetcher("/statistics/overview")
export const fetchLinePerformance = async (): Promise<{ performance: LinePerformance[] }> =>
  fetcher("/statistics/line-performance")
export const fetchDelayDistribution = async (): Promise<{ distribution: DelayDistribution[] }> =>
  fetcher("/statistics/delay-distribution")
export const fetchOccupancyTrends = async (): Promise<{ trends: OccupancyTrend[] }> =>
  fetcher("/statistics/occupancy-trends")

/* =============================
   🔑 Auth API
============================= */
export const loginUser = async (
  credentials: any,
): Promise<{ token: string; user: { id: string; username: string; role: string } }> =>
  fetcher("/auth/login", { method: "POST", data: credentials })

export const registerUser = async (userData: any): Promise<{ message: string }> =>
  fetcher("/auth/register", { method: "POST", data: userData })


/* =============================
   Predictions API
============================= */


// Fonction pour récupérer les prédictions
export async function fetchPredictions(
  params: {
    busId?: string
    lineId?: string
    algorithm?: string
    type?: string
    horizon?: string
    limit?: number
  } = {},
): Promise<{
  predictions: Record<string, Prediction[]>
  count: number
  algorithm: string
  generatedAt: string
}> {
  try {
    const searchParams = new URLSearchParams()

    if (params.busId) searchParams.append("busId", params.busId)
    if (params.lineId) searchParams.append("lineId", params.lineId)
    if (params.algorithm) searchParams.append("algorithm", params.algorithm)
    if (params.type) searchParams.append("type", params.type)
    if (params.horizon) searchParams.append("horizon", params.horizon)
    if (params.limit) searchParams.append("limit", params.limit.toString())

    const response = await fetch(`${API_URL}/predictions?${searchParams}`)

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Grouper les prédictions par type
    const groupedPredictions = data.predictions.reduce((acc: Record<string, Prediction[]>, pred: Prediction) => {
      if (!acc[pred.predictionType]) {
        acc[pred.predictionType] = []
      }
      acc[pred.predictionType].push(pred)
      return acc
    }, {})

    return {
      predictions: groupedPredictions,
      count: data.count,
      algorithm: data.algorithm,
      generatedAt: data.generatedAt,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des prédictions:", error)
    throw error
  }
}

// Fonction pour récupérer les prédictions d'un bus spécifique
export async function fetchBusPredictions(
  busId: string,
  algorithm = "ensemble",
): Promise<{
  busId: string
  algorithm: string
  predictions: Record<string, Prediction[]>
  totalPredictions: number
}> {
  try {
    const response = await fetch(`${API_URL}/predictions/bus/${busId}?algorithm=${algorithm}`)

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des prédictions du bus:", error)
    throw error
  }
}

// Fonction pour récupérer les alertes prédictives
export async function fetchPredictiveAlerts(
  params: {
    severity?: string
    line?: string
  } = {},
): Promise<{
  alerts: PredictiveAlert[]
  count: number
  generatedAt: string
}> {
  try {
    const searchParams = new URLSearchParams()

    if (params.severity) searchParams.append("severity", params.severity)
    if (params.line) searchParams.append("line", params.line)

    const response = await fetch(`${API_URL}/predictions/alerts?${searchParams}`)

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des alertes prédictives:", error)
    throw error
  }
}

// Fonction pour récupérer les statistiques de performance
export async function fetchPredictionAccuracy(): Promise<{
  predictionAccuracy: PredictionAccuracy[]
  lastUpdated: string
}> {
  try {
    const response = await fetch(`${API_URL}/predictions/performance`)

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Convertir les statistiques en format attendu par le composant
    const predictionAccuracy = Object.entries(data.performance).map(([algorithm, stats]: [string, any]) => ({
      algorithm,
      averageAccuracy: stats.averageAccuracy || 0,
      averageConfidence: stats.averageConfidence || 0,
      count: stats.count || 0,
    }))

    return {
      predictionAccuracy,
      lastUpdated: data.lastUpdated,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    throw error
  }
}

// Fonction pour générer de nouvelles prédictions (nécessite authentification)
export async function generatePredictions(token: string): Promise<{
  message: string
  timestamp: string
}> {
  try {
    const response = await fetch(`${API_URL}/predictions/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la génération des prédictions:", error)
    throw error
  }
}