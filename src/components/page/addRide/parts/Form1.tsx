"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
    prevForm?: () => void;
}

interface FormData {
    routeType?: string;
}

const Form1: React.FC<Form1Props> = ({ nextForm, formData, startOver }) => {

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm<FormData>();
    useEffect(()=>{
        setValue("routeType",formData?.routeType||"")
    },[])
    const handleSubmits: SubmitHandler<FormData> = (data) => {
        nextForm(data);
    };

    return (
        <div className="mt-2 mb-5">
            <form onSubmit={handleSubmit(handleSubmits)} className="">
                <div className="space-y-2 mt-4">
                    <h1 className=" text-base tablet:text-xl desktop:text-2xl font-bold">Have a route mapped out? Ride with GPS or Strava? Public ride?</h1>
                    <p className="font-bold text-xs tablet:text-sm">Quickly create a ride from public or your created routes or rides and we&apos;ll load most of the ride details for you!</p>
                    <p className="font-bold text-xs tablet:text-sm pb-2">If not, no worries! Just select &quot;No Route&quot; and create a ride with just a start location.</p>
                </div>
                <div className="space-y-3 m-5 pt-6">
                    <div className="flex items-center me-4">
                        <input id="gps-radio" type="radio" value="gps" {...register("routeType", { required: true })} className="w-4 h-4 bg-white border-gray-300" />
                        <label htmlFor="gps-radio" className="ms-2 text-xl font-medium text-gray-900">Link a Route</label>
                    </div>
                    <div className="flex items-center me-4">
                        <input id="gpx-radio" type="radio" value="gpx" {...register("routeType", { required: true })} className="w-4 h-4 bg-white border-gray-300" />
                        <label htmlFor="gpx-radio" className="ms-2 text-xl font-medium text-gray-900">GPX FILE</label>
                    </div>
                    <div className="flex items-center me-4">
                        <input id="noroute-radio" type="radio" value="noroute" {...register("routeType", { required: true })} className="w-4 h-4 bg-white border-gray-300" />
                        <label htmlFor="noroute-radio" className="ms-2 text-xl font-medium text-gray-900">NO ROUTE</label>
                    </div>
                </div>
                {errors.routeType && <p className="text-red-500 text-sm mt-1">Please select a route type.</p>}
                <div className="flex items-center text-gray-600 gap-2 border-b py-5 mt-9 text-sm tablet:text-base">
                    <IoAlert className="bg-gray-300 text-sm p-[1px] rounded-sm" />
                    <p>Want to create some great routes?? Check out
                        <Link href={"#"} className="text-primaryText"> Ride with GPS </Link>
                        or
                        <Link href={"#"} className="text-primaryText"> Strava</Link>!
                    </p>
                </div>
                <div className="flex justify-between mt-5">
                    <button type="button" onClick={startOver} className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold text-sm tablet:text-base">START OVER</button>
                    <div className="flex gap-3">
                        <button type="submit" className="bg-primaryText text-white px-9 py-2 rounded-md font-semibold text-sm tablet:text-base">NEXT</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form1;
