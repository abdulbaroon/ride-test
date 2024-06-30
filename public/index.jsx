"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl, { NavigationControl, FullscreenControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoLayers } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { LiaMousePointerSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const Map = ({ center = [0, 0], initialZoom = 2 }) => {
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v11"
  );
  const [mapSuggestion, setMapSuggestion] = useState(false);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const router = useRouter();

  const [isPanningEnabled, setIsPanningEnabled] = useState(true);

  useEffect(() => {
    if (mapContainerRef.current) {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center,
        zoom: initialZoom,
        boxZoom: isPanningEnabled,
        dragPan: isPanningEnabled,
      });

      setMap(newMap);

      const navControl = new NavigationControl();
      const fullScreen = new FullscreenControl();
      newMap.addControl(navControl, "bottom-right");
      newMap.addControl(fullScreen, "bottom-right");

      return () => {
        newMap.remove();
      };
    }
  }, [center, initialZoom, mapStyle, isPanningEnabled]);

  const toggleMapSelection = (mode) => {
    if (mode === "map") {
      setMapStyle("mapbox://styles/mapbox/streets-v11");
    } else {
      setMapStyle("mapbox://styles/mapbox/satellite-v9");
    }
    setMapSuggestion(false);
  };

  const togglePanning = () => {
    setIsPanningEnabled(!isPanningEnabled);
    if (map) {
      map.boxZoom.enable();
      map.dragPan.enable();
    } else {
      map.boxZoom.disable();
      map.dragPan.disable();
    }
  };

  useEffect(() => {
    if (map) {
      if (isPanningEnabled) {
        map.boxZoom.enable();
        map.dragPan.enable();
      } else {
        map.boxZoom.disable();
        map.dragPan.disable();
      }
    }
  }, [isPanningEnabled, map]);

  return (
    <section className="bg-darkBlack">
      <div className="mx-5">
        <div className="py-2 flex justify-between border-r-2 border-l-2 border-borderBrown">
          <RxCross2 className="text-[#8D97A0] text-lg cursor-pointer ms-4" />
          <h1 className="text-[#37646D]">Mappa</h1>
          <div className="flex gap-5 me-4">
            <div className="relative">
              <IoLayers
                onClick={() => setMapSuggestion((prev) => !prev)}
                className="text-[#8D97A0] text-lg cursor-pointer"
              />
              {mapSuggestion && (
                <div className="absolute top-5 text-white bg-black z-[9999] w-[110px] px-4 py-4">
                  <div
                    onClick={() => toggleMapSelection("map")}
                    className="text-14 cursor-pointer hover:text-[#37646D]"
                  >
                    Map
                  </div>
                  <div
                    onClick={() => toggleMapSelection("satellite")}
                    className="text-14 cursor-pointer hover:text-[#37646D]"
                  >
                    Satellite
                  </div>
                </div>
              )}
            </div>
            <IoIosSettings className="text-[#8D97A0] text-lg cursor-pointer" />
            <LiaMousePointerSolid
              onClick={togglePanning}
              className={`text-lg cursor-pointer ${
                isPanningEnabled ? "text-[#8D97A0]" : "text-red-500"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="h-[86.5vh] mx-5">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </section>
  );
};
