"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Eye, EyeOff } from "lucide-react"
import {Link, useSearchParams} from "react-router"
import { registerUser, completeGoogleUserProfile } from "@/handlers/auth"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import GoogleMapSearch from "@/components/GoogleMap"

type UserRole = "seller" | "buyer"

interface LocationData {
  address: string
  city: string
  province: string
  postal_code: string
  country: string
  lat: number
  lng: number
}

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user] = useAuthState(auth)
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthdate: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole,
    profileImage: null as File | null,
  })

  const [locationData, setLocationData] = useState<LocationData | null>(null)

  useEffect(() => {
    const stepParam = searchParams.get("step")
    const isGoogle = searchParams.get("google")

    if (stepParam) {
      setStep(Number.parseInt(stepParam))
    }

    if (isGoogle && user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        phone: user.phoneNumber || "",
        profileImage: user.photoURL ? new File([], user.photoURL) : null,
      }))
    }
  }, [searchParams, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRoleSelect = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }))
    }
  }

  const handleLocationSelect = (location: LocationData) => {
    setLocationData(location) 
  }

  const handleInitialContinue = () => {
    if (formData.username && formData.firstName && formData.lastName && formData.email) {
      setStep(1)
    }
  }

  const handleStep1Continue = () => {
    if (formData.role) {
      setStep(2)
    }
  }

  const handleFinalRegister = async () => {
    if (!locationData) return

    try {
      setLoading(true)

      const address = {
        address_id: crypto.randomUUID(),
        address: locationData.address,
        city: locationData.city,
        province: locationData.province,
        postal_code: locationData.postal_code,
        country: locationData.country,
        geo_location: {
          lat: locationData.lat,
          long: locationData.lng,
        },
      }

      if (user && searchParams.get("google")) {
        await completeGoogleUserProfile(user, {
          username: formData.username,
          role: formData.role,
          profileImage: formData.profileImage,
          phone: formData.phone,
          address,
        })
      } else {
        await registerUser({
          ...formData,
          address,
        })
      }

      window.location.href = ("/dashboard")
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#8B9A6B] flex">
        <div className="flex-1 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-12">
            <img src="/logo-white.png" alt="LimbahKu" width={40} height={40} className="rounded-full" />
            <span className="text-3xl font-cormorant font-semibold">LimbahKu</span>
          </div>

          <div className="space-y-2">
            <p className="text-xl">Join for free.</p>
            <h1 className="text-4xl font-light">
              Turn Your <span className="font-cormorant italic">Waste</span>
            </h1>
            <h1 className="text-4xl font-light">into Worth</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-[#9BAA7F] bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">Create New Account</h2>

            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="h-12 bg-white/90 border-0 placeholder:text-gray-500"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-12 bg-white/90 border-0 placeholder:text-gray-500"
                  required
                  disabled={!!user?.displayName && !!searchParams.get("google")}
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-12 bg-white/90 border-0 placeholder:text-gray-500"
                  required
                  disabled={!!user?.displayName && !!searchParams.get("google")}
                />
              </div>

              <Input
                type="date"
                placeholder="Birthdate"
                value={formData.birthdate}
                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                className="h-12 bg-white/90 border-0 placeholder:text-gray-500"
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-12 bg-white/90 border-0 placeholder:text-gray-500"
                required
                disabled={!!user?.email && !!searchParams.get("google")}
              />

              <Input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-12 bg-white/90 border-0 placeholder:text-gray-500"
                required
                disabled={!!user?.phoneNumber && !!searchParams.get("google")}
              />

              {(!searchParams.get("google")) && (
                <>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="h-12 bg-white/90 border-0 placeholder:text-gray-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="h-12 bg-white/90 border-0 placeholder:text-gray-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </>
              )}

              <div className="text-center">
                <Link to="/login" className="text-white/80 hover:text-white text-sm italic">
                  Already have an account? Login
                </Link>
              </div>

              <Button
                onClick={handleInitialContinue}
                className="w-full h-12 bg-[#D4B896] hover:bg-[#C4A886] text-gray-800 font-medium"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-12 bg-[#8B9A6B] text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo-white.png" alt="LimbahKu" width={40} height={40} className="rounded-full" />
              <span className="text-3xl font-cormorant font-semibold">LimbahKu</span>
            </div>
            <h1 className="text-3xl font-light mb-2">{"Let's Set Up Your"}</h1>
            <h1 className="text-3xl font-cormorant font-semibold italic mb-8">LimbahKu Account</h1>
          </div>
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-center mb-8 lg:hidden">
              <div className="flex items-center gap-3 text-[#8B9A6B]">
                <img src="/logo-white.png" alt="LimbahKu" width={32} height={32} className="rounded-full" />
                <span className="text-2xl font-cormorant font-semibold">LimbahKu</span>
              </div>
            </div>

            <div className="text-right mb-6">
              <span className="text-2xl font-semibold">Step 1</span>
              <span className="text-gray-400">/2</span>
            </div>

            <h2 className="text-2xl font-semibold text-center mb-8">Tell Us About Yourself</h2>

            <div className="space-y-6">
              <div>
                <p className="text-center mb-6 text-gray-700">What are you using LimbahKu for?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                      formData.role === "seller"
                        ? "border-[#8B9A6B] bg-[#8B9A6B]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleRoleSelect("seller")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#8B9A6B]/10 rounded-lg flex items-center justify-center">
                        <div className="text-3xl">♻️</div>
                      </div>
                      <div className="bg-[#8B9A6B] text-white px-6 py-2 rounded-lg font-medium">SELL WASTE</div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                      formData.role === "buyer"
                        ? "border-[#8B9A6B] bg-[#8B9A6B]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleRoleSelect("buyer")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#8B9A6B]/10 rounded-lg flex items-center justify-center">
                        <div className="text-3xl">🏭</div>
                      </div>
                      <div className="bg-[#8B9A6B] text-white px-6 py-2 rounded-lg font-medium">BUY WASTE</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image"
                  />
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload a new image (Max 5mb)</p>
                    {formData.profileImage && (
                      <p className="text-xs text-green-600 mt-1">Selected: {formData.profileImage.name}</p>
                    )}
                  </label>
                </div>
              </div>

              <Button
                onClick={handleStep1Continue}
                disabled={!formData.role}
                className="w-full h-12 bg-[#8B9A6B] hover:bg-[#7A8A5A] text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-12 bg-[#8B9A6B] text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo-white.png" alt="LimbahKu" width={40} height={40} className="rounded-full" />
            <span className="text-3xl font-cormorant font-semibold">LimbahKu</span>
          </div>
          <h1 className="text-3xl font-light mb-2">{"Let's Set Up Your"}</h1>
          <h1 className="text-3xl font-cormorant font-semibold italic mb-8">LimbahKu Account</h1>
        </div>
      </div>

      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-3 text-[#8B9A6B]">
              <img src="/logo-white.png" alt="LimbahKu" width={32} height={32} className="rounded-full" />
              <span className="text-2xl font-cormorant font-semibold">LimbahKu</span>
            </div>
          </div>

          <div className="text-right mb-6">
            <span className="text-2xl font-semibold">Step 2</span>
            <span className="text-gray-400">/2</span>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-8">Tell Us Your Location</h2>

          <div className="space-y-6">
            <GoogleMapSearch onLocationSelect={handleLocationSelect} />

            {locationData && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900">Selected Location:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Address:</strong> {locationData.address}
                  </p>
                  <p>
                    <strong>City:</strong> {locationData.city}
                  </p>
                  <p>
                    <strong>Province:</strong> {locationData.province}
                  </p>
                  <p>
                    <strong>Postal Code:</strong> {locationData.postal_code}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12" disabled={loading}>
                Back
              </Button>
              <Button
                onClick={handleFinalRegister}
                disabled={!locationData || loading}
                className="flex-1 h-12 bg-[#8B9A6B] hover:bg-[#7A8A5A] text-white"
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
