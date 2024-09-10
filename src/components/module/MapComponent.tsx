"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { twMerge } from "tailwind-merge";

interface MapProps {
  centerLatitude?: number;
  centerLongitude?: number;
  geoJSON?: any;
  className?: string;
  mapStyle?: string;
}

const MapComponent: React.FC<MapProps> = ({
  centerLatitude = 29.7600771,
  centerLongitude = -95.37011079999999,
  geoJSON,
  className,
  mapStyle = "mapbox://styles/mapbox/streets-v12",
}) => {
  const [currentStyle, setCurrentStyle] = useState(mapStyle);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    setCurrentStyle(mapStyle);
  }, [mapStyle]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
    let mapInstance: mapboxgl.Map | null | any = null;

    const initializeMap = ({
      setMap,
      mapContainer,
    }: {
      setMap: Function;
      mapContainer: HTMLDivElement;
    }) => {
      mapInstance = new mapboxgl.Map({
        container: mapContainer,
        style: currentStyle,
        center: [centerLongitude, centerLatitude],
        zoom: 11,
      });

      mapInstance.on("load", () => {
        setMap(mapInstance);
        if (geoJSON && geoJSON.features?.length > 0) {
          mapInstance.addSource("route", {
            type: "geojson",
            data: geoJSON,
          });

          const coordinates = geoJSON.features[0].geometry.coordinates;

          if (coordinates && coordinates.length > 0) {
            const startPoint = coordinates[0] as LngLatLike;
            const endPoint = coordinates[coordinates.length - 1] as LngLatLike;

            new mapboxgl.Marker().setLngLat(startPoint).addTo(mapInstance);

            new mapboxgl.Marker({ color: "#FF0000" })
              .setLngLat(endPoint)
              .addTo(mapInstance);

            mapInstance.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#FF0000",
                "line-width": 4,
              },
            });
            const bounds = coordinates.reduce(
              (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
                return bounds.extend(coord as [number, number]);
              },
              new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
            );

            mapInstance.fitBounds(bounds, {
              padding: { top: 40, right: 40, bottom: 40, left: 40 },
            });
          }
        } else {
          new mapboxgl.Marker({ color: "#FF0000" }).setLngLat([centerLongitude, centerLatitude]).addTo(mapInstance);
        }

        const mapStyleSwitcher = new MapStyleSwitcher(mapInstance);
        mapInstance.addControl(mapStyleSwitcher, "top-left");
      });
    };

    if (!mapInstance)
      initializeMap({ setMap, mapContainer: mapContainerRef.current! });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    };
  }, [centerLatitude, centerLongitude, geoJSON, currentStyle]);

  class MapStyleSwitcher {
    map: mapboxgl.Map;

    constructor(map: mapboxgl.Map) {
      this.map = map;
    }

    onAdd(map: mapboxgl.Map) {
      this.map = map;
      const container = document.createElement("div");
      container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
      container.innerHTML = `
        <button class="mapboxgl-ctrl-icon" aria-label="Switch to Satellite View" title="Switch to Satellite View">
          <span class="mapboxgl-ctrl-icon" style="
          background-size: 59%;
          background-image : url('https://img.freepik.com/premium-vector/from-space-earth-satellite-icon-logo_706143-4018.jpg');"></span>
        </button>
        <button class="mapboxgl-ctrl-icon" aria-label="Switch to Simple View" title="Switch to Simple View">
          <span class="mapboxgl-ctrl-icon" style="
           background-size: 59%;
          background-image: url('https://img.freepik.com/premium-vector/black-pin-location_1305565-84.jpg');"></span>
        </button>
      `;

      container.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          const newStyle = button.title.includes("Satellite")
            ? "mapbox://styles/mapbox/satellite-streets-v12"
            : "mapbox://styles/mapbox/streets-v12";
          this.map.setStyle(newStyle);
          setCurrentStyle(newStyle);
        });
      });

      return container;
    }

    onRemove() {
      (this.map as any) = null!;
    }
  }

  return (
    <div
      className={twMerge(`rounded-lg h-[50vh] w-full`, className)}
      ref={mapContainerRef}
    />
  );
};

export default MapComponent;
