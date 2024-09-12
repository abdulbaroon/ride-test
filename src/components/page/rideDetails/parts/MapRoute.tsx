import React, { useEffect, useState } from "react";
import MapComponent from "@/components/module/MapComponent";
import { RootState } from "@/redux/store/store";
import useGpxToGeoJson from "@/shared/hook/useGpxToGeoJson";
import { ActivityRoute } from "@/shared/types/rideDetail.types";
import { useSelector } from "react-redux";
import { TbRoute, TbWindsock } from "react-icons/tb";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { CiSettings } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import Windy from "@/components/module/WIndy";
import {
  Checkbox,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import { PiDownload } from "react-icons/pi";
import { LuMapPin } from "react-icons/lu";
import { MdOutlineDirections } from "react-icons/md";
import Link from "next/link";
import { Item } from "@/shared/types/dashboard.types";

const MapRoute = () => {
  const [currentStyle, setCurrentStyle] = useState<string>(
    "mapbox://styles/mapbox/streets-v11"
  );
  const [showTraffic, setShowTraffic] = useState<boolean>(false);
  const [showBikeLanes, setShowBikeLanes] = useState<boolean>(false);
  const route = useSelector<RootState>(
    (state) => state.rideDetail.route
  ) as ActivityRoute;
  const rides = useSelector<RootState>(
    (state) => state.rideDetail.rides
  ) as Item;

  const {
    handleDownloadGPXFile,
    handleDownloadUrl,
    fetchAndOpenUrl,
    geoJSON,
    centerLongitude,
    centerLatitude,
    gpxFile,
  } = useGpxToGeoJson();
  const [activeComponent, setActiveComponent] = useState<string>("map");

  const downloadAndShareGpxFile = (gpxRoutePath: string) => {
    if (gpxRoutePath) {
      handleDownloadUrl(`${process.env.NEXT_PUBLIC_IMAGE_URL}${gpxRoutePath}`);
    }
  };

  useEffect(() => {
    if (route?.gpxRoutePath) {
      downloadAndShareGpxFile(route?.gpxRoutePath);
    }
  }, [route?.gpxRoutePath, route?.activityID]);

  useEffect(() => {
    let styleUrl = "mapbox://styles/mapbox/streets-v11";
    if (showTraffic && showBikeLanes) {
      styleUrl = "mapbox://styles/mapbox/traffic-day-v2";
    } else if (showTraffic) {
      styleUrl = "mapbox://styles/mapbox/traffic-day-v2";
    } else if (showBikeLanes) {
      styleUrl = "mapbox://styles/mapbox/traffic-day-v2";
    }
    setCurrentStyle(styleUrl);
  }, [showTraffic, showBikeLanes]);

  const toggleActiveComponent = (componentName: string) => {
    setActiveComponent(componentName);
  };

  const handleDownloadGPX = () => {
    if (gpxFile) {
      const blob = new Blob([gpxFile], { type: "application/gpx+xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `route_gpx_${rides.activityID}.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };
  return (
    <section id="map">
      <div className="bg-white min-h-40  border rounded-1lg p-8 space-y-5">
        {/* <div className="bg-[#eaf6fc] border border-[#c1e6f7] rounded-lg px-3 py-4">
          <p className="text-primaryText font-bold flex gap-2 items-center">
            <PiDownload className="text-lg" />
            download the route
          </p>
          <div className="flex gap-5 mt-2">
            <button
              className="w-full bg-[#d4e6ee] hover:bg-primaryDarkblue text-primaryDarkblue hover:text-white
            py-[10px] rounded-lg font-bold font-lg flex justify-center items-center gap-1"
            >
              <MdOutlineDirections />
              TCX
            </button>
            <button
              className="w-full bg-[#d4e6ee] hover:bg-primaryDarkblue text-primaryDarkblue hover:text-white
            py-[10px] rounded-lg font-bold font-lg flex justify-center items-center gap-1"
            >
              <TbWindsock />
              myWindsock
            </button>
          </div>
        </div> */}
        <div className=" flex gap-4">
          <button
            onClick={() => toggleActiveComponent("map")}
            className={`${
              activeComponent === "map" ? "text-primaryText" : "text-gray-600"
            } flex items-center gap-1 py-2 px-4 border bg-lightwhite rounded-lg`}
          >
            <TbRoute /> Route & Elevation
          </button>
          <button
            onClick={() => toggleActiveComponent("windy")}
            className={`${
              activeComponent === "windy" ? "text-primaryText" : "text-gray-600"
            } flex items-center gap-1 py-2 px-4 border bg-lightwhite rounded-lg`}
          >
            <TiWeatherWindyCloudy /> Wind & Weather
          </button>
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <button
                onClick={() => toggleActiveComponent("map")}
                className={`${
                  activeComponent === "options"
                    ? "text-primaryText"
                    : "text-gray-600"
                } flex items-center gap-1 py-2 px-4 border bg-lightwhite rounded-lg`}
              >
                <CiSettings /> Options <IoIosArrowDown />
              </button>
            </PopoverTrigger>
            <PopoverContent maxW={200}>
              <PopoverBody>
                <Stack flexDirection={"column"}>
                  <Checkbox
                    color={"gray.500"}
                    isChecked={showTraffic}
                    onChange={(e) => setShowTraffic(e.target.checked)}
                  >
                    Show Traffic
                  </Checkbox>
                  {/* <Checkbox color={"gray.500"} isChecked={showBikeLanes} onChange={(e) => setShowBikeLanes(e.target.checked)}>Show Bike Lanes</Checkbox>x  */}
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          {route.mapUrl && (
            <Link
              href={`${route.mapUrl}`}
              target="_blank"
              className="w-44 bg-lightwhite text-gray-600 
            py-[10px] rounded-lg font-medium font-lg flex justify-center items-center gap-1 h-fit"
            >
              <LuMapPin />
              Routes
            </Link>
          )}
          {gpxFile && (route.mapSourceID !=4 )&&(
            <button
              className="w-36 bg-lightwhite text-gray-600 
              py-[10px] rounded-lg font-medium font-lg flex justify-center items-center gap-1"
              onClick={handleDownloadGPX}
            >
              <PiDownload /> GPX
            </button>
          )}
        </div>
        <div className="">
          {activeComponent === "map" && (
            <MapComponent
              geoJSON={geoJSON}
              mapStyle={currentStyle}
              centerLatitude={rides.startLat}
              centerLongitude={rides.startLng}
            />
          )}
          {activeComponent === "windy" && <Windy />}
        </div>
      </div>
    </section>
  );
};

export default MapRoute;
