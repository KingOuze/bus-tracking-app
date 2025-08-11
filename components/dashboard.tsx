"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Bus,
  Clock,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Users,
  Route,
  Activity,
  ArrowRight,
  CheckCircle,
  Info,
} from "lucide-react"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  fetchStatisticsOverview,
  fetchLinePerformance,
  fetchDelayDistribution,
  fetchOccupancyTrends,
  fetchAlerts,
  fetchBuses,
} from "@/lib/api"
import type { DelayDistribution, LinePerformance } from "@/types"

export default function Dashboard() {
  const [overviewStats, setOverviewStats] = useState<any>(null)
  const [linePerformanceData, setLinePerformanceData] = useState<LinePerformance[]>([])
  const [delayDistributionData, setDelayDistributionData] = useState<DelayDistribution[]>([])
  const [occupancyTrendsData, setOccupancyTrendsData] = useState<any[]>([])
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [upcomingBuses, setUpcomingBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        const [overview, linePerf, delayDist, occupancyTrends, alertsRes, busesRes] = await Promise.all([
          fetchStatisticsOverview(),
          fetchLinePerformance(),
          fetchDelayDistribution(),
          fetchOccupancyTrends({ period: "hour" }),
          fetchAlerts({ limit: 3, status: "active" }),
          fetchBuses({
            limit: 10,
            lat: 0,
            lng: 0,
            radius: 0
          }),
        ])

        setOverviewStats(overview)
        setLinePerformanceData(linePerf.performance)
        setDelayDistributionData(delayDist.distribution)
        setOccupancyTrendsData(occupancyTrends.trends)
        setRecentAlerts(alertsRes.alerts)
        setUpcomingBuses(busesRes.buses)
        console.log(busesRes)
        console.log(overview)
        console.log(linePerf.performance)
        console.log(delayDist.distribution)
        console.log(occupancyTrends.occupancyTrends)
        console.log(alertsRes.alerts)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Une erreur est survenue")
        }
        console.error("Failed to load dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement du tableau de bord...</div>
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">Erreur lors du chargement: {error}</div>
    )

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
      case "disruption":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  // Préparation des données pour les graphiques Recharts
  const performanceData = [
    { time: "06:00", onTime: 95, delayed: 5, total: 100 }, // Exemple statique, à remplacer par des données réelles si l'API le permet
    { time: "07:00", onTime: 88, delayed: 12, total: 100 },
    { time: "08:00", onTime: 82, delayed: 18, total: 100 },
    { time: "09:00", onTime: 90, delayed: 10, total: 100 },
    { time: "10:00", onTime: 94, delayed: 6, total: 100 },
    { time: "11:00", onTime: 96, delayed: 4, total: 100 },
    { time: "12:00", onTime: 89, delayed: 11, total: 100 },
    { time: "13:00", onTime: 85, delayed: 15, total: 100 },
    { time: "14:00", onTime: 91, delayed: 9, total: 100 },
    { time: "15:00", onTime: 87, delayed: 13, total: 100 },
  ]

  const lineComparisonData = linePerformanceData.map((line: any) => ({
    line: line.lineId,
    onTime: line.onTimeBuses > 0 ? (line.onTimeBuses / line.totalBuses) * 100 : 0,
    delayed: line.delayedBuses > 0 ? (line.delayedBuses / line.totalBuses) * 100 : 0,
    disrupted: 0, // L'API ne fournit pas directement les bus "disrupted"
  }))

  const delayDistributionChartData = delayDistributionData.map((item: any) => ({
    name: item.category === "onTime" ? "À l'heure" : item.category,
    value: item.percentage,
    color:
      item.category === "onTime"
        ? "#10b981"
        : item.category === "1-5min"
          ? "#f59e0b"
          : item.category === "5-10min"
            ? "#ef4444"
            : "#dc2626",
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'overview du réseau de transport en temps réel</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Système opérationnel
          </Badge>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bus en service</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900">{overviewStats?.activeBuses}</p>
                  <Badge variant="default" className="text-xs">
                    +{overviewStats?.totalBuses - overviewStats?.activeBuses}
                  </Badge>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-blue-100`}>
                <Bus className={`w-6 h-6 text-blue-600`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À l'heure</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900">{overviewStats?.onTimeBuses}</p>
                  <Badge variant="default" className="text-xs">
                    {overviewStats?.onTimePerformance}%
                  </Badge>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-green-100`}>
                <CheckCircle className={`w-6 h-6 text-green-600`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900">{overviewStats?.delayedBuses}</p>
                  <Badge variant="default" className="text-xs">
                    {((overviewStats?.delayedBuses / overviewStats?.totalBuses) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-orange-100`}>
                <Clock className={`w-6 h-6 text-orange-600`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Incidents</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900">{overviewStats?.activeAlerts}</p>
                  <Badge variant="secondary" className="text-xs">
                    Stable
                  </Badge>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-red-100`}>
                <AlertTriangle className={`w-6 h-6 text-red-600`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* État des lignes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5" />
              État des Lignes
            </CardTitle>
            <CardDescription>Performance en temps réel par ligne</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {linePerformanceData.map((line: any) => (
              <div key={line.lineId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${line.color}`} />
                    <span className="font-medium">{line.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {line.activeBuses} bus actifs
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {line.onTimeBuses} à l'heure • {line.delayedBuses} en retard
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Affluence Moyenne</span>
                    <span>{line.averageOccupancy?.toFixed(0) || 0}%</span>
                  </div>
                  <Progress value={line.averageOccupancy || 0} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prochains passages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Prochains Passages
            </CardTitle>
            <CardDescription>Bus à proximité de votre position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBuses.map((bus: any) => (
              <div key={bus._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${bus.lineId.color}`} />
                  <div>
                    <div className="font-medium">
                      {bus.lineId.lineId} → {bus.destination}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {bus.currentStop}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">
                    {bus.estimatedArrival
                      ? new Date(bus.estimatedArrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">Arrivée</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              <MapPin className="w-4 h-4 mr-2" />
              Voir tous les bus à proximité
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alertes récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertes Récentes
          </CardTitle>
          <CardDescription>Dernières informations sur le réseau</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert: any) => (
              <div key={alert._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.createdAt).toLocaleDateString()} à {new Date(alert.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Vue Carte</h3>
            <p className="text-sm text-gray-600">Visualiser les bus sur la carte interactive</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Vue Liste</h3>
            <p className="text-sm text-gray-600">Consulter le tableau détaillé des bus</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Statistiques</h3>
            <p className="text-sm text-gray-600">Analyser les performances du réseau</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques de performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Performance dans le temps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Horaire
            </CardTitle>
            <CardDescription>Ponctualité des bus au cours de la journée</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                onTime: {
                  label: "À l'heure",
                  color: "hsl(var(--chart-1))",
                },
                delayed: {
                  label: "En retard",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="onTime"
                    stroke="var(--color-onTime)"
                    strokeWidth={2}
                    name="À l'heure (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="delayed"
                    stroke="var(--color-delayed)"
                    strokeWidth={2}
                    name="En retard (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Comparaison des lignes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5" />
              Performance par Ligne
            </CardTitle>
            <CardDescription>Comparaison de la ponctualité entre les lignes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                onTime: {
                  label: "À l'heure",
                  color: "hsl(var(--chart-1))",
                },
                delayed: {
                  label: "En retard",
                  color: "hsl(var(--chart-2))",
                },
                disrupted: {
                  label: "Perturbé",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lineComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="line" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="onTime" stackId="a" fill="var(--color-onTime)" name="À l'heure (%)" />
                  <Bar dataKey="delayed" stackId="a" fill="var(--color-delayed)" name="En retard (%)" />
                  <Bar dataKey="disrupted" stackId="a" fill="var(--color-disrupted)" name="Perturbé (%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Affluence par ligne */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Affluence par Ligne
            </CardTitle>
            <CardDescription>Taux d'occupation des bus au cours de la journée</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                L1: {
                  label: "Ligne 1",
                  color: "hsl(var(--chart-1))",
                },
                L2: {
                  label: "Ligne 2",
                  color: "hsl(var(--chart-2))",
                },
                L3: {
                  label: "Ligne 3",
                  color: "hsl(var(--chart-3))",
                },
                L4: {
                  label: "Ligne 4",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="L1"
                    stackId="1"
                    stroke="var(--color-L1)"
                    fill="var(--color-L1)"
                    fillOpacity={0.6}
                    name="Ligne 1"
                  />
                  <Area
                    type="monotone"
                    dataKey="L2"
                    stackId="1"
                    stroke="var(--color-L2)"
                    fill="var(--color-L2)"
                    fillOpacity={0.6}
                    name="Ligne 2"
                  />
                  <Area
                    type="monotone"
                    dataKey="L3"
                    stackId="1"
                    stroke="var(--color-L3)"
                    fill="var(--color-L3)"
                    fillOpacity={0.6}
                    name="Ligne 3"
                  />
                  <Area
                    type="monotone"
                    dataKey="L4"
                    stackId="1"
                    stroke="var(--color-L4)"
                    fill="var(--color-L4)"
                    fillOpacity={0.6}
                    name="Ligne 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribution des retards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Distribution des Retards
            </CardTitle>
            <CardDescription>Répartition des bus selon leur ponctualité</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Pourcentage",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={delayDistributionChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${percent}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {delayDistributionChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">{data.value}% des bus</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
