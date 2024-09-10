"use client";

import { getWeather, setActivityRoster } from "@/redux/slices/rideDetailsSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Item } from "@/shared/types/dashboard.types";
import {
  ActivityRoute,
  WeatherForecast,
} from "@/shared/types/rideDetail.types";
import { formatRideData, hasDatePassed } from "@/shared/util/format.util";
import { Radio, RadioGroup, Stack, Tag, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  BsCalendar4Event,
  BsClock,
  BsEye,
  BsFillCloudLightningRainFill,
} from "react-icons/bs";
import { CiFlag1 } from "react-icons/ci";
import { FaTemperatureLow } from "react-icons/fa";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { IoPricetagsOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { PiFlagCheckered, PiWindBold } from "react-icons/pi";
import { RiSpeedUpLine } from "react-icons/ri";
import { formatDates, formatTime } from "@/shared/util/dateFormat.util";
import { FaRegFileLines } from "react-icons/fa6";
import { newDate } from "react-datepicker/dist/date_utils";
import { User } from "@/shared/types/account.types";
import { CgSpinner } from "react-icons/cg";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const radioButtons: Array<{ id: string; label: string }> = [
  {
    id: "A",
    label: "A Group",
  },
  {
    id: "B",
    label: "B Group",
  },
  {
    id: "C",
    label: "C Group",
  },
];

const RideDetail = () => {
  const [loading, setLoading] = useState<Number | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const rides = useSelector<RootState>(
    (state) => state.rideDetail.rides
  ) as Item;
  const user = useSelector<RootState>((state) => state.auth.user) as User;
  const weatherForecast = useSelector<RootState>(
    (state) => state.rideDetail.weather
  ) as WeatherForecast;
  const route = useSelector<RootState>(
    (state) => state.rideDetail.route
  ) as ActivityRoute;

  const formatedRide = formatRideData(rides);
  const handleJoinRoster = async (id: number) => {
    const payload = {
      activityID: formatedRide.activityID,
      createdBy: user?.id,
      createdDate: new Date().toISOString(),
      modifiedBy: user?.id,
      modifiedDate: new Date().toISOString(),
      responseTypeID: id,
      groupLevel: group || null,
    };
    setLoading(id);
    const response = await dispatch(setActivityRoster(payload));
    if (setActivityRoster.fulfilled.match(response)) {
      toast.success("Thanks for responding to the ride!");
    }
    setLoading(null);
  };

  return (
    <section id="details">
      <div className="bg-white min-h-40 border rounded-lg">
        <div className="p-8">
          <div className="flex gap-2 border-b pb-4">
            <div className="w-20 h-[75px] border overflow-hidden rounded-xl">
              <div>
                <p className="text-center bg-primaryText text-white border-b uppercase">
                  {formatedRide?.startDate &&
                    formatDates(formatedRide?.startDate, "EEE")}
                </p>
              </div>
              <p className="text-4xl text-center text-gray-600 mt-1">
                {formatDates(formatedRide?.startDate, "d")}
              </p>
            </div>
            <div>
              <p className="text-xl font-bold">{formatedRide.rideName}</p>
              <p className="font-semibold text-sm text-gray-600">
                {formatedRide.isPrivate ? "Private Ride" : "Public Ride"}
              </p>
              <p className="flex items-center gap-1 text-gray-600 text-lg">
                <BsEye /> {formatedRide.rideViews}
              </p>
            </div>
          </div>
          <div className="py-4 border-b">
            <p className="font-bold">
              Road on Great Road{" "}
              <span className="font-medium">Community Ride</span>
            </p>
            <div className="flex mt-1">
              <div className="flex items-center gap-2 text-gray-700 pe-4 border-e">
                <BsCalendar4Event className="text-sm text-gray-500" />
                <p>{formatDates(formatedRide.startDate)}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-700 px-4 py-1 border-e">
                <BsClock className="text-gray-500" />
                <p>
                  {formatTime(formatedRide.startTime)}
                  {" - "}
                  {formatTime(formatedRide.endTime)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-700 ps-4">
                <RiSpeedUpLine className="text-lg text-gray-500" />
                <p>
                  {formatedRide.distance} miles @ {formatedRide.avgSpeed} mph
                </p>
              </div>
            </div>
          </div>
          <div className="py-4 border-b flex gap-2">
            <div className="w-6/12 border-e">
              <div className="flex items-center gap-1">
                <CiFlag1 className="text-green-600 text-lg" />
                <p className="text-gray-500">start location</p>
              </div>
              <div className="w-40 my-1">
                <Link
                  href={`http://maps.google.com/maps?daddr=${formatedRide?.startLat},${formatedRide?.startLng}`}
                  target="_blank"
                  className="text-primaryText"
                >
                  {formatedRide.startAddress}
                </Link>
              </div>
              <Tooltip
                hasArrow
                label="///what3words the simplest way to talk about location"
                minW={"40px"}
                placement="bottom"
                bg="black"
              >
                <div className="w-fit">
                  <Link
                    className="font-bold"
                    href={`https://what3words.com/${formatedRide.startW3W}`}
                    target="_blank"
                  >
                    <span className="text-red-500">{"///"}</span>
                    {formatedRide.startW3W}
                  </Link>
                </div>
              </Tooltip>
            </div>
            <div className="w-6/12">
              <div className="space-y-2">
                <p className=" ps-4 flex gap-1 items-center text-gray-600">
                  <IoSettingsOutline />
                  weather: {weatherForecast?.weatherDescription}
                </p>
                <div className="flex gap-3">
                  <img
                    className="w-20"
                    src={weatherForecast?.weatherIcon}
                    alt="weather"
                  />
                  <div className="border-e pe-2">
                    <h1 className="font-bold text-gray-600 flex items-center gap-1 text-base">
                      <FaTemperatureLow />
                      Temp
                    </h1>
                    <p>{weatherForecast?.currentTemp}</p>
                    <p>{weatherForecast?.feelsLikeTemp}</p>
                  </div>
                  <div className="border-e pe-2">
                    <h1 className="font-bold text-gray-600 flex items-center gap-1 text-base">
                      <PiWindBold />
                      Wind
                    </h1>
                    <p>{weatherForecast?.windSpeed}</p>
                    <p>{weatherForecast?.windGusts}</p>
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-600 flex items-center gap-1 text-base">
                      <BsFillCloudLightningRainFill />
                      Rain
                    </h1>
                    <p>{weatherForecast?.currentTemp}</p>
                    <p>{weatherForecast?.feelsLikeTemp}</p>
                  </div>
                </div>
                <div className="flex gap-3 ms-20">
                  <p className="flex gap-1 items-center">
                    <FiSunrise />
                    {weatherForecast.sunrise}
                  </p>
                  <p className="flex gap-1 items-center">
                    <FiSunset /> {weatherForecast.sunset}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {!hasDatePassed(formatedRide.activityDateTime) &&
            !formatedRide?.isCancelled && (
              <>
                <div className="py-4 border-b space-y-4">
                  <p className="font-bold text-gray-600">
                    JOIN NOW AND LET&apos;S RIDE.
                  </p>
                  {formatedRide?.isGroup && (
                    <div>
                      <RadioGroup defaultValue="A">
                        <Stack spacing={5} flexDirection={"row"}>
                          {radioButtons.map((button) => (
                            <Radio
                              key={button.id}
                              value={button.id}
                              onChange={(e) => setGroup(e.target.value)}
                            >
                              {button.label}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </div>
                  )}
                  <div className="w-full flex gap-6">
                    <button
                      onClick={() => handleJoinRoster(1)}
                      className="w-1/2 bg-[#07c98b] py-2 rounded-lg font-bold text-white text-lg"
                    >
                      {loading === 1 ? (
                        <CgSpinner className="mx-auto animate-spin w-6 h-6" />
                      ) : (
                        " JOIN!"
                      )}
                    </button>
                    <button
                      onClick={() => handleJoinRoster(2)}
                      className="w-1/2 bg-[#fdbc31] py-2 rounded-lg font-bold text-white text-lg"
                    >
                      {loading === 2 ? (
                        <CgSpinner className="mx-auto animate-spin w-6 h-6" />
                      ) : (
                        " MAYBE!"
                      )}
                    </button>
                    {formatedRide?.rosterModal?.length > 0 && (
                      <button
                        onClick={() => handleJoinRoster(3)}
                        className="
                             w-1/2 text-white bg-[#f23c49] py-2 rounded-lg font-bold  text-lg "
                      >
                        {loading === 3 ? (
                          <CgSpinner className="mx-auto animate-spin w-6 h-6" />
                        ) : (
                          "NOPE"
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="py-4 border-b text-gray-500 flex">
                  <div className="w-1/2 border-e">
                    <div>
                      <p className="flex items-center gap-1 font-bold">
                        <FaRegFileLines />
                        Activity Notes
                      </p>
                      <div
                        className="mt-1 w-[90%]"
                        dangerouslySetInnerHTML={{
                          __html: formatedRide.rideNotes,
                        }}
                      />
                    </div>
                    {
                      <div>
                        {/* <p className="flex items-center gap-1 font-bold mt-2">
                          <FaRegFileLines /> Map Notes
                        </p> */}
                        <p className="mt-1 ">
                          Ride created from{" "}
                          {route?.mapSourceModel?.mapSourceName &&
                            route?.mapSourceModel?.mapSourceName}
                        </p>
                        <Link
                          href={`${formatedRide?.mapUrl}`}
                          target={"_blank"}
                          className="text-primaryText"
                        >
                          {formatedRide?.mapUrl}
                        </Link>
                      </div>
                    }
                  </div>
                  <div className="w-1/2 px-2">
                    <p className="flex gap-1 items-center font-bold ">
                      <IoPricetagsOutline />
                      Activity Tags{" "}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {formatedRide?.tags?.map((el, index) => (
                        <Tag key={index}>{el.activityTagName}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </section>
  );
};

export default RideDetail;
