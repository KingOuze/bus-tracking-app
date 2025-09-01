"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, CheckCircle, XCircle, Wrench, Zap, Clock, Users, MapPin, RefreshCw } from "lucide-react"

// Types basés sur le modèle API Mongoose
interface Alert {
  _id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success" | "maintenance" | "disruption"
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "resolved" | "scheduled" | "cancelled"
  category: "delay" | "cancellation" | "route_change" | "technical" | "weather" | "traffic" | "event"
  priority: number
  startTime: string
  endTime?: string
  impact: {
    delayMinutes?: number
    affectedPassengers?: number
    alternativeRoutes?: string[]
  }
  location?: {
    latitude: number
    longitude: number
    radius: number
    address?: string
  }
  affectedLines: string[]
  affectedStops: string[]
  affectedBuses?: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

const mockAlerts: Alert[] = [
  {
    _id: "1",
    title: "Retard Ligne 12",
    message: "Retard de 15 minutes sur la ligne 12 en direction de Châtelet en raison d'un incident technique.",
    type: "warning",
    severity: "medium",
    status: "active",
    category: "delay",
    priority: 2,
    startTime: "2024-01-15T08:30:00Z",
    endTime: "2024-01-15T09:30:00Z",
    impact: {
      delayMinutes: 15,
      affectedPassengers: 250,
      alternativeRoutes: ["Ligne 14", "RER A"],
    },
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      radius: 500,
      address: "Station République",
    },
    affectedLines: ["12"],
    affectedStops: ["République", "Châtelet", "Solférino"],
    affectedBuses: ["BUS-12-001", "BUS-12-003"],
    isPublic: true,
    createdAt: "2024-01-15T08:25:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
  },
  {
    _id: "2",
    title: "Maintenance Ligne 8",
    message: "Travaux de maintenance programmés sur la ligne 8. Service interrompu entre 22h et 6h.",
    type: "maintenance",
    severity: "high",
    status: "scheduled",
    category: "technical",
    priority: 1,
    startTime: "2024-01-15T22:00:00Z",
    endTime: "2024-01-16T06:00:00Z",
    impact: {
      affectedPassengers: 500,
      alternativeRoutes: ["Ligne 9", "Ligne 1"],
    },
    affectedLines: ["8"],
    affectedStops: ["Invalides", "École Militaire", "La Motte-Picquet"],
    isPublic: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    _id: "3",
    title: "Service Normal",
    message: "Tous les services fonctionnent normalement sur le réseau.",
    type: "success",
    severity: "low",
    status: "active",
    category: "event",
    priority: 3,
    startTime: "2024-01-15T06:00:00Z",
    impact: {},
    affectedLines: [],
    affectedStops: [],
    isPublic: true,
    createdAt: "2024-01-15T06:00:00Z",
    updatedAt: "2024-01-15T06:00:00Z",
  },
]

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "error":
    case "disruption":
      return <XCircle className="h-5 w-5" />
    case "warning":
      return <AlertTriangle className="h-5 w-5" />
    case "success":
      return <CheckCircle className="h-5 w-5" />
    case "maintenance":
      return <Wrench className="h-5 w-5" />
    case "info":
    default:
      return <Info className="h-5 w-5" />
  }
}

const getAlertColor = (type: Alert["type"], severity: Alert["severity"]) => {
  if (severity === "critical") return "destructive"

  switch (type) {
    case "error":
    case "disruption":
      return "destructive"
    case "warning":
      return "secondary"
    case "success":
      return "default"
    case "maintenance":
      return "outline"
    case "info":
    default:
      return "secondary"
  }
}

const getSeverityColor = (severity: Alert["severity"]) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
    default:
      return "bg-green-100 text-green-800 border-green-200"
  }
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  

  const refreshAlerts = () => {
    setLastUpdate(new Date())
    // Ici vous pourrez ajouter l'appel à votre API
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active")
  const scheduledAlerts = alerts.filter((alert) => alert.status === "scheduled")

  /*if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des lignes...</p>
        </div>
      </div>
    )
  }*/

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alertes Transport</h1>
          <p className="text-gray-600">Suivi en temps réel des perturbations et informations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-600">{isConnected ? "Connecté" : "Déconnecté"}</span>
          </div>
          <Button onClick={refreshAlerts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Alertes Actives</p>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Programmées</p>
                <p className="text-2xl font-bold">{scheduledAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Passagers Impactés</p>
                <p className="text-2xl font-bold">
                  {alerts.reduce((sum, alert) => sum + (alert.impact.affectedPassengers || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Dernière MAJ</p>
                <p className="text-sm font-medium">{formatTime(lastUpdate.toISOString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert._id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      alert.type === "error" || alert.type === "disruption"
                        ? "bg-red-100 text-red-600"
                        : alert.type === "warning"
                          ? "bg-orange-100 text-orange-600"
                          : alert.type === "success"
                            ? "bg-green-100 text-green-600"
                            : alert.type === "maintenance"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getAlertColor(alert.type, alert.severity)}>
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </Badge>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                      <Badge variant="outline">{alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{formatTime(alert.startTime)}</p>
                  {alert.endTime && <p>→ {formatTime(alert.endTime)}</p>}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-gray-700 mb-4">{alert.message}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {alert.affectedLines.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Lignes affectées</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.affectedLines.map((line) => (
                        <Badge key={line} variant="secondary" className="text-xs">
                          Ligne {line}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {alert.affectedStops.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Arrêts affectés</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.affectedStops.slice(0, 3).map((stop) => (
                        <Badge key={stop} variant="outline" className="text-xs">
                          {stop}
                        </Badge>
                      ))}
                      {alert.affectedStops.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{alert.affectedStops.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {alert.impact.delayMinutes && (
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Impact</p>
                    <div className="space-y-1">
                      <p className="text-gray-600">Retard: {alert.impact.delayMinutes} min</p>
                      {alert.impact.affectedPassengers && (
                        <p className="text-gray-600">{alert.impact.affectedPassengers} passagers</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {alert.impact.alternativeRoutes && alert.impact.alternativeRoutes.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900 mb-2">Itinéraires alternatifs</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.impact.alternativeRoutes.map((route) => (
                      <Badge key={route} className="bg-blue-100 text-blue-800">
                        {route}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
