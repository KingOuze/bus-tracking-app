"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  Info,
  MapPin,
} from "lucide-react"
import { fetchPredictions, fetchPredictiveAlerts, fetchPredictionAccuracy } from "@/lib/api"

export default function PredictionEngineComponent() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("ensemble")
  const [predictionHorizon, setPredictionHorizon] = useState("60") // en minutes
  const [predictionsData, setPredictionsData] = useState([])
  const [predictiveAlerts, setPredictiveAlerts] = useState([])
  const [predictionMetrics, setPredictionMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [predictionAccuracyData, setPredictionAccuracyData] = useState([])
  const [averageAccuracy, setAverageAccuracy] = useState(0)

  useEffect(() => {
    async function loadPredictionData() {
      try {
        setLoading(true)
        const [predictionsRes, alertsRes, metricsRes] = await Promise.all([
          fetchPredictions({ algorithm: selectedAlgorithm, horizon: predictionHorizon }),
          fetchPredictiveAlerts(),
          fetchPredictionAccuracy(),
        ])

        setPredictionsData(predictionsRes.predictions.delay || []) // Assurez-vous de prendre le bon type
        setPredictiveAlerts(alertsRes.alerts)
        setPredictionMetrics(metricsRes.predictionAccuracy.find((m: any) => m.algorithm === selectedAlgorithm) || {})
        setPredictionAccuracyData(metricsRes.predictionAccuracy)
        setAverageAccuracy(
          metricsRes.predictionAccuracy.reduce((sum: number, model: any) => sum + model.averageAccuracy, 0) /
            metricsRes.predictionAccuracy.length,
        )
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Une erreur est survenue")
        }
        console.error("Failed to load prediction data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadPredictionData()
  }, [selectedAlgorithm, predictionHorizon])

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement des prédictions...</div>
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">Erreur lors du chargement: {error}</div>
    )

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-orange-600 bg-orange-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  // Préparer les données pour le graphique de prédictions temporelles
  const chartPredictions = predictionsData.map((p: any) => ({
    time: `${p.horizon}min`,
    ensemble: p.predictedValue,
    confidence: p.confidence,
  }))

  // Prédictions par ligne (simulées pour l'exemple, car l'API ne renvoie pas ce format directement)
  const linePredictions = [
    {
      line: "L1",
      currentDelay: 2.1,
      predictedDelay: 3.5,
      confidence: 82,
      risk: "medium",
      factors: ["Pluie légère", "Trafic modéré", "Concert ce soir"],
    },
    {
      line: "L2",
      currentDelay: 1.8,
      predictedDelay: 1.7,
      confidence: 91,
      risk: "low",
      factors: ["Temps ensoleillé", "Trafic fluide"],
    },
    {
      line: "L3",
      currentDelay: 4.2,
      predictedDelay: 12.8,
      confidence: 76,
      risk: "high",
      factors: ["Brouillard dense", "Trafic dense", "Grève partielle"],
    },
    {
      line: "L4",
      currentDelay: 1.5,
      predictedDelay: 1.2,
      confidence: 88,
      risk: "low",
      factors: ["Temps clair", "Jour férié"],
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            Prédictions IA
          </h1>
          <p className="text-gray-600 mt-1">Algorithmes de machine learning pour anticiper les retards</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ensemble">Ensemble</SelectItem>
              <SelectItem value="linear_regression">Régression Linéaire</SelectItem>
              <SelectItem value="exponential_moving_average">Moyenne Mobile</SelectItem>
              <SelectItem value="seasonal_analysis">Analyse Saisonnière</SelectItem>
            </SelectContent>
          </Select>
          <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="120">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métriques de performance du modèle */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Précision</p>
                <p className="text-2xl font-bold text-green-600">
                  {predictionMetrics?.averageAccuracy?.toFixed(1) || 0}%
                </p>
              </div>
              <Target className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fiabilité</p>
                <p className="text-2xl font-bold text-blue-600">
                  {predictionMetrics?.averageConfidence?.toFixed(1) || 0}%
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Couverture</p>
                <p className="text-2xl font-bold text-purple-600">N/A%</p> {/* API ne fournit pas directement */}
              </div>
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score F1</p>
                <p className="text-2xl font-bold text-orange-600">N/A%</p> {/* API ne fournit pas directement */}
              </div>
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Erreur Moy.</p>
                <p className="text-2xl font-bold text-red-600">N/A min</p> {/* API ne fournit pas directement */}
              </div>
              <Zap className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="models">Modèles</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Graphique des prédictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Prédictions Temporelles
                </CardTitle>
                <CardDescription>
                  Évolution prédite de la ponctualité sur les {predictionHorizon} minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ensemble: { label: "Prédiction Ensemble", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartPredictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} /> {/* Retard en minutes, donc 0-100 est une bonne échelle */}
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ensemble"
                        stroke="var(--color-ensemble)"
                        strokeWidth={3}
                        name="Prédiction"
                      />
                      <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" label="Seuil Critique (10min)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Prédictions par ligne */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Prédictions par Ligne
                </CardTitle>
                <CardDescription>Retards prévus basés sur les conditions actuelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {linePredictions.map((prediction: any) => (
                  <div key={prediction.line} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{prediction.line}</span>
                        <Badge className={getRiskColor(prediction.risk)}>
                          {prediction.risk === "high"
                            ? "Risque Élevé"
                            : prediction.risk === "medium"
                              ? "Risque Modéré"
                              : "Risque Faible"}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Confiance: {prediction.confidence}%</div>
                        <Progress value={prediction.confidence} className="w-20 h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm text-gray-600">Actuel: </span>
                        <span className="font-medium">{prediction.currentDelay} min</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Prévu: </span>
                        <span
                          className={`font-bold ${
                            prediction.predictedDelay > prediction.currentDelay * 1.5
                              ? "text-red-600"
                              : prediction.predictedDelay > prediction.currentDelay
                                ? "text-orange-600"
                                : "text-green-600"
                          }`}
                        >
                          {prediction.predictedDelay.toFixed(1)} min
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Facteurs: {prediction.factors.join(", ")}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertes Prédictives
              </CardTitle>
              <CardDescription>Notifications basées sur les prédictions IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictiveAlerts.map((alert: any) => (
                <div key={alert.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{alert.line?.lineId || alert.line}</span>
                      <Badge variant="outline">{alert.probability || alert.confidence}% de probabilité</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Impact:{" "}
                        <span
                          className={`font-medium ${
                            alert.impact === "high"
                              ? "text-red-600"
                              : alert.impact === "medium"
                                ? "text-orange-600"
                                : "text-green-600"
                          }`}
                        >
                          {alert.impact === "high" ? "Élevé" : alert.impact === "medium" ? "Modéré" : "Faible"}
                        </span>
                      </span>
                      <span className="text-xs font-medium text-blue-600">{alert.recommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Analyse de confiance */}
            <Card>
              <CardHeader>
                <CardTitle>Niveau de Confiance</CardTitle>
                <CardDescription>Fiabilité des prédictions par horizon temporel</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    confidence: { label: "Confiance (%)", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartPredictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[50, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="confidence"
                        stroke="var(--color-confidence)"
                        fill="var(--color-confidence)"
                        fillOpacity={0.6}
                        name="Niveau de Confiance (%)"
                      />
                      <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label="Seuil Minimum" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Facteurs d'influence (statiques pour l'instant) */}
            <Card>
              <CardHeader>
                <CardTitle>Facteurs d'Influence</CardTitle>
                <CardDescription>Impact des différents facteurs sur les retards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conditions météo</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-20" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trafic routier</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Événements spéciaux</span>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-20" />
                      <span className="text-sm font-medium">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Heure de pointe</span>
                    <div className="flex items-center gap-2">
                      <Progress value={90} className="w-20" />
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Jour de la semaine</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictionAccuracyData.map((model: any) => (
              <Card key={model.algorithm}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {model.algorithm === "linear_regression"
                      ? "Régression Linéaire"
                      : model.algorithm === "exponential_moving_average"
                        ? "Moyenne Mobile Exp."
                        : model.algorithm === "seasonal_analysis"
                          ? "Analyse Saisonnière"
                          : "Modèle Ensemble"}
                  </CardTitle>
                  <CardDescription>
                    {model.algorithm === "linear_regression"
                      ? "Modèle de tendance simple"
                      : model.algorithm === "exponential_moving_average"
                        ? "Adaptation aux changements récents"
                        : model.algorithm === "seasonal_analysis"
                          ? "Patterns cycliques et récurrents"
                          : "Combinaison pondérée de tous les modèles"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Précision</span>
                      <span className="font-medium">{model.averageAccuracy?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Complexité</span>
                      <Badge
                        variant="outline"
                        className={
                          model.algorithm === "linear_regression"
                            ? "bg-green-50"
                            : model.algorithm === "exponential_moving_average"
                              ? "bg-yellow-50"
                              : "bg-red-50"
                        }
                      >
                        {model.algorithm === "linear_regression"
                          ? "Faible"
                          : model.algorithm === "exponential_moving_average"
                            ? "Moyenne"
                            : "Élevée"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Prédictions validées</span>
                      <span className="text-sm">{model.count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Modèle Ensemble (Recommandé)</CardTitle>
              <CardDescription>Combinaison pondérée de tous les modèles pour une précision optimale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{averageAccuracy.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Précision Globale</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">0.8 min</p>
                  <p className="text-sm text-gray-600">Erreur Moyenne</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">Moins de 100 ms</p>
                  <p className="text-sm text-gray-600">Temps de Calcul</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">24/7</p>
                  <p className="text-sm text-gray-600">Disponibilité</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
