"use client"
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

interface MapProps {
  centerLatitude: number;
  centerLongitude: number;
  geoJSON: GeoJSON.FeatureCollection<any>;
}

const MapComponent: React.FC<MapProps> = ({ centerLatitude, centerLongitude, geoJSON }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string
    const initializeMap = ({ setMap, mapContainer }: { setMap: Function; mapContainer: HTMLDivElement }) => {
      const newMap = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [centerLongitude, centerLatitude],
        zoom: 11,
      });

      newMap.on('load', () => {
        setMap(newMap);
        newMap.addSource('route', {
          type: 'geojson',
          data: geoJSON,
        });

        const startPoint = geoJSON.features[0].geometry.coordinates[0] as LngLatLike;
        new mapboxgl.Marker().setLngLat(startPoint).addTo(newMap);

        const endPoint = geoJSON.features[0].geometry.coordinates[
          geoJSON.features[0].geometry.coordinates.length - 1
        ] as LngLatLike;
        new mapboxgl.Marker({ color: '#FF6347' }).setLngLat(endPoint).addTo(newMap);

        newMap.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#888',
            'line-width': 8,
          },
        });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer: mapContainerRef.current! });
  }, [centerLatitude, centerLongitude, geoJSON, map]);

  return <div className="rounded-lg" ref={mapContainerRef} style={{ height: '40vh', width: '100%' }} />;
};

export default MapComponent;
