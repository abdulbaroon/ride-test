"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { RootState } from "@/redux/store/store";
import { Explore } from "@/shared/types/dashboard.types";
import { formatDate, parseISO } from "date-fns";
import "mapbox-gl/dist/mapbox-gl.css";
import { MdOutlineMyLocation } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { circleIcon, rectangleIcon, routePlaceHolder } from "@/assets";
import { IMAGE_URl } from "@/constant/appConfig";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapBoxModalProps {
  profile: { homeBaseLng: number; homeBaseLat: number } | any;
}

const MapBoxModal: React.FC<MapBoxModalProps> = ({ profile }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(
    "mapbox://styles/mapbox/streets-v12"
  );
  const [popupInfo, setPopupInfo] = useState<Explore | null | any>(null);
  const [showRides, setShowRides] = useState(true);
  const [showFriends, setShowFriends] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);

  const exploreDat = useSelector<RootState, Explore[]>(
    (state) => state.dashboard.expoloreData
  );

  const exploreData = exploreDat.filter(
    (flr) =>
      (showRides && flr.exploreType === "Ride") ||
      (showFriends && flr.exploreType === "Friend")
  );

  // Memoized GeoJSON data for clustering
  const geoJsonData: any = useMemo(
    () => ({
      type: "FeatureCollection",
      features: exploreData.map((data) => ({
        type: "Feature",
        properties: {
          id: data.entityID,
          entityName: data.entityName,
          entityID: data.entityID,
          exploreType: data.exploreType,
          entityDate: data.entityDate,
        },
        geometry: {
          type: "Point",
          coordinates: [data.entityLng || 0, data.entityLat || 0],
        },
      })),
    }),
    [exploreData]
  );

  // Fetch current location using the Geolocation API
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation([
          position.coords.longitude,
          position.coords.latitude,
        ]);
        mapRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 14,
        });
      });
    }
  };

  const handleGoToHome = () => {
    mapRef.current?.flyTo({
      center: [profile.homeBaseLng, profile.homeBaseLat],
      zoom: 14,
    });
  };

  useEffect(() => {
    if (!mapInitialized && mapContainerRef.current) {

      let initialCenter: [number, number] = [0, 0];

      // Check if profile data is available
      if (profile && profile?.homeBaseLng && profile?.homeBaseLat) {
        initialCenter = [profile.homeBaseLng, profile.homeBaseLat];
      } else if (navigator.geolocation) {
        // If profile data is not available, get current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initialCenter = [
              position.coords.longitude,
              position.coords.latitude,
            ];
          },
          () => {
            // Handle the case when geolocation fails
            initialCenter = initialCenter; // Fallback to default center if geolocation fails
          }
        );
      }

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: currentStyle,
        center: initialCenter,
        zoom: 10,
        projection: "globe",
      });

      map.on("load", () => {
        setMapInitialized(true);

        // Load custom images (circle and square)
        map.loadImage(circleIcon.src, (error, image) => {
          if (error) throw error;
          map.addImage("circle", image as ImageBitmap);
        });

        map.loadImage(rectangleIcon.src, (error, image) => {
          if (error) throw error;
          map.addImage("square", image as ImageBitmap);
        });

        // Add a clustered GeoJSON source
        map.addSource("exploreData", {
          type: "geojson",
          data: geoJsonData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Add cluster circles
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "exploreData",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#ff0000",
              100,
              "#ff0000",
              750,
              "#ff0000",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
            "circle-stroke-width": 6,
            "circle-stroke-color": "#ff8080",
          },
        });

        // Add cluster count labels
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "exploreData",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });

        // Add unclustered points (individual markers)
        map.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "exploreData",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": [
              "case",
              ["==", ["get", "exploreType"], "Ride"],
              "circle",
              "square",
            ],
            "icon-size": 0.28,
          },
        });

        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          }) as any;
          const clusterId = features[0].properties?.cluster_id;

          (map.getSource("exploreData") as any).getClusterExpansionZoom(
            clusterId,
            (err: any, zoom: number) => {
              if (err) return;

              map.easeTo({
                center: features[0]?.geometry?.coordinates,
                zoom,
              });
            }
          );
        });

        // Click event for unclustered points
        map.on("click", "unclustered-point", (e) => {
          const feature = e.features?.[0] as any;
          const coordinates = feature?.geometry.coordinates.slice();
          const properties = feature?.properties;
          const mag = e.features?.[0].properties;

          setPopupInfo({
            entityName: properties.entityName,
            entityID: properties.entityID,
            exploreType: properties.exploreType,
            entityDate: properties.entityDate,
            entityLng: coordinates[0],
            entityLat: coordinates[1],
          });
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          if (mag) {
            const popup = new mapboxgl.Popup({
              closeOnClick: true,
            })
              .setLngLat(coordinates)
              .setHTML(
                `<div style="background-color: white; padding: 0.5rem; color: black; width: 13rem; margin-top: 0.75rem;">
                <div class="flex items-start flex-col">
                  ${
                    mag.exploreType === "Ride"
                      ? `<img class="w-full rounded mb-2 h-36" 
                      src="${IMAGE_URl}/ogmaps/ogmap_${mag.entityID}.png"
                      onerror="this.onerror=null; this.src='${routePlaceHolder.src}';" alt="img" />`
                      : `<img class="w-full rounded mb-2 h-36" 
                      src="${IMAGE_URl}/useravatar/pfimg_${mag.entityID}.png"
                      onerror="this.onerror=null; this.src='${IMAGE_URl}/useravatar/defaultavatar.jpg';" alt="img" />`
                  }
                  <h4 class="text-base font-semibold text-gray-700 ms-2">${
                    mag.entityName
                  }</h4>
                  <p class="text-gray-500 text-sm ms-2">
                    ${formatDate(parseISO(mag.entityDate), "EEE, MMM dd, yyyy")}
                  </p>
                </div>
                <div class="w-full flex justify-center mt-5">
                  <a class="px-6 py-[5px] bg-blue-500 font-bold text-white rounded-sm" target="_blank" href="${
                    mag.exploreType === "Ride"
                      ? `/ride/${mag.entityID}`
                      : `/friend/${mag.entityID}`
                  }">
                    ${mag.exploreType === "Ride" ? "View Ride" : "View Friend"}
                  </a>
                </div>
              </div>`
              )
              .addTo(map);
            return () => {
              popup.remove();
            };
          }
        });

        // const spiderfy = new Spiderfy(map, {
        //   onLeafClick: (f:any) => console.log(f),
        //   minZoomLevel: 12,
        //   zoomIncrement: 2,
        // });

        // // enable spiderfy on a layer
        // // IMPORTANT: the layer must have a cluster source
        // spiderfy.applyTo("unclustered-point");

        map.addControl(new mapboxgl.FullscreenControl(), "top-left");
        map.addControl(new mapboxgl.NavigationControl(), "top-left");
      });

      mapRef.current = map;
    } else if (mapInitialized && mapRef.current) {
      const source = mapRef.current.getSource(
        "exploreData"
      ) as mapboxgl.GeoJSONSource;

      if (source) {
        source.setData(geoJsonData);
      }
    }
  }, [profile, mapInitialized, geoJsonData]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: `calc(100vh - 100px)`,
          position: "relative",
        }}
      />

      <div className="absolute top-2 left-0 right-0 px-4 py-2 rounded-md bg-white mx-auto w-80 flex items-center justify-between">
        <div className=" flex gap-2">
          <button
            className={`text-sm rounded-md  px-2 py-1 border border-primaryDarkblue ${
              showRides
                ? "bg-primaryDarkblue text-white"
                : "bg-white  text-primaryDarkblue"
            }`}
            onClick={() => setShowRides((prev) => !prev)}
          >
            Rides
          </button>
          <button
            className={`text-sm rounded-md  px-2 py-1 border border-primaryDarkblue ${
              showFriends
                ? "bg-primaryDarkblue text-white"
                : "bg-white  text-primaryDarkblue"
            }`}
            onClick={() => setShowFriends((prev) => !prev)}
          >
            Friends
          </button>
        </div>

        <div className="flex justify-center items-center gap-1">
          <div
            className="text-xl bg-primaryDarkblue text-white rounded-md p-1 cursor-pointer"
            onClick={handleGetCurrentLocation}
          >
            <MdOutlineMyLocation />
          </div>
          {profile && (
            <div
              className="text-xl bg-red-600 text-white rounded-md p-1 cursor-pointer"
              onClick={handleGoToHome}
            >
              <IoMdHome />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapBoxModal;
