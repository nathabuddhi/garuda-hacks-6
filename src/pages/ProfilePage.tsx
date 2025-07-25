"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Loader2, LogOut, User } from "lucide-react"
import { useAuthUser } from "@/lib/utils"
import { signOut, updateUserProfile } from "@/handlers/auth"
import { toast } from "sonner" 
import GoogleMapSearch from "@/components/GoogleMap"

interface ProfileFormData {
  firstName: string
  lastName: string
  username: string
  phone: string
  email: string
  address: string
  profileImage?: File | null
}

interface LocationData {
  address: string
  city: string
  province: string
  postal_code: string
  country: string
  lat: number
  lng: number
}

export default function ProfilePage() {
  const { user, loading, userProfile } = useAuthUser({
    redirectIfNoUser: true,
  })

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = ("/");
    }
  }, [user, loading]);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
    address: "",
    profileImage: null,
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.first_name || "",
        lastName: userProfile.last_name || "",
        username: userProfile.username || "",
        phone: userProfile.phone || "",
        email: userProfile.email || "",
        address: userProfile.addresses?.[0]?.address || "",
        profileImage: null,
      })

      const location: LocationData = {
        address: userProfile.addresses?.[0]?.address || "",
        city: userProfile.addresses?.[0]?.city || "",
        province: userProfile.addresses?.[0]?.province || "",
        postal_code: userProfile.addresses?.[0]?.postal_code || "",
        country: userProfile.addresses?.[0]?.country || "Indonesia",
        lat: userProfile.addresses?.[0]?.geo_location?.lat || 0,
        lng: userProfile.addresses?.[0]?.geo_location?.long || 0,
      }

      handleLocationSelect(location) 

      if (userProfile.profile_image) {
        setProfileImagePreview(userProfile.profile_image)
      }
    }
  }, [userProfile])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      setFormData((prev) => ({ ...prev, profileImage: file }))

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleLocationSelect = (location: LocationData) => {
    setLocationData(location)
    setFormData((prev) => ({ ...prev, address: location.address }))
  }

  const handleSaveChanges = async () => {
    if (!user || !userProfile) return

    try {
      setIsUpdating(true)

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        address: locationData ? locationData.address : formData.address,
        profileImage: formData.profileImage,
        locationData: locationData,
      }

      await updateUserProfile(user.uid, updateData)

      toast.success("Profile updated successfully!")
      setFormData((prev) => ({ ...prev, profileImage: null }))
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Logged out successfully")
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF2E1] flex items-center justify-center">
        <Card className="bg-white shadow-lg p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#525837]" />
            <p className="text-[#525837] font-medium">Loading your profile...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-[#FCF2E1] flex items-center justify-center">
        <Card className="bg-white shadow-lg p-8">
          <div className="text-center">
            <p className="text-[#525837] font-medium mb-4">Unable to load profile</p>
            <Button onClick={() => window.location.reload()} className="bg-[#525837] hover:bg-[#7E8257] text-white">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FCF2E1] py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6 sm:mb-8 mt-15">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#525837]">Profile Settings</h1>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2 px-3 py-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </Button>
        </div>

        <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-[#7E8257]/20 shadow-lg">
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#7E8257]/10 flex items-center justify-center">
                        <User className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-[#7E8257]" />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                <p
                  className="mt-4 text-sm sm:text-base text-[#525837] font-medium cursor-pointer hover:text-[#7E8257] transition-colors"
                  onClick={handleImageClick}
                >
                  Change Profile
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">First Name</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#525837] focus:ring-[#525837] rounded-lg"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Last Name</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#525837] focus:ring-[#525837] rounded-lg"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Role</label>
                  <Badge
                    className={`px-4 py-2 text-sm font-medium rounded-full ${
                      userProfile.role === "seller"
                        ? "bg-[#7E8257] text-white hover:bg-[#525837]"
                        : userProfile.role === "buyer"
                          ? "bg-[#525837] text-white hover:bg-[#7E8257]"
                          : "bg-[#7E8257] text-white hover:bg-[#525837]"
                    }`}
                  >
                    {userProfile.role === "seller" ? "Seller" : userProfile.role === "buyer" ? "Buyer" : "Customer"}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Username</label>
                  <Input
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="h-12 border-gray-300 focus:border-[#525837] focus:ring-[#525837] rounded-lg"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-12 border-gray-300 focus:border-[#525837] focus:ring-[#525837] rounded-lg"
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Email</label>
                  <div className="h-12 px-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center">
                    <span className="text-gray-600">{userProfile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Birth Date</label>
                  <div className="h-12 px-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center">
                    <span className="text-gray-600">
                      {userProfile.birthdate!.toDate().toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Address</label>
                  <GoogleMapSearch onLocationSelect={handleLocationSelect} />

                  {locationData && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-2">Selected Location:</h3>
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
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    className="bg-[#7E8257] hover:bg-[#525837] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 min-w-[140px]"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
