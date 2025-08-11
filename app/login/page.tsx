"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole === "admin") {
      router.push("/")
    } else if (userRole === "user") {
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <LoginForm />
    </div>
  )
}
