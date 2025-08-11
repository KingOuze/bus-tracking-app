"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Clock, Users, Download, Filter, BarChart3 } from "lucide-react"
import { fetchLinePerformance, fetchOccupancyTrends, fetchPredictionAccuracy, fetchStatisticsOverview } from "@/lib/api"
import { OccupancyTrend, PredictionAccuracy, LinePerformance, StatisticsOverview } from "@/types"

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days")
  const [linePerformanceData, setLinePerformanceData] = useState<LinePerformance[]>([])
  const [occupancyTrendsData, setOccupancyTrendsData] = useState<OccupancyTrend[]>([])
  const [predictionAccuracyData, setPredictionAccuracyData] = useState<PredictionAccuracy[]>([])
  const [overviewStats, setOverviewStats] = useState<StatisticsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalyticsData() {
      try {
        setLoading(true)
        const [linePerfRes, occupancyTrendsRes, predictionAccuracyRes, overviewRes] = await Promise.all([
          fetchLinePerformance(),
          fetchOccupancyTrends({ period: "day" }), // Fetch daily occupancy trends
          fetchPredictionAccuracy(),
          fetchStatisticsOverview(),
        ])

        setLinePerformanceData(linePerfRes.performance)
        setOccupancyTrendsData(occupancyTrendsRes.trends)
        setPredictionAccuracyData(predictionAccuracyRes.accuracy)
        setOverviewStats(overviewRes.overview)
      } catch (err: any) {
        setError(err.message)
        console.error("Failed to load analytics data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadAnalyticsData()
  }, [selectedPeriod])

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement des analyses...</div>
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">Erreur lors du chargement: {error}</div>
    )

  // Données pour les graphiques avancés (certaines sont encore statiques car l'API ne les fournit pas directement)
  const weeklyPerformance = [
    { day: "Lun", onTime: 88, delayed: 12, passengers: 15420 },
    { day: "Mar", onTime: 85, delayed: 15, passengers: 16230 },
    { day: "Mer", onTime: 91, delayed: 9, passengers: 15890 },
    { day: "Jeu", onTime: 87, delayed: 13, passengers: 16450 },
    { day: "Ven", onTime: 83, delayed: 17, passengers: 17200 },
    { day: "Sam", onTime: 94, delayed: 6, passengers: 12300 },
    { day: "Dim", onTime: 96, delayed: 4, passengers: 10800 },
  ]

  const monthlyTrends = [
    { month: "Jan", efficiency: 85, satisfaction: 4.2, incidents: 12 },
    { month: "Fév", efficiency: 87, satisfaction: 4.3, incidents: 8 },
    { month: "Mar", efficiency: 89, satisfaction: 4.4, incidents: 6 },
    { month: "Avr", efficiency: 86, satisfaction: 4.1, incidents: 10 },
    { month: "Mai", efficiency: 91, satisfaction: 4.5, incidents: 4 },
    { month: "Jun", efficiency: 88, satisfaction: 4.3, incidents: 7 },
  ]

  const busUtilization = occupancyTrendsData.map((item) => {
    const formattedItem: { time: any; [key: string]: number | any } = { time: (item as any).time }
    linePerformanceData.forEach((line) => {
      formattedItem[line.lineId] = (item as any)[line.lineId] ?? 0
    })
    return formattedItem
  })
    
  const customerSatisfaction = [
    { category: "Ponctualité", score: 85, target: 90 },
    { category: "Confort", score: 78, target: 85 },
    { category: "Information", score: 92, target: 90 },
    { category: "Propreté", score: 88, target: 90 },
    { category: "Sécurité", score: 94, target: 95 },
  ]

  const peakHours = [
    { hour: "05:00", passengers: 120 },
    { hour: "06:00", passengers: 450 },
    { hour: "07:00", passengers: 890 },
    { hour: "08:00", passengers: 1200 },
    { hour: "09:00", passengers: 650 },
    { hour: "10:00", passengers: 400 },
    { hour: "11:00", passengers: 380 },
    { hour: "12:00", passengers: 520 },
    { hour: "13:00", passengers: 480 },
    { hour: "14:00", passengers: 420 },
    { hour: "15:00", passengers: 380 },
    { hour: "16:00", passengers: 450 },
    { hour: "17:00", passengers: 780 },
    { hour: "18:00", passengers: 1100 },
    { hour: "19:00", passengers: 850 },
    { hour: "20:00", passengers: 520 },
    { hour: "21:00", passengers: 320 },
    { hour: "22:00", passengers: 180 },
  ]

  const averageAccuracy =
    predictionAccuracyData.reduce((sum, item) => sum + item.averageAccuracy, 0) / predictionAccuracyData.length || 0

  return (
    <div className="p-6 space-y-6">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analyses Avancées</h1>
          <p className="text-gray-600 mt-1">Tableaux de bord détaillés et métriques de performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Dernières 24h</SelectItem>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="3months">3 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="utilization">Utilisation</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* KPIs de performance */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ponctualité Moyenne</p>
                    <p className="text-2xl font-bold text-green-600">
                      {typeof overviewStats?.averagePunctuality === "number"
                        ? overviewStats?.averagePunctuality?.toFixed(1)
                        : "N/A"}
                      %
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+2.3%</span>
                    </div>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Retard Moyen</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {linePerformanceData.reduce((sum, l) => sum + l.averageDelay, 0) / linePerformanceData.length ||
                        0}{" "}
                      min
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">-0.8 min</span>
                    </div>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Passagers/Jour</p>
                    <p className="text-2xl font-bold text-blue-600">15,847</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+5.2%</span>
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Incidents</p>
                    <p className="text-2xl font-bold text-red-600">{overviewStats?.activeAlerts}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">-3 cette semaine</span>
                    </div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques de performance */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Hebdomadaire</CardTitle>
                <CardDescription>Ponctualité et nombre de passagers par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    onTime: { label: "À l'heure (%)", color: "hsl(var(--chart-1))" },
                    passengers: { label: "Passagers", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="onTime"
                        stroke="var(--color-onTime)"
                        strokeWidth={2}
                        name="À l'heure (%)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="passengers"
                        stroke="var(--color-passengers)"
                        strokeWidth={2}
                        name="Passagers"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heures de Pointe</CardTitle>
                <CardDescription>Affluence des passagers par heure</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    passengers: { label: "Passagers", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={peakHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="passengers"
                        stroke="var(--color-passengers)"
                        fill="var(--color-passengers)"
                        fillOpacity={0.6}
                        name="Passagers"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation des Bus par Période</CardTitle>
              <CardDescription>Taux d'occupation par ligne selon les moments de la journée</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  morning: { label: "Matin", color: "hsl(var(--chart-1))" },
                  afternoon: { label: "Après-midi", color: "hsl(var(--chart-2))" },
                  evening: { label: "Soir", color: "hsl(var(--chart-3))" },
                  night: { label: "Nuit", color: "hsl(var(--chart-4))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={busUtilization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    {linePerformanceData.map((line) => (
                      <Bar key={line.lineId} dataKey={line.lineId} fill={line.color} name={line.name} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Client par Catégorie</CardTitle>
              <CardDescription>Scores actuels vs objectifs fixés</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: { label: "Score actuel", color: "hsl(var(--chart-1))" },
                  target: { label: "Objectif", color: "hsl(var(--chart-2))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerSatisfaction} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="category" type="category" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="score" fill="var(--color-score)" name="Score actuel" />
                    <Bar dataKey="target" fill="var(--color-target)" name="Objectif" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendances Mensuelles</CardTitle>
              <CardDescription>Évolution des métriques clés sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  efficiency: { label: "Efficacité (%)", color: "hsl(var(--chart-1))" },
                  satisfaction: { label: "Satisfaction", color: "hsl(var(--chart-2))" },
                  incidents: { label: "Incidents", color: "hsl(var(--chart-3))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="efficiency"
                      stroke="var(--color-efficiency)"
                      strokeWidth={2}
                      name="Efficacité (%)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="var(--color-satisfaction)"
                      strokeWidth={2}
                      name="Satisfaction (/5)"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="incidents"
                      stroke="var(--color-incidents)"
                      strokeWidth={2}
                      name="Incidents"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
