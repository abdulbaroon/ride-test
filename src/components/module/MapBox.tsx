// "use client"
// import { useEffect, useRef, useState } from "react";
// import mapboxgl, { NavigationControl, FullscreenControl } from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { twMerge } from "tailwind-merge";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

// interface MapBoxProps {
//   center?: [number, number];
//   initialZoom?: number;
//   circle?: number;
//   className?:string;
// }

// const MapBox: React.FC<MapBoxProps> = ({ center = [0,0], initialZoom = 2, circle = 1000, className}) => {
//   const [mapStyle, setMapStyle] = useState<string>("mapbox://styles/mapbox/streets-v11");
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const [map, setMap] = useState<mapboxgl.Map | null>(null);
//   const circleLayerRef = useRef<mapboxgl.Layer | null>(null);

//   const createCircleFeature = (center: [number, number], radius: number) => {
//     const steps = 64;
//     const coords = { latitude: center[1], longitude: center[0] };
//     const km = radius / 1000;
//     const ret = [];
//     const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
//     const distanceY = km / 110.574;

//     let theta, x, y;
//     for (let i = 0; i < steps; i++) {
//       theta = (i / steps) * (2 * Math.PI);
//       x = distanceX * Math.cos(theta);
//       y = distanceY * Math.sin(theta);
//       ret.push([coords.longitude + x, coords.latitude + y]);
//     }
//     ret.push(ret[0]);
//     return {
//       type: "Feature",
//       geometry: { type: "Polygon", coordinates: [ret] }
//     };
//   };

//   useEffect(() => {
//     if (mapContainerRef.current) {
//       const newMap = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: mapStyle,
//         center,
//         zoom: initialZoom,
//         boxZoom: true,
//         dragPan: true,
//       });

//       newMap.on('load', () => {
//         setMap(newMap);

//         newMap.addControl(new NavigationControl(), "bottom-right");
//         newMap.addControl(new FullscreenControl(), "bottom-right");

//         new mapboxgl.Marker({ color: '#FF0000' }).setLngLat(center).addTo(newMap);

//         newMap.addSource('circle', {
//           type: 'geojson',
//           data: createCircleFeature(center, circle) as any
//         });

//         newMap.addLayer({ 
//           id: 'circle-layer',
//           type: 'fill',
//           source: 'circle',
//           layout: {},
//           paint: {
//             'fill-color': '#615c5c',
//             'fill-opacity': 0.3
//           }
//         });

//         circleLayerRef.current = newMap.getLayer('circle-layer');
//       });

//       return () => {
//         newMap.remove();
//       };
//     }                       
//   }, [center, initialZoom, mapStyle]);

//   useEffect(() => {                               
//     if (map && map.isStyleLoaded()) {
//       const existingMarker = document.querySelector('.mapboxgl-marker');
//       if (existingMarker) {
//         existingMarker.remove();
//       }

//       const marker = new mapboxgl.Marker({ color: '#FF0000' }).setLngLat(center).addTo(map);

//       if (circleLayerRef.current && map.getSource('circle')) {
//         (map.getSource('circle') as mapboxgl.GeoJSONSource).setData(createCircleFeature(center, circle) as any);
//       }

//       return () => {
//         marker.remove();
//       };
//     }
//   }, [center, circle, map]);

//   return (
//     <section className="bg-darkBlack">
//       <div className={twMerge("h-[30vh] w-full rounded-xl overflow-hidden",className)}>
//         <div ref={mapContainerRef} className="w-full h-full" />
//       </div>
//     </section>
//   );
// };

// export default MapBox;

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
  className?: string;
}

const MapBox: React.FC<MapBoxProps> = ({
  center = [0, 0],
  initialZoom = 2,
  circle = 1000,
  className,
}) => {
  const [mapStyle, setMapStyle] = useState<string>(
    "mapbox://styles/mapbox/streets-v11"
  );
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const circleLayerRef = useRef<mapboxgl.Layer | null>(null);

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

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center,
        zoom: initialZoom,
        boxZoom: true,
        dragPan: true,
      });

      newMap.on("load", () => {
        mapRef.current = newMap;

        newMap.addControl(new NavigationControl(), "bottom-right");
        newMap.addControl(new FullscreenControl(), "bottom-right");

        new mapboxgl.Marker({ color: "#FF0000" }).setLngLat(center).addTo(newMap);

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

        circleLayerRef.current = newMap.getLayer("circle-layer");
      });

      return () => {
        newMap.remove();
        mapRef.current = null;
      };
    }
  }, [mapStyle, initialZoom]);

  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      const map = mapRef.current;
      const existingMarker = document.querySelector(".mapboxgl-marker");
      if (existingMarker) {
        existingMarker.remove();
      }

      const marker = new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat(center)
        .addTo(map);

      if (circleLayerRef.current && map.getSource("circle")) {
        (map.getSource("circle") as mapboxgl.GeoJSONSource).setData(
          createCircleFeature(center, circle) as any
        );
      }

      return () => {
        marker.remove();
      };
    }
  }, [center, circle]);  
      
  return (
    <section className="bg-darkBlack">
      <div className={twMerge("h-[30vh] w-full rounded-xl overflow-hidden", className)}>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </section>
  );
};

export default MapBox;

