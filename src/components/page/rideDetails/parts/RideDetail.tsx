"use client";

import { getWeather, setActivityRoster } from "@/redux/slices/rideDetailsSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Item } from "@/shared/types/dashboard.types";
import {
  ActivityRoute,
  WeatherForecast,
} from "@/shared/types/rideDetail.types";
import {
  checkImageLoad,
  formatRideData,
  hasDatePassed,
} from "@/shared/util/format.util";
import {
  Radio,
  RadioGroup,
  Stack,
  Tag,
  Tooltip,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from "@chakra-ui/react";
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
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/pro-light-svg-icons/faClipboardList";
import { MY_DOMAIN } from "@/constant/appConfig";

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
  const [loading, setLoading] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>("A");
  const [imageUrl, setImageUrl] = useState<string | any>(null);
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
  const responseType = useSelector<RootState>(
    (state) => state.rideDetail.responsetype
  ) as any;
  const [showPrivateShare, setShowPrivateShare] = useState(false);

  const formatedRide = formatRideData(rides);

  const handleJoinRoster = async (type: string) => {
    const respose =
      responseType &&
      responseType?.find((item: any) => item?.responseTypeName === type);
    //console.log(respose);
    //console.log("group", group);
    const payload = {
      activityID: formatedRide.activityID,
      createdBy: user?.id,
      createdDate: new Date().toISOString(),
      modifiedBy: user?.id,
      modifiedDate: new Date().toISOString(),
      responseTypeID: respose.responseTypeID,
      groupLevel: group || "A",
    };
    setLoading(type);
    const response = await dispatch(setActivityRoster(payload));
    if (setActivityRoster.fulfilled.match(response)) {
      toast.success("Thanks for responding to the ride!");
    }
    setLoading(null);
  };

  const userRosterInfo = (formatedRide?.rosterModal?.length > 0 &&
    formatedRide?.rosterModal?.find(
      (data) => data.createdBy === user.id
    )) as any;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  console.log("weatherForecast", weatherForecast);
  {
    console.log(formatedRide.tags, "ridetags");
  }

  useEffect(() => {
    const loadImage = async () => {
      if (formatedRide?.image) {
        const secondUrl = await checkImageLoad(formatedRide?.image);
        setImageUrl(secondUrl);
      }
    };

    loadImage();
  }, [formatedRide.image]);

  return (
    <section id="details">
      <div className="bg-white min-h-40 border border-neutral-300 rounded-md">
        <div className="p-8">
          <div className="flex flex-row justify-between items-center border-b">
            <div className="flex gap-2 pb-4">
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
            {formatedRide.isPrivate &&
              !formatedRide.isCancelled &&
              (formatedRide?.userID === user?.id || user?.role === "Admin") && (
                <div>
                  <button
                    className="bg-primaryButton text-white hover:text-neutral-300 px-4 py-2 rounded-md"
                    onClick={() => setShowPrivateShare(true)}
                  >
                    Private Share Link
                  </button>
                </div>
              )}
          </div>
          {showPrivateShare && (
            <div className="mt-3">
              <span className="text-sm text-neutral-600">
                Ride Owner - Private Share Link. Anyone with this link can view
                this ride!
              </span>
              <Alert status="info" variant="left-accent" borderRadius={6}>
                <Box width="100%">
                  <div className="flex w-full">
                    <p className="font-sm text-primaryText">
                      <Code>
                        {MY_DOMAIN}/ride/
                        {formatedRide.activityID}
                        ?share=
                        {formatedRide?.shareCode}
                      </Code>
                    </p>
                    <div className="items-center justify-center ml-2">
                      <Tooltip
                        hasArrow
                        label="Copy to clipboard"
                        placement="top"
                        bg="black"
                      >
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${MY_DOMAIN}/ride/${formatedRide.activityID}?share=${formatedRide?.shareCode}`
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faClipboardList}
                            size="lg"
                            color="#4B5563"
                          />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </Box>
                <CloseButton
                  alignSelf="flex-start"
                  position="relative"
                  right={-1}
                  top={-1}
                  onClick={() => setShowPrivateShare(false)}
                />
              </Alert>
            </div>
          )}
          <div className="py-4 border-b">
            <p className="font-bold">
              <span className="font-medium capitalize">
                {formatedRide.isCommunity
                  ? "Community Ride"
                  : "Owner: " +
                    formatedRide.rideCreateFirstName +
                    " " +
                    formatedRide.rideCreateLastName}
              </span>
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
              <div className="w-[90%] my-1">
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
                {weatherForecast === null ? (
                  <div className="flex flex-row items-center">
                    <img
                      className="w-20"
                      src="/images/weather/unknown.png"
                      alt="weather"
                    />
                    <p className="ml-2 text-sm text-neutral-500">
                      <span className="text-sm text-neutral-500 font-semibold">
                        No forecast right now...
                      </span>
                      <br />
                      Check back when it closer to the ride date!
                    </p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
          {!hasDatePassed(formatedRide.activityDateTime) &&
            !formatedRide?.isCancelled &&
            user?.id !== null && (
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
                      onClick={() => handleJoinRoster("Yes")}
                      className={`w-1/2  py-2 rounded-lg font-bold  text-lg transition transform ease-in-out duration-300 ${
                        userRosterInfo?.responseTypeModel?.responseTypeName ===
                        "Yes"
                          ? "bg-[#e6f9f3] text-[#07c98b]"
                          : " bg-[#07c98b] text-white hover:bg-[#24a97f]"
                      }`}
                    >
                      {loading === "Yes" ? (
                        <CgSpinner className="mx-auto animate-spin w-6 h-6" />
                      ) : (
                        " JOIN!"
                      )}
                    </button>
                    <button
                      onClick={() => handleJoinRoster("Interested")}
                      className={`w-1/2  py-2 rounded-lg font-bold  text-lg transition transform ease-in-out duration-300
                        ${
                          userRosterInfo?.responseTypeModel
                            ?.responseTypeName === "Interested"
                            ? "bg-[#fff5e0] text-[#fdbc31] hover:bg-[#fdbc31] hover:text-white"
                            : " bg-[#fdbc31] text-white hover:bg-[#d09c2c]"
                        }`}
                    >
                      {loading === "Interested" ? (
                        <CgSpinner className="mx-auto animate-spin w-6 h-6" />
                      ) : (
                        " MAYBE!"
                      )}
                    </button>
                    {formatedRide?.rosterModal?.length > 0 && (
                      <button
                        onClick={() => handleJoinRoster("No")}
                        className={`
                             w-1/2 text-white ${"bg-[#f23c49]"} py-2 rounded-lg font-bold  text-lg transition transform ease-in-out duration-300
                            ${
                              userRosterInfo?.responseTypeModel
                                ?.responseTypeName === "No"
                                ? "bg-[#feebec] text-[#f23c49] hover:bg-[#f23c49] hover:text-white"
                                : " bg-[#f23c49] text-white hover:bg-[#ce303b] hover:shadow-md "
                            } `}
                      >
                        {loading === "No" ? (
                          <CgSpinner className="mx-auto animate-spin w-6 h-6" />
                        ) : (
                          "NOPE"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

          <div className="py-4 border-b text-gray-500 flex">
            <div
              className={`${
                formatedRide?.tags?.length === 0 && !imageUrl
                  ? "w-full"
                  : "w-1/2 border-e"
              }`}
            >
              <div>
                <p className="flex items-center gap-1 font-bold mb-2">
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
                  <p className="mt-3">
                    Ride created from{" "}
                    <span className="font-semibold">
                      {route?.mapSourceModel?.mapSourceName &&
                        route?.mapSourceModel?.mapSourceName}
                    </span>
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
              {formatedRide?.tags.length>0 && (
                <div>
                  <p className="flex gap-1 items-center font-bold ">
                    <IoPricetagsOutline />
                    Activity Tags
                  </p>
                  <div className="mt-2 flex gap-2">
                    {formatedRide?.tags?.map((el, index) => (
                      <Tag key={index}>{el.activityTagName}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* ride picture? */}
              {imageUrl && (
                <div className="mt-4">
                  <img
                    src={imageUrl}
                    alt={formatedRide?.rideName}
                    className="w-100 aspect-video object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RideDetail;
