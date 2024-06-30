"use client"
import { useEffect, useRef, useState } from "react";
import mapboxgl, { NavigationControl, FullscreenControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapBoxProps {
  center?: [number, number];
  initialZoom?: number;
  circle?: number;
}

const MapBox: React.FC<MapBoxProps> = ({ center = [28.5355, 77.3910], initialZoom = 2, circle = 1000 }) => {
  const [mapStyle, setMapStyle] = useState<string>("mapbox://styles/mapbox/streets-v11");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(center); // Initial marker position
  const [circleRadius, setCircleRadius] = useState<number>(circle); // Initial circle radius in meters
  const circleLayerRef = useRef<mapboxgl.Layer | null>(null); // Ref to store circle layer

  // Function to create a circle feature
  const createCircleFeature = (center: [number, number], radius: number) => {
    const steps = 64;
    const coords = { latitude: center[1], longitude: center[0] };
    const km = radius / 1000;
    const ret = [];
    const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < steps; i++) {
      theta = (i / steps) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);
      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);
    return {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [ret] }
    };
  };

  useEffect(() => {
    setCircleRadius(circle);
  }, [circle]);

  useEffect(() => {
    if (mapContainerRef.current) {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center,
        zoom: initialZoom,
        boxZoom: true,
        dragPan: true,
      });

      newMap.on('load', () => {
        setMap(newMap);

        newMap.addControl(new NavigationControl(), "bottom-right");
        newMap.addControl(new FullscreenControl(), "bottom-right");

        // Add initial marker
        new mapboxgl.Marker().setLngLat(markerPosition).addTo(newMap);

        // Add circle source and layer
        newMap.addSource('circle', {
          type: 'geojson',
          data: createCircleFeature(markerPosition, circleRadius) as any
        });

        newMap.addLayer({ 
          id: 'circle-layer',
          type: 'fill',
          source: 'circle',
          layout: {},
          paint: {
            'fill-color': '#007cbf',
            'fill-opacity': 0.3
          }
        });

        circleLayerRef.current = newMap.getLayer('circle-layer');
      });

      return () => {
        newMap.remove();
      };
    }                       
  }, [center, initialZoom, mapStyle]);

  useEffect(() => {
    if (map && map.isStyleLoaded()) {
      const marker = new mapboxgl.Marker().setLngLat(markerPosition).addTo(map);
      if (circleLayerRef.current && map.getSource('circle')) {
        (map.getSource('circle') as mapboxgl.GeoJSONSource).setData(createCircleFeature(markerPosition, circleRadius) as any);
      }

      return () => {
        marker.remove();
      };
    }
  }, [markerPosition, circleRadius, map]);

  useEffect(() => {
    setMarkerPosition(center);
  }, [center]);            

  return (
    <section className="bg-darkBlack">
      <div className="h-[30vh] w-11/12">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </section>
  );
};

export default MapBox;
