"use client";
import { useEffect, useState } from "react";
interface Location {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export const useGetCurrentLocation = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
  });
  console.log(location);
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else {
        setLocation((prev) => ({
          ...prev,
          error: "Geolocation permission is not granted.",
        }));
      }
    });

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
      }));
    };
  }, []);

  return location;
};
