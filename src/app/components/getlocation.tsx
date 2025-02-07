import { useEffect, useState } from "react";
import { useGetCurrentLocation } from "./modal/location";

const LocationPage = () => {
  // State to store latitude, longitude, and error message
  const location = useGetCurrentLocation();

  return (
    <div>
      <h1>User Location</h1>

      <div>
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
        <p>Error: {location.error}</p>
      </div>
    </div>
  );
};

export default LocationPage;
