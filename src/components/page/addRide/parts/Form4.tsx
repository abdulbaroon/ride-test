"use client";
import { RootState } from "@/redux/store/store";
import Link from "next/link";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoAlert } from "react-icons/io5";
import { useSelector } from "react-redux";

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
    isGroup?: boolean;
    activityTags?: string[];
    hubList?: number[];
    promoLink?: string;
}

interface HubList {
    hubID: number;
    hubName: string;
}

const Form4: React.FC<Form1Props> = ({ nextForm, formData, startOver }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const activityTag = useSelector<RootState, string[]>(
        (state) => state.addRide.activityTags
    );
    const hublist = useSelector<RootState, HubList[]>(
        (state) => state.addRide.hubList
    );

    const handleSubmits: SubmitHandler<FormData> = (data) => {
        nextForm(data);
    };

    return (
        <div className="mt-2 mb-5">
            <form onSubmit={handleSubmit(handleSubmits)} className="">
                <div>
                    <div className="flex gap-7 mt-5">
                        <div className="border-b w-1/2 pb-2">
                            <label className="inline-flex items-center cursor-pointer">
                                <input {...register("isGroup")} type="checkbox" className="sr-only peer" />
                                <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                <div className="flex flex-col leading-5">
                                    <span className="font-medium">Community</span>
                                    <span className="text-sm text-gray-500">Can’t lead the ride, select this option set as a community ride.</span>
                                </div>
                            </label>
                        </div>
                        <div className="border-b w-1/2 pb-2">
                            <label className="inline-flex items-center cursor-pointer">
                                <input {...register("isGroup")} type="checkbox" className="sr-only peer" />
                                <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                <div className="flex flex-col leading-5">
                                    <span className="font-medium">Private</span>
                                    <span className="text-sm text-gray-500">Private ride. You must invite your friends.</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-7 mt-5 ">
                        <div className="border-b w-1/2 pb-2 ">
                            <label className="inline-flex items-center cursor-pointer">
                                <input {...register("isGroup")} type="checkbox" className="sr-only peer" />
                                <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                <div className="flex flex-col leading-5">
                                    <span className="font-medium">Drop</span>
                                    <span className="text-sm text-gray-500">Want to wait for anyone that may drop off?</span>
                                </div>
                            </label>
                        </div>
                        <div className="border-b w-1/2 pb-2">
                            <label className="inline-flex items-center cursor-pointer">
                                <input {...register("isGroup")} type="checkbox" className="sr-only peer" />
                                <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                <div className="flex flex-col leading-5">
                                    <span className="font-medium">Lights Required</span>
                                    <span className="text-sm text-gray-500">Need to ensure all has lights for safety?</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-7 mt-5">
                        <div className="flex flex-col w-1/2">
                            <label className="font-medium text-gray-600 ">Activity Tags</label>
                            <div className="flex flex-col relative mt-1">
                                <select
                                    {...register("activityTags", { required: "Activity tags are required" })}
                                    className="bg-white border px-2 py-[6px]"
                                >
                                    {activityTag?.map((data, i) => (
                                        <option value={data} key={i}>
                                            {data}
                                        </option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className="w-5 h-auto absolute right-3 top-[11px]" />
                            </div>
                            {errors.activityTags && (
                                <p className="text-red-500 text-xs pt-1">{errors.activityTags.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label className="font-medium text-gray-600">Hub List</label>
                            <div className="flex flex-col relative mt-1 ">
                                <select
                                    {...register("hubList", { required: "Hub list is required" })}
                                    className="bg-white border px-2 py-[6px]"

                                >
                                    <option value="" disabled selected>
                                        Select Hub
                                    </option>
                                    {hublist?.map((data) => (
                                        <option value={data.hubID} key={data.hubID}>
                                            {data.hubName}
                                        </option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className="w-5 h-auto absolute right-3 top-[11px]" />
                            </div>
                            {errors.hubList && (
                                <p className="text-red-500 text-xs pt-1">{errors.hubList.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-5 gap-7">
                        <div className="flex flex-col w-[49%]">
                            <label className="font-medium text-gray-600">Event promoter link</label>
                            <input
                                className="border px-2 py-[6px]"
                                placeholder="Event promoter link"
                                type="text"
                                {...register("promoLink")}
                            />
                            {errors.promoLink && (
                                <p className="text-red-500 text-xs pt-1">{errors.promoLink.message}</p>
                            )}
                        </div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="mt-5 flex w-full justify-between gap-7">
                        <div className="w-1/2">
                            <FileUploader  name="file" types={["pdf"]} classes="pdfuploader" multiple={false} label="Select or drag & drop your Waiver PDF file here!" />
                        </div>
                        <div className="w-1/2">
                            <FileUploader  name="file" types={["pdf"]} classes="pdfuploader" multiple={false} label="Select or drag & drop your Ride Image file here!" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-5">
                    <button type="button" onClick={startOver} className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold">START OVER</button>
                    <div className="flex gap-3">
                        <button type="submit" className="bg-primaryText text-white px-9 py-2 rounded-sm font-semibold">NEXT</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form4;
