export type LocationData = {
    coords: {
      latitude: number; 
      longitude: number; 
      altitude?: number | null; 
      accuracy?: number | null;
      altitudeAccuracy?: number | null;
      heading?: number | null;
      speed?: number | null; 
    };
    timestamp?: number; 
  };
  