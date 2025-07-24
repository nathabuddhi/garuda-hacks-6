import { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";

import type { Libraries } from "@react-google-maps/api";
const libraries: Libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -6.2,
  lng: 106.8,
};

export default function MapWithSearch() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [distanceKm, setDistanceKm] = useState<number | null>(null); // ✅ moved here
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const testLocation = {
    lat: -6.222731,
    lng: 106.649666,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: libraries,
  });

  const onLoadMap = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    console.log("Map loaded successfully");
  };

  const onLoadSearchBox = (searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox;
    console.log("SearchBox loaded successfully");
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const location = places[0].geometry?.location;
      if (location) {
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setMarkerPosition(latLng);
        setSearchInput(places[0].formatted_address || "");
        map?.panTo(latLng);
        console.log("Marker position updated to:", latLng);
      }
    }
  };

  const onMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLatLng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(newLatLng);
      map?.panTo(newLatLng);
      await updateSearchInput(newLatLng);
      console.log("Marker dragged to:", newLatLng);
    }
  };

  const updateSearchInput = async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results?.[0]?.formatted_address) {
        setSearchInput(data.results[0].formatted_address);
        if (inputRef.current) {
          inputRef.current.value = data.results[0].formatted_address;
        }
      } else {
        setSearchInput("Address not found");
        console.error("Reverse geocoding failed:", data.status);
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      setSearchInput("Error fetching address");
    }
  };

  const addMyLocationButton = (map: google.maps.Map) => {
    const controlDiv = document.createElement("div");
    controlDiv.style.margin = "10px";

    const controlUI = document.createElement("button");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "none";
    controlUI.style.outline = "none";
    controlUI.style.width = "40px";
    controlUI.style.height = "40px";
    controlUI.style.borderRadius = "50%";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.padding = "0";
    controlUI.title = "Show Your Location";

    const controlText = document.createElement("div");
    controlText.style.margin = "10px";
    controlText.style.width = "20px";
    controlText.style.height = "20px";
    controlText.style.backgroundImage =
      "url('https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png')";
    controlText.style.backgroundSize = "180px 18px";
    controlText.style.backgroundPosition = "0 0";
    controlText.style.backgroundRepeat = "no-repeat";

    controlUI.appendChild(controlText);
    controlDiv.appendChild(controlUI);

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);

    controlUI.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          updateSearchInput(pos);
          setMarkerPosition(pos);
          map?.panTo(pos);
        });
      }
    });
  };

  useEffect(() => {
    if (!isLoaded || !map || !markerPosition) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: markerPosition,
        destination: testLocation,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
        avoidHighways: true,
      },
      (result, status) => {
        if (status === "OK" && result?.routes.length) {
          const meters = result.routes[0].legs[0].distance?.value || 0;
          const km = meters / 1000;
          setDistanceKm(km);
          console.log("Distance to test location:", km, "km");
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [markerPosition, map, isLoaded]);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY || ""}
      libraries={libraries}
      onError={(error) => console.error("LoadScript error:", error)}
    >
      <div style={{ padding: "10px", position: "relative", zIndex: 10 }}>
        <StandaloneSearchBox onLoad={onLoadSearchBox} onPlacesChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="Search location..."
            ref={inputRef}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "100%",
              height: "48px",
              padding: "0 16px",
              fontSize: "16px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || defaultCenter}
        zoom={13}
        onLoad={(map) => {
          setMap(map);
          addMyLocationButton(map);
          onLoadMap(map);
        }}
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
