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

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

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

      if (user.photoURL) {
        setProfileImagePreview(user.photoURL)
      }
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

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
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
      <div className="min-h-screen bg-gradient-to-r from-[#525837] to-[#7E8257] flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 text-white py-8 lg:py-0">
          <div className="absolute top-3 left-25 sm:top-20 sm:left-17">
            <div className="flex items-center mb-8 lg:mb-12">
              <img src="/logo-white.png" alt="LimbahKu" className="rounded-full w-16 sm:w-36" />
              <span className="text-2xl lg:text-5xl font-cormorant font-semibold">LimbahKu</span>
            </div>
          </div>

          <div className="space-y-2 absolute top-1/2 left-27">
            <p className="text-lg lg:text-xl mb-4">Join for free.</p>
            <h1 className="text-3xl lg:text-4xl font-cormorant">
              Turn Your <span className="font-cormorant italic">Waste</span>
            </h1>
            <h1 className="text-3xl lg:text-4xl font-cormorant">into Worth</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="bg-[#7E8257] bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 w-full max-w-md">
            <h2 className="text-xl lg:text-2xl font-semibold text-white text-center mb-6 lg:mb-8">
              Create New Account
            </h2>

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
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-r from-[#525837] to-[#7E8257] text-white">
          <div className="max-w-md">
            <div className="absolute top-8 left-10">
              <div className="flex items-center mb-8">
                <img src="/logo-white.png" alt="LimbahKu" className="rounded-full w-36 " />
                <span className="text-4xl font-cormorant font-semibold">LimbahKu</span>
              </div>
            </div>
            <div className="absolute top-1/2 left-20">
              <h1 className="text-4xl font-light mb-2">{"Let's Set Up Your"}</h1>
              <h1 className="text-4xl font-cormorant font-semibold italic mb-8">&nbsp;LimbahKu Account</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-center mb-8 lg:hidden">
              <div className="flex items-center gap-3 text-[#525837]">
                <img src="/logo-white.png" alt="LimbahKu" className="w-10 rounded-full bg-gradient-to-r from-[#525837] to-[#7E8257] " />
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
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 p-0 ${
                      formData.role === "seller"
                        ? "border-[#525837] bg-[#7E8257]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleRoleSelect("seller")}
                  >
                    <CardContent className="p-6 text-center bg-[#7E8257] rounded-xl">
                      <div className="w-full h-32 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="/waste_seller.png" alt="Sell Waste" className="w-full h-full object-contain " />
                      </div>
                      <div className="bg-[#525837] text-white px-6 py-2 rounded-lg font-medium">SELL WASTE</div>{" "}
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 p-0 ${
                      formData.role === "buyer"
                        ? "border-[#525837] bg-[#7E8257]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleRoleSelect("buyer")}
                  >
                    <CardContent className="p-6 text-center bg-[#7E8257] rounded-xl">
                      <div className="w-full h-32 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="/waste_buyer.png" alt="Buy Waste" className="w-full h-full object-contain" />
                      </div>
                      <div className="bg-[#525837] text-white px-6 py-2 rounded-lg font-medium">BUY WASTE</div>{" "}
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
                    {profileImagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={profileImagePreview || "/placeholder.svg"}
                          alt="Profile Preview"
                          className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-gray-300"
                        />
                        <p className="text-sm text-green-600">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload a new image (Max 5mb)</p>
                      </>
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
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-r from-[#525837] to-[#7E8257] text-white">
          <div className="max-w-md">
            <div className="absolute top-8 left-10">
              <div className="flex items-center mb-8">
                <img src="/logo-white.png" alt="LimbahKu" className="rounded-full w-36 " />
                <span className="text-4xl font-cormorant font-semibold">LimbahKu</span>
              </div>
            </div>
            <div className="absolute top-1/2 left-20">
              <h1 className="text-4xl font-light mb-2">{"Let's Set Up Your"}</h1>
              <h1 className="text-4xl font-cormorant font-semibold italic mb-8">&nbsp;LimbahKu Account</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-center mb-8 lg:hidden">
              <div className="flex items-center gap-3 text-[#525837]">
                <img src="/logo-white.png" alt="LimbahKu" className="w-10 rounded-full bg-gradient-to-r from-[#525837] to-[#7E8257] " />
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
