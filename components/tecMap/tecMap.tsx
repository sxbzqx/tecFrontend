'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const myBounds: [L.LatLngTuple, L.LatLngTuple] = [
  [42.875067, 74.648742],
  [42.868134, 74.667744]
];

function SetBounds() {
  const map = useMap();
  map.fitBounds(myBounds);
  return null;
}

interface TecMapProps {
  height?: number | string;
}

export default function TecMap({ height = 400 }: TecMapProps) {
  return (
    <MapContainer
      style={{ height, width: "100%" }}
      maxBounds={myBounds}
      minZoom={10}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SetBounds />
    </MapContainer>
  );
}
