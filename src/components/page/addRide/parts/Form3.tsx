"use client";
import { stravaIcon } from "@/assets";
import MapComponent from "@/components/module/MapComponent";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
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
    distance?: string
}


const Form3: React.FC<Form1Props> = ({ nextForm, formData, startOver, prevForm }) => {
    const [file, setFile] = useState<File>();
    const autocompleteRef = useRef<any>(null);
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

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places`;
            script.async = true;
            script.onload = () => {
                initAutocomplete();
            };
            document.body.appendChild(script);
        };
        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            initAutocomplete();
        }
        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);

    const initAutocomplete = () => {
        const input = document.getElementById("autocomplete") as HTMLInputElement;
        if (input) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
                types: ["address"]
            });
            autocompleteRef.current.addListener("place_changed", );
        }
    };
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
                        <div className="flex ">
                            <div className='w-full flex flex-col'>
                                <label className='font-medium text-gray-600'>Start Location - search</label>
                                <input {...register("homeLocation", { required: "Home location is required" })} id="autocomplete" className='bg-white border px-2 py-[6px]' placeholder='Search location' type='text' />
                                {errors.homeLocation && <p className='text-red-500 text-xs pt-1'>{errors.homeLocation.message}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Ride Type </label>
                            <div className="flex flex-col w-full relative">
                                <select {...register("distance", { required: "Ride type is required" })} className={` bg-white border px-2 py-[6px] `}>
                                    <option value="" disabled selected>Ride Type</option>
                                    {[1, 2, 3, 4]?.map((data) => (
                                        <option value={data} key={data}>{data}</option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className=' w-5 h-auto  absolute right-3 top-[11px]' />
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mt-5">
                        <div>
                            {formData?.centerLatitude && <MapComponent centerLatitude={formData?.centerLatitude} centerLongitude={formData?.centerLongitude} geoJSON={formData?.geoJSON} />}
                        </div>
                    </div>
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
