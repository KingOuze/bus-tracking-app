"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { token, user } = await loginUser({ email, password })
      localStorage.setItem("token", token)
      localStorage.setItem("userRole", user.role)
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${email}!`,
      })
      if (user.role === "admin") {
        router.push("/")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>Entrez votre email ci-dessous pour vous connecter à votre compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
              {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Connexion"}
          </Button>
          {/* <Button variant="outline" className="w-full bg-transparent">
            Login with Google
          </Button> */}
        </form>
        {/* <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div> */}
      </CardContent>
    </Card>
  )
}
