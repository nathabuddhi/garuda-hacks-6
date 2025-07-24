"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail } from "lucide-react"
import {Link} from "react-router"
import { signInWithGoogle, signInWithEmail } from "@/handlers/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      const result = await signInWithGoogle()

      if (result.isNewUser) {
        window.location.href = ("/register?step=0&google=true")
      } else {
        window.location.href = ("/dashboard")
      }
    } catch (error) {
      console.error("Google sign in failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await signInWithEmail(email, password)
      window.location.href = ("/dashboard")
    } catch (error) {
      console.error("Email login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#525837] to-[#7E8257] relative">
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-8 left-17">
          <button className="flex items-center text-white cursor-pointer" onClick={() => window.location.href = "/"}>
            <img src="/logo-white.png" alt="LimbahKu" className="w-16 sm:w-24" />
            <span className="text-4xl font-cormorant font-semibold">LimbahKu</span>
          </button>
        </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-semibold text-center mb-8 text-gray-800 font-cormorant">Log in to your account</h1>

            <Button
              variant="outline"
              className="w-full h-12 mb-6 text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center text-gray-500 mb-6">OR</div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-4 pr-10"
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-4 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-center">
                <Link to="/register" className="text-gray-500 hover:underline text-sm">
                  {"Don't have an account? Register"}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#8B9A6B] hover:bg-[#7A8A5A] text-white"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
