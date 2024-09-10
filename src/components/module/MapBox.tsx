"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl, { NavigationControl, FullscreenControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { twMerge } from "tailwind-merge";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapBoxProps {
  center?: [number, number];
  initialZoom?: number;
  circle?: number;
  outsideClick?: boolean;
  className?: string;
  setMarkerPos?: (cords: [number, number]) => void;
}

const MapBox: React.FC<MapBoxProps> = ({
  center = [0, 0],
  initialZoom = 2,
  circle = 10,
  className,
  outsideClick = true,
  setMarkerPos,
}) => {
  const [mapStyle, setMapStyle] = useState<string>(
    "mapbox://styles/mapbox/streets-v12"
  );
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const isValidCoordinates = (coords: [number, number]) =>
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number" &&
    !isNaN(coords[0]) &&
    !isNaN(coords[1]);

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
      geometry: { type: "Polygon", coordinates: [ret] },
    };
  };

  const fitCircleInView = (center: [number, number], radius: number) => {
    if (mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      const circleFeature = createCircleFeature(center, radius);

      circleFeature.geometry.coordinates[0].forEach((coord) => {
        bounds.extend(coord as [number, number]);
      });

      mapRef.current.fitBounds(bounds, {
        padding: { top: 20, right: 20, bottom: 20, left: 20 },
        maxZoom: 15,
        duration: 1000,
      });
    }
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center,
        zoom: initialZoom,
        boxZoom: true,
        dragPan: true,
        projection: "globe",
      });

      newMap.on("load", () => {
        mapRef.current = newMap;

        newMap.addControl(new NavigationControl(), "bottom-right");
        newMap.addControl(new FullscreenControl(), "bottom-right");

        markerRef.current = new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat(center)
          .addTo(newMap);

        newMap.addSource("circle", {
          type: "geojson",
          data: createCircleFeature(center, circle) as any,
        });

        newMap.addLayer({
          id: "circle-layer",
          type: "fill",
          source: "circle",
          layout: {},
          paint: {
            "fill-color": "#615c5c",
            "fill-opacity": 0.3,
          },
        });

        if (outsideClick) {
          newMap.on("click", (e) => {
            const { lng, lat } = e.lngLat;
            if (isValidCoordinates([lng, lat])) {
              setMarkerPosition([lng, lat]);
              if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
              } else {
                markerRef.current = new mapboxgl.Marker({ color: "#FF0000" })
                  .setLngLat([lng, lat])
                  .addTo(newMap);
              }
            }
          });
        }
        newMap.resize();
      });

      return () => {
        newMap.remove();
        mapRef.current = null;
        markerRef.current = null;
      };
    }
  }, [mapStyle, initialZoom]);

  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      const map = mapRef.current;
      if (markerRef.current) {
        markerRef.current.setLngLat(center);
      } else {
        markerRef.current = new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat(center)
          .addTo(map);
      }
      map.flyTo({ center, essential: true, zoom: initialZoom, duration: 3000 });
    }
  }, [center]);

  useEffect(() => {
    if (
      mapRef.current &&
      mapRef.current.isStyleLoaded() &&
      mapRef.current.getSource("circle")
    ) {
      const map = mapRef.current;
      (map.getSource("circle") as mapboxgl.GeoJSONSource).setData(
        createCircleFeature(center, circle) as any
      );
      fitCircleInView(center, circle);
    }
  }, [circle, center]);

  useEffect(() => {
    if (markerPosition) {
      setMarkerPos?.(markerPosition);
    }
  }, [markerPosition]);

  return (  
    <section className="bg-darkBlack">
      <div
        className={twMerge(
          "h-[30vh] w-full rounded-xl overflow-hidden relative",
          className
        )}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-full top-0 bottom-0 absolute"
        />
      </div>
    </section>
  );
};

export default MapBox;
