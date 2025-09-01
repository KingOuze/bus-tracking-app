"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Bell,
  Palette,
  Shield,
  Code,
  Wrench,
  Save,
  RefreshCw,
  Database,
  Globe,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Key,
  Server,
  HardDrive,
  Trash2,
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    appName: "Bus Management System",
    language: "fr",
    timezone: "Europe/Paris",
    autoRefresh: true,
    refreshInterval: 30,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertThreshold: "medium",

    // Affichage
    theme: "light",
    density: "comfortable",
    showAnimations: true,
    compactMode: false,

    // Sécurité
    sessionTimeout: 60,
    twoFactorAuth: false,
    passwordExpiry: 90,

    // API
    apiTimeout: 5000,
    rateLimitEnabled: true,
    maxRequestsPerMinute: 100,

    // Maintenance
    autoBackup: true,
    backupFrequency: "daily",
    logRetention: 30,
    debugMode: false,
  })

  const handleSave = () => {
    console.log("[v0] Saving settings:", settings)
    // Ici on sauvegarderait les paramètres via l'API
  }

  const handleReset = () => {
    console.log("[v0] Resetting settings to defaults")
    // Ici on réinitialiserait les paramètres
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre application de gestion de transport</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Affichage
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Paramètres Généraux */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Configuration Générale
              </CardTitle>
              <CardDescription>Paramètres de base de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="appName">Nom de l'application</Label>
                  <Input
                    id="appName"
                    value={settings.appName}
                    onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Intervalle de rafraîchissement (secondes)</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    value={settings.refreshInterval}
                    onChange={(e) => setSettings({ ...settings, refreshInterval: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Rafraîchissement automatique</Label>
                  <p className="text-sm text-muted-foreground">Actualise automatiquement les données en temps réel</p>
                </div>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Paramètres de Notification
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-secondary" />
                    <div>
                      <Label className="text-base">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-secondary" />
                    <div>
                      <Label className="text-base">Notifications SMS</Label>
                      <p className="text-sm text-muted-foreground">Recevoir les alertes par SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-secondary" />
                    <div>
                      <Label className="text-base">Notifications push</Label>
                      <p className="text-sm text-muted-foreground">Notifications dans le navigateur</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Seuil d'alerte</Label>
                <Select
                  value={settings.alertThreshold}
                  onValueChange={(value) => setSettings({ ...settings, alertThreshold: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Affichage */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Paramètres d'Affichage
              </CardTitle>
              <CardDescription>Personnalisez l'apparence de l'interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Clair
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Sombre
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Densité d'affichage</Label>
                  <Select
                    value={settings.density}
                    onValueChange={(value) => setSettings({ ...settings, density: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Confortable</SelectItem>
                      <SelectItem value="spacious">Spacieux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Animations</Label>
                    <p className="text-sm text-muted-foreground">Activer les animations d'interface</p>
                  </div>
                  <Switch
                    checked={settings.showAnimations}
                    onCheckedChange={(checked) => setSettings({ ...settings, showAnimations: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Mode compact</Label>
                    <p className="text-sm text-muted-foreground">Affichage condensé pour plus d'informations</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Paramètres de Sécurité
              </CardTitle>
              <CardDescription>Configurez les options de sécurité et d'authentification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Expiration du mot de passe (jours)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({ ...settings, passwordExpiry: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-secondary" />
                  <div>
                    <Label className="text-base">Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Sécurité renforcée avec 2FA
                      <Badge variant="secondary" className="ml-2">
                        Recommandé
                      </Badge>
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Configuration API
              </CardTitle>
              <CardDescription>Paramètres des intégrations et accès API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiTimeout">Délai d'expiration API (ms)</Label>
                  <Input
                    id="apiTimeout"
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => setSettings({ ...settings, apiTimeout: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRequests">Limite de requêtes par minute</Label>
                  <Input
                    id="maxRequests"
                    type="number"
                    value={settings.maxRequestsPerMinute}
                    onChange={(e) =>
                      setSettings({ ...settings, maxRequestsPerMinute: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-secondary" />
                  <div>
                    <Label className="text-base">Limitation de débit</Label>
                    <p className="text-sm text-muted-foreground">Activer la limitation des requêtes API</p>
                  </div>
                </div>
                <Switch
                  checked={settings.rateLimitEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, rateLimitEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Outils de Maintenance
              </CardTitle>
              <CardDescription>Gestion des sauvegardes, logs et maintenance système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Fréquence de sauvegarde</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logRetention">Rétention des logs (jours)</Label>
                  <Input
                    id="logRetention"
                    type="number"
                    value={settings.logRetention}
                    onChange={(e) => setSettings({ ...settings, logRetention: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive className="h-5 w-5 text-secondary" />
                    <div>
                      <Label className="text-base">Sauvegarde automatique</Label>
                      <p className="text-sm text-muted-foreground">Sauvegardes programmées automatiquement</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-secondary" />
                    <div>
                      <Label className="text-base">Mode debug</Label>
                      <p className="text-sm text-muted-foreground">
                        Logs détaillés pour le débogage
                        <Badge variant="destructive" className="ml-2">
                          Performance
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Database className="h-4 w-4" />
                  Sauvegarder maintenant
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                  Nettoyer les logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  )
}
