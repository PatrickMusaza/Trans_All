import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/lib/supabase';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Movement {
  id: string;
  driver_id: string;
  vehicle_id: string;
  current_location: {
    lat: number;
    lng: number;
  };
  status: string;
  timestamp: string;
}

const VehicleMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const initializeMap = () => {
    if (!mapContainer.current || !apiKey) return;

    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.0619, -1.9403], // Kigali, Rwanda
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    setIsMapInitialized(true);

    // Fetch and display vehicle locations
    fetchVehicleLocations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('movements')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'movements',
        },
        () => {
          fetchVehicleLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchVehicleLocations = async () => {
    if (!map.current) return;

    const { data, error } = await supabase
      .from('movements')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching movements:', error);
      return;
    }

    // Group by vehicle_id to get latest position
    const latestMovements = new Map<string, Movement>();
    data?.forEach((movement) => {
      if (!latestMovements.has(movement.vehicle_id)) {
        latestMovements.set(movement.vehicle_id, movement as Movement);
      }
    });

    // Clear old markers
    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    // Add new markers
    latestMovements.forEach((movement) => {
      if (movement.current_location?.lat && movement.current_location?.lng) {
        const el = document.createElement('div');
        el.className = 'vehicle-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDg4ZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNSAxMUwyIDE2bDcgM3YtN00xOSAxMUwyMiAxNmwtNyAzdi03Ii8+PHBhdGggZD0iTTcgN1YzTTE3IDdWMyIvPjxwYXRoIGQ9Ik01IDdsNS0xaDRsNSAxdjRsLTUgMUg5bC01LTFWN1oiLz48L3N2Zz4=)';
        el.style.backgroundSize = 'contain';
        el.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([movement.current_location.lng, movement.current_location.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <p class="font-semibold">Vehicle ID: ${movement.vehicle_id.slice(0, 8)}</p>
                <p class="text-sm">Status: ${movement.status || 'Active'}</p>
                <p class="text-xs text-muted-foreground">${new Date(movement.timestamp).toLocaleString()}</p>
              </div>`
            )
          )
          .addTo(map.current!);

        markers.current[movement.vehicle_id] = marker;
      }
    });
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Live Vehicle Tracking</h2>
      {!isMapInitialized ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-key">Mapbox Access Token</Label>
            <Input
              id="mapbox-key"
              type="text"
              placeholder="Enter your Mapbox public token"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Get your token from{' '}
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Mapbox Dashboard
              </a>
            </p>
          </div>
          <button
            onClick={initializeMap}
            disabled={!apiKey}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            Initialize Map
          </button>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-[500px] rounded-lg" />
      )}
    </Card>
  );
};

export default VehicleMap;
