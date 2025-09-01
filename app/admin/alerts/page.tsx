"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, X, MapPin, Clock, Users, Route } from "lucide-react"

interface AlertFormData {
  alertId: string
  type: "info" | "warning" | "error" | "success" | "maintenance" | "disruption"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  description: string
  source: "system" | "operator" | "prediction" | "external" | "user"
  category: "delay" | "cancellation" | "route_change" | "technical" | "weather" | "traffic" | "event"
  priority: number
  affectedLines: string[]
  affectedStops: string[]
  affectedBuses: string[]
  location: {
    latitude: string
    longitude: string
    radius: string
  }
  startTime: string
  endTime: string
  estimatedDuration: string
  impact: {
    delayMinutes: string
    affectedPassengers: string
    alternativeRoutes: string[]
  }
}

export default function AdminAlertsPage() {
  const [formData, setFormData] = useState<AlertFormData>({
    alertId: "",
    type: "info",
    severity: "medium",
    title: "",
    message: "",
    description: "",
    source: "operator",
    category: "delay",
    priority: 5,
    affectedLines: [],
    affectedStops: [],
    affectedBuses: [],
    location: {
      latitude: "",
      longitude: "",
      radius: "",
    },
    startTime: "",
    endTime: "",
    estimatedDuration: "",
    impact: {
      delayMinutes: "",
      affectedPassengers: "",
      alternativeRoutes: [],
    },
  })

  const [newLine, setNewLine] = useState("")
  const [newStop, setNewStop] = useState("")
  const [newBus, setNewBus] = useState("")
  const [newRoute, setNewRoute] = useState("")

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof AlertFormData],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const addToArray = (field: keyof AlertFormData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }))
      setter("")
    }
  }

  const removeFromArray = (field: keyof AlertFormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Générer un ID unique si pas fourni
    if (!formData.alertId) {
      formData.alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    console.log("[v0] Submitting alert:", formData)

    // Ici vous pouvez ajouter l'appel API pour créer l'alerte
    // const response = await fetch('/api/alerts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })

    alert("Alerte créée avec succès!")
  }

  const getTypeColor = (type: string) => {
    const colors = {
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      success: "bg-green-100 text-green-800",
      maintenance: "bg-purple-100 text-purple-800",
      disruption: "bg-orange-100 text-orange-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }
    return colors[severity as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle alerte</h1>
        <p className="text-gray-600 mt-2">Ajoutez une alerte pour informer les usagers des perturbations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Informations de base
            </CardTitle>
            <CardDescription>Définissez le type et la sévérité de l'alerte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alertId">ID de l'alerte (optionnel)</Label>
                <Input
                  id="alertId"
                  value={formData.alertId}
                  onChange={(e) => handleInputChange("alertId", e.target.value)}
                  placeholder="Généré automatiquement si vide"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priorité (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => handleInputChange("priority", Number.parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type d'alerte</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="disruption">Perturbation</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={`mt-2 ${getTypeColor(formData.type)}`}>{formData.type}</Badge>
              </div>
              <div>
                <Label htmlFor="severity">Sévérité</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={`mt-2 ${getSeverityColor(formData.severity)}`}>{formData.severity}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Système</SelectItem>
                    <SelectItem value="operator">Opérateur</SelectItem>
                    <SelectItem value="prediction">Prédiction</SelectItem>
                    <SelectItem value="external">Externe</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delay">Retard</SelectItem>
                    <SelectItem value="cancellation">Annulation</SelectItem>
                    <SelectItem value="route_change">Changement d'itinéraire</SelectItem>
                    <SelectItem value="technical">Technique</SelectItem>
                    <SelectItem value="weather">Météo</SelectItem>
                    <SelectItem value="traffic">Trafic</SelectItem>
                    <SelectItem value="event">Événement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenu de l'alerte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Contenu de l'alerte
            </CardTitle>
            <CardDescription>Rédigez le message qui sera affiché aux usagers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Titre court et descriptif"
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Message principal de l'alerte"
                required
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Informations supplémentaires (optionnel)"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Éléments affectés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5 text-orange-500" />
              Éléments affectés
            </CardTitle>
            <CardDescription>Spécifiez les lignes, arrêts et bus concernés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lignes affectées */}
            <div>
              <Label>Lignes affectées</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  placeholder="Numéro de ligne"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addToArray("affectedLines", newLine, setNewLine))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addToArray("affectedLines", newLine, setNewLine)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.affectedLines.map((line, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    Ligne {line}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromArray("affectedLines", index)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Arrêts affectés */}
            <div>
              <Label>Arrêts affectés</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newStop}
                  onChange={(e) => setNewStop(e.target.value)}
                  placeholder="Nom de l'arrêt"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addToArray("affectedStops", newStop, setNewStop))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addToArray("affectedStops", newStop, setNewStop)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.affectedStops.map((stop, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {stop}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromArray("affectedStops", index)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bus affectés */}
            <div>
              <Label>Bus affectés</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newBus}
                  onChange={(e) => setNewBus(e.target.value)}
                  placeholder="Numéro de bus"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addToArray("affectedBuses", newBus, setNewBus))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addToArray("affectedBuses", newBus, setNewBus)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.affectedBuses.map((bus, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    Bus {bus}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromArray("affectedBuses", index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Localisation
            </CardTitle>
            <CardDescription>Définissez la zone géographique affectée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.location.latitude}
                  onChange={(e) => handleInputChange("location.latitude", e.target.value)}
                  placeholder="48.8566"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.location.longitude}
                  onChange={(e) => handleInputChange("location.longitude", e.target.value)}
                  placeholder="2.3522"
                />
              </div>
              <div>
                <Label htmlFor="radius">Rayon (mètres)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={formData.location.radius}
                  onChange={(e) => handleInputChange("location.radius", e.target.value)}
                  placeholder="500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Planification
            </CardTitle>
            <CardDescription>Définissez la période d'activité de l'alerte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startTime">Début</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Fin</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="estimatedDuration">Durée estimée (minutes)</Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Impact
            </CardTitle>
            <CardDescription>Évaluez l'impact de la perturbation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delayMinutes">Retard (minutes)</Label>
                <Input
                  id="delayMinutes"
                  type="number"
                  value={formData.impact.delayMinutes}
                  onChange={(e) => handleInputChange("impact.delayMinutes", e.target.value)}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="affectedPassengers">Passagers affectés</Label>
                <Input
                  id="affectedPassengers"
                  type="number"
                  value={formData.impact.affectedPassengers}
                  onChange={(e) => handleInputChange("impact.affectedPassengers", e.target.value)}
                  placeholder="150"
                />
              </div>
            </div>

            <div>
              <Label>Routes alternatives</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  placeholder="Description de la route alternative"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addToArray("impact.alternativeRoutes", newRoute, setNewRoute))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addToArray("impact.alternativeRoutes", newRoute, setNewRoute)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.impact.alternativeRoutes.map((route, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {route}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFromArray("impact.alternativeRoutes", index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Créer l'alerte
          </Button>
        </div>
      </form>
    </div>
  )
}
