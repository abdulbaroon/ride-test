"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { twMerge } from 'tailwind-merge';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

interface MapProps {
  centerLatitude: number;
  centerLongitude: number;
  geoJSON: any;
  className?: string;
}

const MapComponent: React.FC<MapProps> = ({ centerLatitude = 0, centerLongitude = 0, geoJSON, className }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [highlightedPoint, setHighlightedPoint] = useState<number | null>(null);
  const [distanceData, setDistanceData] = useState<number[]>([]);
  const [elevationData, setElevationData] = useState<number[]>([]);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    const initializeMap = ({ setMap, mapContainer }: { setMap: Function; mapContainer: HTMLDivElement }) => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [centerLongitude, centerLatitude],
        zoom: 11,
      });

      mapInstance.on('load', () => {

        if (geoJSON && geoJSON.features && geoJSON.features.length > 0) {

          mapInstance.addSource('route', {
            type: 'geojson',
            data: geoJSON,
          });

          mapInstance.addLayer({
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

          mapInstance.addLayer({
            id: 'arrow',
            type: 'symbol',
            source: 'route',
            layout: {
              'symbol-placement': 'line',
              'symbol-spacing': 100,
              'icon-image': 'arrow',
              'icon-size': 10,
            },
            paint: {
              'icon-color': '#FF0000',
            },
          });

          const coordinates = geoJSON.features[0].geometry.coordinates;
          if (coordinates.length > 0) {
            const bounds = coordinates.reduce((bounds: { extend: (arg0: [number, number]) => any; }, coord: [number, number]) => {
              return bounds.extend(coord as [number, number]);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

            mapInstance.fitBounds(bounds, { padding: { top: 40, right: 40, bottom: 40, left: 40 } });

            let totalDistance = 0;
            const distances = [0];
            const elevations = [];

            for (let i = 1; i < coordinates.length; i++) {
              const [lng1, lat1] = coordinates[i - 1];
              const [lng2, lat2, ele] = coordinates[i];

              const toRad = (x: number) => (x * Math.PI) / 180;
              const R = 3958.8;

              const dLat = toRad(lat2 - lat1);
              const dLng = toRad(lng2 - lng1);

              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);

              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const distance = R * c;

              totalDistance += distance;
              distances.push(totalDistance);
              elevations.push(ele ? ele * 3.28084 : 0);
            }

            setDistanceData(distances);
            setElevationData(elevations);
          } else {
            console.warn("No coordinates found in GeoJSON");
          }
        } else {
          console.warn("Invalid GeoJSON data");
        }
      });

      return () => {
        if (mapInstance) {
          mapInstance.remove();
        }
      };
    };

    if (mapContainerRef.current && !map) {
      initializeMap({ setMap, mapContainer: mapContainerRef.current });
    }

  }, [centerLatitude, centerLongitude, geoJSON, map]);

  const handlePointHighlight = useCallback((index: number | null) => {
    if (geoJSON && geoJSON.features && geoJSON.features.length > 0 && map) {
      if (index !== null && geoJSON.features[0].geometry.coordinates[index]) {
        const coordinates = geoJSON.features[0].geometry.coordinates[index];
        map.flyTo({ center: coordinates });

        if (marker) {
          marker.remove();
        }

        const newMarker = new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat(coordinates)
          .addTo(map);
        setMarker(newMarker);

        setHighlightedPoint(index);
      } else {
        // Remove marker if index is null
        if (marker) {
          marker.remove();
          setMarker(null);
        }
        setHighlightedPoint(null);
      }
    }
  }, [geoJSON, map, marker]);

  return (
    <div className={twMerge(`rounded-lg h-full w-full flex flex-col`, className)}>
      <div ref={mapContainerRef} className='h-[40vh] w-full relative' />
      <div className='h-[30vh] w-full'>
        <Line
          data={{
            labels: distanceData.map((dist) => dist.toFixed(2)),
            datasets: [{
              label: 'Elevation (ft)',
              data: elevationData,
              borderColor: '#FF0000',
              backgroundColor: 'rgba(255, 255, 255, 0)',
              pointBackgroundColor: elevationData.map((_, index) => highlightedPoint === index ? '#FF0000' : 'rgba(0, 0, 0, 0)'),
              pointBorderColor: elevationData.map((_, index) => highlightedPoint === index ? '#FF0000' : 'rgba(0, 0, 0, 0)'),
            }]
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Elevation (ft)'
                }
              },
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Distance (mi)'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y.toFixed(2);
                    }
                    return label;
                  },
                  title: function (context) {
                    const index = context[0].dataIndex;
                    return `Point ${index}`;
                  }
                }
              }
            },
            onHover: (event, chartElement) => {
              if (chartElement.length > 0) {
                const index = chartElement[0].index;
                handlePointHighlight(index);
              } else {
                handlePointHighlight(null); 
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default MapComponent;
