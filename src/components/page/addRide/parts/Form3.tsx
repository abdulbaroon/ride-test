"use client";
import { stravaIcon } from "@/assets";
import Link from "next/link";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoAlert } from "react-icons/io5";

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
}
interface FormHeading {
    gps: string;
    strava: string;
    gpx: string;
    noroute: string;
    [key: string]: string;
}
const formHeading: FormHeading = {
    gps: "Ride with GPS",
    strava: "Strava",
    gpx: "GPX File",
    noroute: "No route"
}
const fileTypes = ["GPX", "GPS"];
const Form3: React.FC<Form1Props> = ({ nextForm, formData, startOver, prevForm }) => {
    const [file, setFile] = useState<File>();
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<FormData>();
    console.log(formData, "sd")
    const handleSubmits: SubmitHandler<FormData> = (data) => {
        nextForm(data);
    };
    const heading = formData?.routeType && formHeading[formData?.routeType]
    return (
        <div className="mt-2 mb-5">
            <form onSubmit={handleSubmit(handleSubmits)} className="">
                <div className="w-full flex gap-5">
                    <div className="w-1/2 space-y-5">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Ride name</label>
                            <input type="input" placeholder={"ride name"} {...register("url", { required: true })} className=" border px-2 py-[6px]" />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-5/12 flex flex-col">
                                <label className="font-medium text-gray-600">Start date</label>
                                <input className=" border px-2 py-[6px] " placeholder="Start date" type="date" />
                            </div>
                            <div className=" w-3/12 flex flex-col">
                                <label className="font-medium text-gray-600">Start time</label>
                                <input className=" border px-2 py-[6px] " placeholder="Start date" type="time" />
                            </div>
                            <div className=" w-3/12 flex-col">
                                <label className="font-medium text-gray-600">End time</label>
                                <input className=" border px-2 py-[6px]" placeholder="Start date" type="time" />
                            </div>

                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col w-1/2">
                                <label className="font-medium text-gray-600">Distance (miles)</label>
                                <input type="input" placeholder={"Distance"} {...register("url", { required: true })} className=" border px-2 py-[6px]" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="font-medium text-gray-600">Avg speed (mph)</label>
                                <input type="input" placeholder={"Avg speed"} {...register("url", { required: true })} className=" border px-2 py-[6px]" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col w-1/2">
                                <select {...register("url", { required: "Ride type is required" })} className={`bg-white py-[10px] w-full px-4 border rounded-lg `}>
                                    <option value="" disabled selected>Activity Type</option>
                                    <option value={1}>Road</option>
                                    <option value={2}>MTB</option>
                                    <option value={3}>Mountain</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <select {...register("url", { required: "Ride type is required" })} className={`bg-white py-[10px] w-full px-4 border rounded-lg `}>
                                    <option value="" disabled selected>ride type</option>
                                    <option value={1}>Road</option>
                                    <option value={2}>MTB</option>
                                    <option value={3}>Mountain</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2"></div>
                </div>
                <div className="flex justify-between mt-5">
                    <button type="button" onClick={startOver} className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold">START OVER</button>
                    <div className="flex gap-3">
                        <button type="button" onClick={prevForm} className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold">PREVIOUS</button>
                        <button type="submit" className="bg-primaryText text-white px-9 py-2 rounded-sm font-semibold">NEXT</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form3;
