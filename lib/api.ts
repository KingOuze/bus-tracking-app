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

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, options)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Erreur inconnue" }))
    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
  }
  return response.json()
}

// Bus API calls
export const fetchBuses = async (p0: { limit: number; lat: number; lng: number; radius: number }): Promise<{ buses: Bus[] }> => fetcher("/buses")
export const fetchBusById = async (id: string): Promise<{ bus: Bus }> => fetcher(`/buses/${id}`)
export const createBus = async (busData: Omit<Bus, "_id" | "__v">): Promise<{ bus: Bus }> =>
  fetcher("/buses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(busData),
  })
export const updateBus = async (id: string, busData: Partial<Bus>): Promise<{ bus: Bus }> =>
  fetcher(`/buses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(busData),
  })
export const deleteBus = async (id: string): Promise<{ message: string }> =>
  fetcher(`/buses/${id}`, { method: "DELETE" })

// Line API calls
export const fetchLines = async (): Promise<{ lines: Line[] }> => fetcher("/lines")
export const fetchLineById = async (id: string): Promise<{ line: Line }> => fetcher(`/lines/${id}`)
export const createLine = async (lineData: Omit<Line, "_id" | "__v" | "stops">): Promise<{ line: Line }> =>
  fetcher("/lines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lineData),
  })
export const updateLine = async (id: string, lineData: Partial<Omit<Line, "stops">>): Promise<{ line: Line }> =>
  fetcher(`/lines/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lineData),
  })
export const deleteLine = async (id: string): Promise<{ message: string }> =>
  fetcher(`/lines/${id}`, { method: "DELETE" })

// Stop API calls for a specific line
export const fetchStopsByLine = async (lineId: string): Promise<{ stops: { go: Stop[]; return: Stop[] } }> =>
  fetcher(`/lines/${lineId}/stops`)
export const createStopForLine = async (
  lineId: string,
  stopData: Omit<Stop, "_id" | "__v">,
  direction: "go" | "return",
): Promise<{ stop: Stop }> =>
  fetcher(`/lines/${lineId}/stops?direction=${direction}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stopData),
  })
export const updateStopForLine = async (
  lineId: string,
  stopId: string,
  stopData: Partial<Stop>,
  direction: "go" | "return",
): Promise<{ stop: Stop }> =>
  fetcher(`/lines/${lineId}/stops/${stopId}?direction=${direction}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stopData),
  })
export const deleteStopForLine = async (
  lineId: string,
  stopId: string,
  direction: "go" | "return",
): Promise<{ message: string }> =>
  fetcher(`/lines/${lineId}/stops/${stopId}?direction=${direction}`, { method: "DELETE" })

// Alert API calls
export const fetchAlerts = async (p0: { limit: number; status: string }): Promise<{ alerts: Alert[] }> => fetcher("/alerts")
export const fetchAlertById = async (id: string): Promise<{ alert: Alert }> => fetcher(`/alerts/${id}`)
export const createAlert = async (
  alertData: Omit<Alert, "_id" | "__v" | "createdAt" | "updatedAt">,
): Promise<{ alert: Alert }> =>
  fetcher("/alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alertData),
  })
export const updateAlert = async (id: string, alertData: Partial<Alert>): Promise<{ alert: Alert }> =>
  fetcher(`/alerts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alertData),
  })
export const deleteAlert = async (id: string): Promise<{ message: string }> =>
  fetcher(`/alerts/${id}`, { method: "DELETE" })

// Prediction API calls
export const fetchPredictions = async (): Promise<{ predictions: Prediction[] }> => fetcher("/predictions")
export const fetchPredictionById = async (id: string): Promise<{ prediction: Prediction }> =>
  fetcher(`/predictions/${id}`)
export const createPrediction = async (
  predictionData: Omit<Prediction, "_id" | "__v">,
): Promise<{ prediction: Prediction }> =>
  fetcher("/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(predictionData),
  })
export const updatePrediction = async (
  id: string,
  predictionData: Partial<Prediction>,
): Promise<{ prediction: Prediction }> =>
  fetcher(`/predictions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(predictionData),
  })
export const deletePrediction = async (id: string): Promise<{ message: string }> =>
  fetcher(`/predictions/${id}`, { method: "DELETE" })

// Statistics API calls
export const fetchStatisticsOverview = async (): Promise<{ overview: StatisticsOverview }> =>
  fetcher("/statistics/overview")
export const fetchLinePerformance = async (): Promise<{
  performance: LinePerformance[] 
}> =>
  fetcher("/statistics/line-performance")
export const fetchDelayDistribution = async (): Promise<{
  distribution: DelayDistribution[] 
}> =>
  fetcher("/statistics/delay-distribution")
export const fetchOccupancyTrends = async (p0: { period: string }): Promise<{
  occupancyTrends(occupancyTrends: any): unknown
  trends: OccupancyTrend[] 
}> =>
  fetcher("/statistics/occupancy-trends")
export const fetchPredictionAccuracy = async (): Promise<{ accuracy: PredictionAccuracy[] }> =>
  fetcher("/statistics/prediction-accuracy")
export const fetchPredictiveAlerts = async (): Promise<{ alerts: PredictiveAlert[] }> =>
  fetcher("/statistics/predictive-alerts")

// Auth API calls (example, adjust as per your backend)
export const loginUser = async (
  credentials: any,
): Promise<{ token: string; user: { id: string; username: string; role: string } }> =>
  fetcher("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })

export const registerUser = async (userData: any): Promise<{ message: string }> =>
  fetcher("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
