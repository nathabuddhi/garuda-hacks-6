"use client"

import { useState, useRef } from "react"
import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api"

import type { Libraries } from "@react-google-maps/api"
const libraries: Libraries = ["places"]

const containerStyle = {
  width: "100%",
  height: "300px",
}

const defaultCenter = {
  lat: -6.2,
  lng: 106.8,
}

interface GoogleMapSearchProps {
  onLocationSelect: (location: {
    address: string
    city: string
    province: string
    postal_code: string
    country: string
    lat: number
    lng: number
  }) => void
}

export default function GoogleMapSearch({ onLocationSelect }: GoogleMapSearchProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [searchInput, setSearchInput] = useState<string>("")
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
    libraries: libraries,
  })

  const onLoadMap = (mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }

  const onLoadSearchBox = (searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox
  }

  const extractLocationDetails = (place: google.maps.places.PlaceResult) => {
    let city = ""
    let province = ""
    let postal_code = ""
    let country = ""

    if (place.address_components) {
      place.address_components.forEach((component) => {
        const types = component.types
        if (types.includes("locality") || types.includes("administrative_area_level_2")) {
          city = component.long_name
        }
        if (types.includes("administrative_area_level_1")) {
          province = component.long_name
        }
        if (types.includes("postal_code")) {
          postal_code = component.long_name
        }
        if (types.includes("country")) {
          country = component.long_name
        }
      })
    }

    return { city, province, postal_code, country }
  }

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces()
    if (places && places.length > 0) {
      const place = places[0]
      const location = place.geometry?.location
      if (location) {
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
        }
        setMarkerPosition(latLng)
        setSearchInput(place.formatted_address || "")
        map?.panTo(latLng)

        const locationDetails = extractLocationDetails(place)
        onLocationSelect({
          address: place.formatted_address || "",
          lat: latLng.lat,
          lng: latLng.lng,
          ...locationDetails,
        })
      }
    }
  }

  const onMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLatLng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
      setMarkerPosition(newLatLng)
      map?.panTo(newLatLng)
      await updateSearchInput(newLatLng)
    }
  }

  const updateSearchInput = async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      )
      const data = await response.json()
      if (data.status === "OK" && data.results?.[0]) {
        const place = data.results[0]
        setSearchInput(place.formatted_address)
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address
        }

        let city = ""
        let province = ""
        let postal_code = ""
        let country = ""

        if (place.address_components) {
          place.address_components.forEach((component: any) => {
            const types = component.types
            if (types.includes("locality") || types.includes("administrative_area_level_2")) {
              city = component.long_name
            }
            if (types.includes("administrative_area_level_1")) {
              province = component.long_name
            }
            if (types.includes("postal_code")) {
              postal_code = component.long_name
            }
            if (types.includes("country")) {
              country = component.long_name
            }
          })
        }

        onLocationSelect({
          address: place.formatted_address,
          lat,
          lng,
          city,
          province,
          postal_code,
          country,
        })
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error)
    }
  }

  if (!isLoaded) return <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" />

  return (
    <div className="space-y-4">
      <StandaloneSearchBox onLoad={onLoadSearchBox} onPlacesChanged={onPlacesChanged}>
        <input
          type="text"
          placeholder="Search location..."
          ref={inputRef}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || defaultCenter}
        zoom={13}
        onLoad={onLoadMap}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {markerPosition && <Marker position={markerPosition} draggable onDragEnd={onMarkerDragEnd} />}
      </GoogleMap>
    </div>
  )
}
