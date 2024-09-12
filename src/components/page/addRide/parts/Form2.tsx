"use client";
import { stravaIcon } from "@/assets";
import MapComponent from "@/components/module/MapComponent";
import { getDifficultyLevel } from "@/redux/slices/addRideSlice";
import {
    checkGarminUser,
    checkRWGPSUser,
    checkStravaUser,
} from "@/redux/slices/externalServicesSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import useGpxToGeoJson from "@/shared/hook/useGpxToGeoJson";
import { User } from "@/shared/types/account.types";
import { extractRouteId } from "@/shared/util/format.util";
import { useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoAlert } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import RWGPSModal from "./RWGPSModal";
import StravaModal from "./StravaModal";

export const placeholderStyle = {
    color: "#050505",
    fontSize: "15px",
    fontWeight: 400,
};

interface Form1Props {
    nextForm: (data: FormData) => void;
    formData?: FormData;
    startOver: () => void;
    prevForm: () => void;
}

interface FormData {
    routeType?: string;
    url?: string;
    difficulty?: string;
    distance?: string;
    avgSpeed?: string;
    isGroup?: boolean;
    geoJSON?: any;
    gpxFile?: File;
    routeName?: string;
}

interface FormHeading {
    gps: string;
    strava: string;
    gpx: string;
    noroute: string;
    [key: string]: string;
}

interface DifficultyLevel {
    difficultyLevelID: number;
    levelName: string;
    levelDescription: string;
    levelColor: string;
    levelIcon: string;
}

const formHeading: FormHeading = {
    gps: "Link a Route",
    strava: "Link a Route",
    gpx: "GPX File",
    noroute: "No Route",
};

const fileTypes = ["GPX", "GPS"];

const Form2: React.FC<Form1Props> = ({
    nextForm,
    formData,
    startOver,
    prevForm,
}) => {
    const [gpxFile, setGpxFile] = useState<File | null>(null);
    const difficultyLevel = useSelector<RootState, DifficultyLevel[]>(
        (state) => state.addRide.difficultyLevels
    );
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const { rwgpsAuth, stravaAuth } = useSelector<RootState, any>(
        (state) => state.externalServices
    );
    const dispatch = useDispatch<AppDispatch>();
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
        errorMessage,
    } = useGpxToGeoJson();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        setError,
    } = useForm<FormData>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: stravaIsOpen,
        onOpen: stravaOnOpen,
        onClose: stravaOnClose,
    } = useDisclosure();
    const url = watch("url") as string;
    const difficulty = watch("difficulty");

    useEffect(() => {
        if (user.id) {
            dispatch(checkStravaUser(user.id));
            dispatch(checkRWGPSUser(user.id));
        }
    }, []);

    useEffect(() => {
        const link = url || formData?.url;
        if (link) {
            handleDownloadUrl(link);
        }
    }, [url, formData?.url]);

    useEffect(() => {
        if (formData?.gpxFile) {
            handlePickDocument(formData?.gpxFile);
        }
    }, [formData?.gpxFile]);

    useEffect(() => {
        if (features && features?.properties?.name) {
            setValue("routeName", features?.properties?.name?.trimEnd());
            setValue("distance", routeDistance);
        }
    }, [features, routeDistance]);

    const handleSubmits: SubmitHandler<FormData> = async (data) => {
        if (formData?.routeType === "gpx" && !gpxFile && !formData?.gpxFile) {
            setError("gpxFile", {
                type: "manual",
                message: "Please select a GPX file.",
            });
            return;
        }

        const form2Data = {
            ...data,
            routeName: features?.properties?.name?.trimEnd() ?? "",
            mapUrl: (features?.properties?.links?.[0]?.href || data?.url) ?? "",
            routeNumber: extractRouteId(
                (features?.properties?.links?.[0]?.href || data?.url) ?? ""
            ),
            centerLatitude,
            centerLongitude,
            routeDistance,
            geoJSON,
            gpxFile,
            gpxFilePath,
        } as any;
        nextForm(form2Data);
    };

    const heading = formData?.routeType && formHeading[formData.routeType];

    const handleFile = (file: File) => {
        setGpxFile(file);
        handlePickDocument(file);
    };

    return (
        <div className='mt-2 mb-5'>
            <form onSubmit={handleSubmit(handleSubmits)} className=''>
                <div className='flex gap-10'>
                    <div className='w-1/2'>
                        {formData?.routeType === "noroute" ? (
                            <div className='text-xl tablet:text-2xl font-bold'>
                                {heading}
                            </div>
                        ) : (
                            <>
                                <div className='space-y-2 mt-4'>
                                    <h1 className='text-xl tablet:text-2xl font-bold'>
                                        {heading}
                                    </h1>
                                    {formData?.routeType === "gpx" ? (
                                        <p className='font-extrabold text-base tablet:text-xl text-gray-400'>
                                            Have your own GPX file? Upload it
                                            and let&apos;s ride!
                                        </p>
                                    ) : (
                                        <p className='font-extrabold text-base tablet:text-xl text-gray-400'>
                                            Copy any public route URL from Ride
                                            with GPS, Strava, or Garmin or
                                            connect and easily use your own
                                            routes!
                                        </p>
                                    )}
                                </div>
                                {formData?.routeType === "gpx" ? (
                                    <div className='my-10 w-full'>
                                        <FileUploader
                                            handleChange={handleFile}
                                            name='file'
                                            types={fileTypes}
                                            classes='fileUploader'
                                            multiple={false}
                                            label='Select or drag & drop your gpx file here!'
                                        />
                                        {errors?.gpxFile && (
                                            <p className='text-xs mt-1 text-red-600'>
                                                {errors?.gpxFile.message}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className='space-y-3 pt-6'>
                                        <div className='flex flex-col relative w-full'>
                                            <label className='font-medium text-gray-600'>
                                                Public route link - Ride with
                                                GPS, Strava, or Garmin
                                            </label>
                                            <input
                                                type='input'
                                                defaultValue={formData?.url}
                                                placeholder={
                                                    "https://www.ridewithgps.com/routes/some-route-id"
                                                }
                                                {...register("url", {
                                                    required:
                                                        "Please enter a valid URL.",
                                                })}
                                                className={`border px-2 py-2 rounded-md ${
                                                    errors.url
                                                        ? "input-error"
                                                        : ""
                                                }`}
                                            />
                                            {errors.url && (
                                                <p className='text-xs mt-1 text-red-600'>
                                                    {errors.url.message}
                                                </p>
                                            )}
                                            {loading && (
                                                <CgSpinner className='absolute top-8 right-3 tablet:-right-8 mx-auto animate-spin w-6 h-6' />
                                            )}
                                        </div>
                                        <div className='flex gap-3 '>
                                            {rwgpsAuth.authToken && (
                                                <div>
                                                    <button
                                                        onClick={onOpen}
                                                        className='bg-orange py-2 px-4 text-white font-bold rounded-lg'
                                                        type='button'>
                                                        My RWGPS Routes
                                                    </button>
                                                </div>
                                            )}
                                            {stravaAuth.authToken && (
                                                <div>
                                                    <button
                                                        onClick={stravaOnOpen}
                                                        className='bg-orange py-2 px-4 text-white font-bold rounded-lg'
                                                        type='button'>
                                                        My Strava Routes
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {(geoJSON?.features ||
                            formData?.geoJSON?.features ||
                            formData?.routeType === "noroute") && (
                            <div>
                                <div className='w-full mt-4'>
                                    {(formData?.routeName ||
                                        features?.properties?.name?.trimEnd()) && (
                                        <div className='flex flex-col w-full'>
                                            <label className='font-medium text-gray-400 text-sm'>
                                                Route Name
                                            </label>
                                            <input
                                                type='text'
                                                placeholder={""}
                                                disabled
                                                defaultValue={
                                                    formData?.routeName ||
                                                    features?.properties?.name?.trimEnd()
                                                }
                                                {...register("routeName")}
                                                className='border px-2 py-[6px] mt-1 remove-arrow  rounded-md'
                                            />
                                        </div>
                                    )}
                                    <div className='flex gap-2 tablet:gap-4 flex-col tablet:flex-row mt-3'>
                                        <div className='flex flex-col tablet:w-1/2 w-full'>
                                            <label className='font-medium text-gray-400 text-sm'>
                                                Distance (miles)
                                            </label>
                                            <input
                                                type='number'
                                                placeholder={"Distance"}
                                                defaultValue={
                                                    formData?.distance ||
                                                    routeDistance
                                                }
                                                {...register("distance", {
                                                    required:
                                                        "Please enter the distance.",
                                                })}
                                                className={`border rounded-md px-2 py-[6px] mt-1 remove-arrow ${
                                                    errors.distance
                                                        ? "input-error"
                                                        : ""
                                                }`}
                                            />
                                            {errors.distance && (
                                                <p className='text-xs mt-1 text-red-600'>
                                                    {errors.distance.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className='flex flex-col tablet:w-1/2 w-full'>
                                            <label className='font-medium text-gray-400 text-sm'>
                                                Avg speed (mph)
                                            </label>
                                            <input
                                                type='number'
                                                placeholder={"Avg speed"}
                                                defaultValue={
                                                    formData?.avgSpeed
                                                }
                                                {...register("avgSpeed", {
                                                    required:
                                                        "Please enter the average speed.",
                                                })}
                                                className={`border rounded-md px-2 py-[6px] mt-1 remove-arrow ${
                                                    errors.avgSpeed
                                                        ? "input-error"
                                                        : ""
                                                }`}
                                            />
                                            {errors.avgSpeed && (
                                                <p className='text-xs mt-1 text-red-600'>
                                                    {errors.avgSpeed.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex gap-0 tablet:gap-4 mt-3'>
                                        <div className='flex flex-col w-full relative'>
                                            <select
                                                defaultValue={
                                                    formData?.difficulty || ""
                                                }
                                                {...register("difficulty", {
                                                    required:
                                                        "Please select a difficulty level.",
                                                })}
                                                className={`bg-white border rounded-md px-2 py-[6px] ${
                                                    difficulty
                                                        ? "text-black"
                                                        : "text-gray-400"
                                                } ${
                                                    errors.difficulty
                                                        ? "input-error"
                                                        : ""
                                                }`}>
                                                <option value='' disabled>
                                                    Select difficulty level
                                                </option>
                                                {difficultyLevel?.map(
                                                    (data) => (
                                                        <option
                                                            value={
                                                                data.difficultyLevelID
                                                            }
                                                            key={
                                                                data.difficultyLevelID
                                                            }>
                                                            {data.levelName} -{" "}
                                                            {
                                                                data.levelDescription
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            <IoMdArrowDropdown className='w-5 h-auto absolute right-3 top-[11px]' />
                                            {errors.difficulty && (
                                                <p className='text-xs mt-1 text-red-600'>
                                                    {errors.difficulty.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <label className='inline-flex items-center cursor-pointer'>
                                            <input
                                                {...register("isGroup")}
                                                type='checkbox'
                                                className='sr-only peer'
                                            />
                                            <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                            <span className='font-medium'>
                                                IsGroup
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='w-1/2 mt-16'>
                        {geoJSON?.features && (
                            <MapComponent
                                centerLatitude={centerLatitude}
                                centerLongitude={centerLongitude}
                                geoJSON={geoJSON}
                                className='h-[50vh]'
                            />
                        )}
                    </div>
                </div>
                {formData?.routeType === "gps" && (
                    <>
                        <div className='flex p-2 flex-col gap-1 text-gray-600 mt-3 text-sm tablet:text-base'>
                            <p>
                                Did you know you can connect your
                                <Link
                                    href={"/rwgpsConnect"}
                                    className='text-primaryText'>
                                    {" "}
                                    Ride with GPS{" "}
                                </Link>
                                or{" "}
                                <Link
                                    href={"/stravaconnect"}
                                    className='text-primaryText'>
                                    {" "}
                                    Strava{" "}
                                </Link>{" "}
                                account and access your routes directly?!
                            </p>
                            <p>
                                Quickly setup rides from your existing routes!
                                <Link
                                    href={"/account/profile"}
                                    className='text-primaryText'>
                                    {" "}
                                    Authorize
                                </Link>{" "}
                                your accounts with Chasing Watts to get started!{" "}
                            </p>
                        </div>
                        <div className='flex my-3 gap-3 text-black border border-slate-500 bg-slate-300 rounded-lg p-4 text-sm tablet:text-base'>
                            <p>
                                Looking for new routes? Head over to
                                <Link
                                    href={"https://www.ridewithgps.com"}
                                    target='_blank'
                                    className='text-black font-bold'>
                                    {" "}
                                    Ride with GPS
                                </Link>
                                ,
                                <Link
                                    href={"https://www.strava.com"}
                                    target='_blank'
                                    className='text-black font-bold'>
                                    {" "}
                                    Strava
                                </Link>
                                , or
                                <Link
                                    href={"https://connect.garmin.com/"}
                                    target='_blank'
                                    className='text-black font-bold'>
                                    {" "}
                                    Garmin Connect{" "}
                                </Link>
                                and get started!
                            </p>
                        </div>
                    </>
                )}
                <div className='flex justify-between mt-5'>
                    <button
                        type='button'
                        onClick={startOver}
                        className='text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold h-fit'>
                        START OVER
                    </button>
                    <div className='flex gap-3 flex-col-reverse tablet:flex-row'>
                        <button
                            type='button'
                            onClick={prevForm}
                            className='text-sm tablet:text-base bg-gray-100 shadow-md rounded-md text-gray-600 px-3 py-2 font-semibold'>
                            PREVIOUS
                        </button>
                        <button
                            type='submit'
                            disabled={loading}
                            className='text-sm tablet:text-base bg-primaryText text-white px-9 py-2 rounded-md font-semibold'>
                            NEXT
                        </button>
                    </div>
                </div>
            </form>
            <RWGPSModal
                onClose={onClose}
                isOpen={isOpen}
                userId={user.id}
                setValue={setValue}
            />
            <StravaModal
                onClose={stravaOnClose}
                isOpen={stravaIsOpen}
                userId={stravaAuth.stravaUserID}
                setValue={setValue}
            />
        </div>
    );
};

export default Form2;
