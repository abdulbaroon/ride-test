"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { twMerge } from 'tailwind-merge';

interface MapProps {
  centerLatitude: number;
  centerLongitude: number;
  geoJSON: any,
  className?: string,
}

const MapComponent: React.FC<MapProps> = ({ centerLatitude, centerLongitude, geoJSON, className }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
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
        new mapboxgl.Marker({ color: '#FF0000' }).setLngLat(endPoint).addTo(newMap);

        newMap.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#FF0000',
            'line-width': 4,
          },
        });
        const coordinates = geoJSON.features[0].geometry.coordinates;
        const bounds = coordinates.reduce((bounds: { extend: (arg0: [number, number]) => any; }, coord: [number, number]) => {
          return bounds.extend(coord as [number, number]);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        newMap.fitBounds(bounds, { padding: { top: 40, right: 40, bottom: 40, left: 40 } });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer: mapContainerRef.current! });
  }, [centerLatitude, centerLongitude, geoJSON, map]);

  return <div className={twMerge(`rounded-lg h-[40vh] w-full  `, className)} ref={mapContainerRef}  />;
};

export default MapComponent;
