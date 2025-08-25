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
export const fetchPredictionAccuracy = async (): Promise<{ accuracy: PredictionAccuracy[] }> =>
  fetcher("/statistics/prediction-accuracy")
export const fetchPredictiveAlerts = async (): Promise<{ alerts: PredictiveAlert[] }> =>
  fetcher("/statistics/predictive-alerts")

/* =============================
   🔑 Auth API
============================= */
export const loginUser = async (
  credentials: any,
): Promise<{ token: string; user: { id: string; username: string; role: string } }> =>
  fetcher("/auth/login", { method: "POST", data: credentials })

export const registerUser = async (userData: any): Promise<{ message: string }> =>
  fetcher("/auth/register", { method: "POST", data: userData })
