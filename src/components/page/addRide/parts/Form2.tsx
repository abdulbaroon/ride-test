"use client";
import { stravaIcon } from "@/assets";
import MapComponent from "@/components/module/MapComponent";
import { getDifficultyLevel } from "@/redux/slices/addRideSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import useGpxToGeoJson from "@/shared/hook/useGpxToGeoJson";
import { extractRouteId } from "@/shared/util/format.util";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoAlert } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

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
    url?: string
    difficulty?: string
    distance?: string
    avgSpeed?: string
    isGroup?: boolean
}
interface FormHeading {
    gps: string;
    strava: string;
    gpx: string;
    noroute: string;
    [key: string]: string;
}
interface difficultyLevelPayload {
    payload: DifficultyLevel[]
}
interface DifficultyLevel {
    difficultyLevelID: number;
    levelName: string;
    levelDescription: string;
    levelColor: string;
    levelIcon: string;
}
const formHeading: FormHeading = {
    gps: "Ride with GPS",
    strava: "Strava",
    gpx: "GPX File",
    noroute: "No Route"
}
const fileTypes = ["GPX", "GPS"];
const Form2: React.FC<Form1Props> = ({ nextForm, formData, startOver, prevForm }) => {
    const difficultyLevel = useSelector<RootState>(
        (state) => state.addRide.difficultyLevels
    ) as DifficultyLevel[]
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
        control,
        formState: { errors },
    } = useForm<FormData>();
    console.log(formData, "sd")
    const url = watch("url") as string
    useEffect(() => {
        const regex = formData?.routeType === "strava" ? /^https:\/\/www\.strava\.com\/routes\/\d+$/ : /^https:\/\/ridewithgps\.com\/routes\/\d+$/
        if (regex.test(url)) {
            handleDownloadUrl(url);
        } else {
            console.error('URL does not match the expected format.');
        }
    }, [url])
    const handleSubmits: SubmitHandler<FormData> = async (data) => {
        await handleDownloadUrl(data.url)
        const form2Data = {
            ...data,
            routeName: features?.properties?.name.trimEnd(),
            mapUrl: features?.properties?.links?.[0]?.href,
            routeNumber: extractRouteId(features?.properties?.links?.[0]?.href),
            centerLatitude,
            centerLongitude,
            routeDistance,
            geoJSON,
            gpxFilePath,
        }
        nextForm(form2Data);
    }; 
    const heading = formData?.routeType && formHeading[formData?.routeType]
    return (
        <div className="mt-2 mb-5">
            <form onSubmit={handleSubmit(handleSubmits)} className="">
                {formData?.routeType === "noroute" ?
                    <div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {heading}
                            </h1>
                            <p className="font-extrabold text-xl text-gray-400">Quick add with no route.</p>
                        </div>
                        <div className="w-1/2 mt-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="font-medium text-gray-600 text-sm">Distance (miles)</label>
                                    <input type="input" placeholder={"Distance"} {...register("distance", { required: true })} className=" border px-2 py-[6px]" />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="font-medium text-gray-600 text-sm">Avg speed (mph)</label>
                                    <input type="input" placeholder={"Avg speed"} {...register("avgSpeed", { required: true })} className=" border px-2 py-[6px]" />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-3">
                                <div className="flex flex-col w-full relative">
                                    <select {...register("difficulty", { required: "Ride type is required" })} className={` bg-white border px-2 py-[6px] `}>
                                        <option value="" disabled selected>Activity Type</option>
                                        {difficultyLevel?.map((data) => (
                                            <option value={data.difficultyLevelID} key={data.difficultyLevelID}>{data.levelName}</option>
                                        ))}
                                    </select>
                                    <IoMdArrowDropdown className=' w-5 h-auto  absolute right-3 top-[11px]' />
                                </div>
                            </div>
                            <div className="mt-4">                         
                                <label className="inline-flex items-center cursor-pointer">
                                    <input {...register("isGroup")} type="checkbox" className="sr-only peer" />
                                    <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                    <span className="font-medium">IsGroup</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <div className="space-y-2 mt-4">
                            <h1 className="text-2xl font-bold">
                                {heading}
                            </h1>
                            {formData?.routeType === "gpx" ?
                                <p className="font-extrabold text-xl text-gray-400">Have your own GPX FILE? Upload it and let's ride!</p> :
                                <p className="font-extrabold text-xl text-gray-400">Copy any public route URL from {heading} or connect and easily use your own routes!</p>
                            }
                        </div>
                        {formData?.routeType === "gpx" ?
                            <div className="my-10">
                                <FileUploader handleChange={handlePickDocument} name="file" types={fileTypes} classes="fileUploader" multiple={false} label="Select or drag & drop your gpx file here!" />
                            </div>
                            : <>
                                <div className="space-y-3 pt-6">
                                    <div className="flex flex-col relative w-1/2">
                                        <label className="font-medium text-gray-600" >Public {formData?.routeType === "strava" ? "Strava" : "RWGPS"} route link</label>
                                        <input type="input" placeholder={formData?.routeType === "strava" ? "https://www.strava.com/routes/your-route-id" : "https://ridewithgps.com/routes/your-route-id"} {...register("url", { required: true, pattern: formData?.routeType === "strava" ? /^https:\/\/www\.strava\.com\/routes\/\d+$/ : /^https:\/\/ridewithgps\.com\/routes\/\d+$/ })} className=" border px-2 py-2" />
                                        {errors.url && <p className="text-xs mt-1 text-red-600 ">Please enter a valid Strava route! It should be like {formData?.routeType === "strava" ? "https://www.strava.com/routes/your-route-id" : "https://ridewithgps.com/routes/your-route-id"}.</p>}
                                        {loading && <CgSpinner className='absolute top-8 -right-8 mx-auto animate-spin w-6 h-6 ' />}
                                    </div>
                                </div>
                                <div className="flex p-5 flex-col text-gray-600 mt-3">
                                    <p>Did you know you can connect your
                                        <Link href={"#"} className="text-primaryText"> {heading} </Link>
                                        or account and access your routes directly?!
                                    </p>
                                    <p>Quickly setup rides from your existing routes!
                                        <Link href={"#"} className="text-primaryText"> Authorize Chasing Watts & {formData?.routeType === "strava" ? "Strava" : "RWGPS"} to get started! </Link>
                                    </p>
                                </div>
                                <div className="flex my-5 gap-3 text-yellow-500 border border-yellow-400 rounded-lg p-4 bg-[#fff8ea]">
                                    <img src={stravaIcon.src} alt="icons" className="w-5 h-5" />
                                    <p>Want to find or create new Strava route? Head over to
                                        <Link href={"#"} className="text-yellow-700 font-bold"> {heading} </Link>
                                        and get started!</p>
                                </div>
                            </>}
                        {geoJSON && (
                            <div>
                                <p>Route Distance: {routeDistance} miles</p>
                                <p>Center Latitude: {centerLatitude}</p>
                                <p>Center Longitude: {centerLongitude}</p>
                                <p>File Path: {gpxFilePath}</p>
                            </div>

                        )}

                    </>
                }
                <div className="flex justify-between mt-5">
                    <button type="button" onClick={startOver} className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold">START OVER</button>
                    <div className="flex gap-3">
                        <button type="button" onClick={prevForm} className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold">PREVIOUS</button>
                        <button type="submit" disabled={loading} className="bg-primaryText text-white px-9 py-2 rounded-sm font-semibold">NEXT</button>
                    </div>
                </div>
            </form>
            {/* {geoJSON && gpxFilePath && <MapComponent centerLatitude={centerLatitude} centerLongitude={centerLongitude} geoJSON={geoJSON} />} */}
        </div>
    );
};

export default Form2;
