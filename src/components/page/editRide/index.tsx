"use client";
import React, { useEffect, useState } from "react";
import useGpxToGeoJson from "@/shared/hook/useGpxToGeoJson";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import RideDetails from "./parts/RideDetails";
import AdditionalOptions from "./parts/AdditionalOptions";
import GPXFileUploader from "./parts/GPXFileUploader";
import RouteLink from "./parts/RouteLink";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { DifficultyLevel } from "@/shared/types/addRide.types";
import RideRoute from "./parts/RideRoute";
import { deleteRide, getRide } from "@/redux/slices/addRideSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { extractRouteId } from "@/shared/util/format.util";
import { User } from "@/shared/types/account.types";
import { CgSpinner } from "react-icons/cg";
import { editRide } from "./feature/editRide";
import { useRouter } from "next/navigation";
import { ReusableAlertDialog } from "@/components/basic/ReusableAlertDialog";

interface FormData {
  routeType?: string;
  url?: string;
  difficulty?: string;
  distance?: string;
  avgSpeed?: string;
  isGroup?: boolean;
  geoJSON?: any;
  gpxFile?: File;
  rideName?: string;
  startAddress?: string;
  rideType?: string;
  isCommunity: boolean;
  isPrivate: boolean;
  isDrop: boolean;
  isLights: boolean;
  avgSpeedgpx: number;
  distancegpx: number;
  difficultygpx: string;
  isGroupgpx: boolean;
  avgSpeedlink: number;
  distancelink: number;
  difficultylink: string;
  isGrouplink: boolean;
  routeNamelink?: string;
  routeNamegpx?: string;
  hubID?: string;
}

export const EditRide = ({ id }: { id: number }) => {
  const [finaldate, setFinaldata] = useState({});
  const [data, setData] = useState<any>("");
  const [activityID, setActivityID] = useState();
  const [currentTab, setCurrentTab] = useState(2);
  const [mapSource, setMapSource] = useState();
  const [gpxData, setGpxdata] = useState<any>({});
  const [linkData, setLinkdata] = useState<any>({});
  const [editLoading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const {
    handlePickDocument,
    handleDownloadUrl,
    handleDownloadGPXFile,
    fetchAndOpenUrl,
    getBoundingBox,
    centerLatitude,
    centerLongitude,
    routeDistance,
    geoJSON,
    gpxFilePath,
    features,
    loading,
    gpxState,
    errorMessage,
  } = useGpxToGeoJson();
  useEffect(() => {
    if (currentTab === 1) {
      setValue("distancegpx", parseInt(routeDistance));
      setValue("routeNamegpx", features?.properties?.name?.trimEnd());
      setGpxdata(gpxState);
      setLinkdata({});
    } else if (currentTab === 0) {
      setValue("distancelink", parseInt(routeDistance));
      setValue("routeNamelink", features?.properties?.name?.trimEnd());
      setLinkdata(gpxState);
      setGpxdata({});
    }
  }, [features, routeDistance, gpxState]);

  const difficultyLevel = useSelector<RootState, DifficultyLevel[]>(
    (state) => state.addRide.difficultyLevels
  );
  const userData = useSelector<RootState>((state) => state.auth.user) as User;
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>();
  useEffect(() => {
    (async () => {
      const response = await dispatch(getRide(id));
      if (getRide.fulfilled.match(response)) {
        if (response.payload) {
          const data = response.payload;
          setData(data);
        }
      } else if (getRide.rejected.match(response)) {
        toast.error("failed to fetch rider");
      }
    })();
  }, []);
  useEffect(() => {
    if (data) {
      setActivityID(data?.activityID);
      setValue("rideName", data?.activityName);
      setValue("startAddress", data.startAddress);
      setValue("rideType", data?.activityTypeID);
      setValue("hubID", data?.teamID);
      setValue("isCommunity", data?.isCommunity);
      setValue("isPrivate", data?.data?.isPrivate);
      setValue("isDrop", data?.isDrop);
      setValue("isLights", data?.isLightsRequired);
      if (data?.activityRouteModel[0]?.gpxRoutePath) {
        (async () => {
          handleDownloadUrl(
            `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.activityRouteModel[0]?.gpxRoutePath}`
          );
        })();
      }
      if (data?.activityRouteModel[0]?.mapSourceID) {
        setMapSource(data?.activityRouteModel[0]?.mapSourceID);

        if (data?.activityRouteModel[0]?.mapSourceID === 5) {
          setCurrentTab(1);
          setValue("avgSpeedgpx", data?.activityRouteModel[0]?.speed || "");
          setValue("distancegpx", data?.activityRouteModel[0]?.distance || "");
          setValue(
            "difficultygpx",
            data?.activityRouteModel[0]?.difficultyLevelID || ""
          );
          setValue("routeNamelink", data?.activityRouteModel[0]?.routeName);
          setValue("isGroupgpx", data.isGroup || false);
        } else if (data?.activityRouteModel[0]?.mapSourceID === 4) {
          setCurrentTab(2);
          setValue("avgSpeed", data?.activityRouteModel[0]?.speed || "");
          setValue("distance", data?.activityRouteModel[0]?.distance || "");
          setValue(
            "difficulty",
            data?.activityRouteModel[0]?.difficultyLevelID || ""
          );
          setValue("isGroup", data.isGroup || false);
        } else {
          setCurrentTab(0);
          setValue("url", data?.activityRouteModel[0]?.mapUrl);
          setValue("avgSpeedlink", data?.activityRouteModel[0]?.speed || "");
          setValue("distancelink", data?.activityRouteModel[0]?.distance || "");
          setValue(
            "difficultylink",
            data?.activityRouteModel[0]?.difficultyLevelID || ""
          );
          setValue("routeNamelink", data?.activityRouteModel[0]?.routeName);
          setValue("isGrouplink", data.isGroup || false);
        }
      }
    }
  }, [data]);

  const handleFile = (file: File) => {
    handlePickDocument(file);
  };

  const handleSubmits: SubmitHandler<FormData> = async (data) => {
    let modify = {};
    if (currentTab === 0) {
      modify = {
        avgSpeed: data.avgSpeedlink,
        distance: data.distancelink,
        difficulty: data.difficultylink,
        isGroup: data.isGrouplink,
      };
    }

    if (currentTab === 1) {
      modify = {
        avgSpeed: data.avgSpeedgpx,
        distance: data.distancegpx,
        difficulty: data.difficultygpx,
        isGroup: data.isGroupgpx,
      };
    }
    const routeData = {
      ...data,
      ...finaldate,
      ...modify,
      currentTab,
      mapSource,
      activityID,
      routeName: features?.properties?.name?.trimEnd() ?? "",
      mapUrl: data?.url||(features?.properties?.links?.[0]?.href ?? ""),
      routeNumber: extractRouteId(features?.properties?.links?.[0]?.href ?? ""),
      centerLatitude,
      centerLongitude,
      routeDistance,
      geoJSON,
      gpxFilePath,
    };
    const payload = {
      routeData: routeData,
      user: userData,
    };
   

    const onSuccess = (response: any) => {
      setData(response);
      toast.success("Ride saved successfully");
    };

    const onError = (error: any) => {
      toast.error("Error while saving ride");
    };
    setLoading(true);
    await editRide(dispatch, onSuccess, onError, payload);
    setLoading(false);
  };

  const handleClick = () => {
    const url = getValues("url");
    handleDownloadUrl(url);
  };
  const handleDelete = async () => {
    onAlertClose();
    setDeleteLoading(true);
    const response = await dispatch(deleteRide(id));
    setDeleteLoading(false);
    if (deleteRide.fulfilled.match(response)) {
      toast.success("Ride Deleted Successfully");
      push("/dashboard");
    } else {
      toast.error("Ride Delete Error");
    }
  };

  return (
    <section className="bg-[#f5f4f8] h-full">
      <div className=" pt-28 w-11/12 mx-auto !max-w-[1320px]">
        <div>
          <form onSubmit={handleSubmit(handleSubmits)}>
            <Accordion
              defaultIndex={[0]}
              allowMultiple
              className="border bg-white rounded-xl"
            >
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      className="text-2xl font-bold"
                    >
                      Update the Primary Route
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Tabs
                    index={currentTab}
                    onChange={(index) => setCurrentTab(index)}
                  >
                    <TabList>
                      <Tab>Link A Route</Tab>
                      <Tab>GPX File</Tab>
                      <Tab>No Route</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        {currentTab === 0 && (
                          <>
                            <RouteLink
                              register={register}
                              errors={errors}
                              loading={loading}
                              handleClick={handleClick}
                            />
                            <RideRoute
                              type="link"
                              register={register}
                              geoJSON={linkData?.geoJSON}
                              difficultyLevel={difficultyLevel}
                              centerLatitude={linkData?.centerLatitude}
                              centerLongitude={linkData?.centerLongitude}
                              errors={errors}
                            />
                          </>
                        )}
                      </TabPanel>
                      <TabPanel>
                        {currentTab === 1 && (
                          <>
                            <GPXFileUploader
                              handleFile={handleFile}
                              errors={errors}
                            />
                            <RideRoute
                              type="gpx"
                              register={register}
                              geoJSON={gpxData?.geoJSON}
                              difficultyLevel={difficultyLevel}
                              centerLatitude={gpxData?.centerLatitude}
                              centerLongitude={gpxData?.centerLongitude}
                              errors={errors}
                            />
                          </>
                        )}
                      </TabPanel>
                      <TabPanel>
                        {currentTab === 2 && (
                          <div className="border shadow-xl rounded-xl p-6">
                            <div className="w-1/2 ">
                              <div className="flex gap-2 tablet:gap-4 flex-col tablet:flex-row mt-3">
                                <div className="flex flex-col tablet:w-1/2 w-full">
                                  <label className="font-medium text-gray-600 text-sm">
                                    Distance (miles)
                                  </label>
                                  <input
                                    type="number"
                                    placeholder={"Distance"}
                                    {...register("distance", {
                                      required: "Please enter the distance.",
                                    })}
                                    className={`border px-2 py-[6px] mt-1 remove-arrow ${
                                      errors.distance ? "input-error" : ""
                                    }`}
                                  />
                                  {errors.distance && (
                                    <p className="text-xs mt-1 text-red-600">
                                      {errors.distance.message}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col tablet:w-1/2 w-full">
                                  <label className="font-medium text-gray-600 text-sm">
                                    Avg speed (mph)
                                  </label>
                                  <input
                                    type="number"
                                    placeholder={"Avg speed"}
                                    {...register("avgSpeed", {
                                      required:
                                        "Please enter the average speed.",
                                    })}
                                    className={`border px-2 py-[6px] mt-1 remove-arrow ${
                                      errors.avgSpeed ? "input-error" : ""
                                    }`}
                                  />
                                  {errors.avgSpeed && (
                                    <p className="text-xs mt-1 text-red-600">
                                      {errors.avgSpeed.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-0 tablet:gap-4 mt-3">
                                <div className="flex flex-col w-full relative">
                                  <select
                                    {...register("difficulty", {
                                      required:
                                        "Please select a difficulty level.",
                                    })}
                                    className={`bg-white border px-2 py-[6px]  ${
                                      errors.difficulty ? "input-error" : ""
                                    }`}
                                    defaultValue=""
                                  >
                                    <option value="" disabled>
                                      Select difficulty level
                                    </option>
                                    {difficultyLevel?.map((data) => (
                                      <option
                                        value={data.difficultyLevelID}
                                        key={data.difficultyLevelID}
                                      >
                                        {data.levelName}
                                      </option>
                                    ))}
                                  </select>
                                  <IoMdArrowDropdown className="w-5 h-auto absolute right-3 top-[11px]" />
                                  {errors.difficulty && (
                                    <p className="text-xs mt-1 text-red-600">
                                      {errors.difficulty.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    {...register("isGroup")}
                                    type="checkbox"
                                    className="sr-only peer"
                                  />
                                  <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                  <span className="font-medium">IsGroup</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      className="text-2xl font-bold"
                    >
                      Update the Ride? Ride Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <RideDetails
                    data={data}
                    setData={(data: any) =>
                      setFinaldata({ ...finaldate, ...data })
                    }
                    register={register}
                    errors={errors}
                    setValue={(name: string, value: any) =>
                      setValue(name as keyof FormData, value)
                    }
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      className="text-2xl font-bold"
                    >
                      Additional Ride Options
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <AdditionalOptions
                    register={register}
                    errors={errors}
                    data={data}
                    setData={(data: any) =>
                      setFinaldata({ ...finaldate, ...data })
                    }
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <div className="flex gap-3 justify-center m-6 text-center">
              <button
                type="button"
                onClick={onAlertOpen}
                className="py-2 px-8 rounded-md bg-[#e43d30] text-white w-44"
              >
                {deleteLoading ? (
                  <CgSpinner className="animate-spin w-6 h-6 mx-auto" />
                ) : (
                  "Delete"
                )}
              </button>
              <button
                type="submit"
                className="py-2  rounded-md px-8 bg-primaryDarkblue text-white w-44"
              >
                {editLoading ? (
                  <CgSpinner className="animate-spin w-6 h-6 mx-auto" />
                ) : (
                  "Save Route"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ReusableAlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        title="Ride Delete!"
        message="Are you sure you want to delete this ride?"
        onConfirm={handleDelete}
      />
    </section>
  );
};
