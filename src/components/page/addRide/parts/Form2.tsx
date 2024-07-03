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
const Form2: React.FC<Form1Props> = ({ nextForm, formData, startOver, prevForm }) => {
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
    const handleChange = (file:File) => {
        setFile(file);
      };
    const heading = formData?.routeType && formHeading[formData?.routeType]
    return (
        <div className="mt-2 mb-5">
            <form onSubmit={handleSubmit(handleSubmits)} className="">
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
                         <FileUploader handleChange={handleChange} name="file" types={fileTypes} classes="fileUploader" multiple={false} label="Select or drag & drop your gpx file here!" />
                    </div>
                    : <>
                        <div className="space-y-3 pt-6">
                            <div className="flex flex-col ">
                                <label className="font-medium text-gray-600">Public {formData?.routeType === "strava" ? "Strava" : "RWGPS"} route link</label>
                                <input type="input" placeholder={formData?.routeType === "strava" ? "https://www.strava.com/routes/your-route-id" : "https://ridewithgps.com/routes/your-route-id"} {...register("url", { required: true })} className="w-1/2 border px-2 py-2" />
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

export default Form2;
