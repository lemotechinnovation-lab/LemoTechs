// Google Maps type declarations
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
    }

    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(position: LatLngLiteral): void;
      setMap(map: Map | null): void;
    }

    interface MarkerOptions {
      position?: LatLngLiteral;
      map?: Map;
      title?: string;
    }
  }
}

export {};
