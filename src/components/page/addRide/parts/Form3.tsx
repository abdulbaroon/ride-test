"use client";
import MapBox from "@/components/module/MapBox";
import MapComponent from "@/components/module/MapComponent";
import { RootState } from "@/redux/store/store";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
import ReactQuill from "react-quill";
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
    prevForm: () => void;
}

interface FormData {
    rideName?: string;
    startDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    routeType?: string;
    distance?: string;
    centerLatitude?: number;
    centerLongitude?: any;
    geoJSON?: {
        features?: any[];
    };
}

interface ComponentType {
    types: string[];
    long_name: string;
}

interface ActivityType {
    activityTypeID: number;
    activityTypeName: string;
    activityTypeIcon: string;
    activityTypeColor: string;
}

interface RootStates {
    addRide: {
        activityTypes: ActivityType[];
    };
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: [] }],
        [{ font: [] }],
        [{ align: ["right", "center", "justify"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ color: ["red", "#785412"] }],
        [{ background: ["red", "#785412"] }],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
];

const Form3: React.FC<Form1Props> = ({ nextForm, formData, startOver, prevForm }) => {
    const [file, setFile] = useState<File>();
    const [lat, setLat] = useState<number>(28.5355);
    const [lng, setLng] = useState<number>(77.3910);
    const [code, setCode] = useState("hellllo");
    const [city, setCity] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const autocompleteRef = useRef<any>(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const activityType = useSelector<RootState, ActivityType[]>(
        (state) => state.addRide.activityTypes
    );

    const handleSubmits: SubmitHandler<FormData> = (data) => {
        nextForm(data);
    };

    const loadGoogleMapsScript = useCallback(() => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places`;
        script.async = true;
        script.onload = () => {
            initAutocomplete();
        };
        document.body.appendChild(script);
    }, []);

    const initAutocomplete = useCallback(() => {
        const input = document.getElementById("autocomplete") as HTMLInputElement;
        if (input) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
                types: ["address"],
            });
            autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
        }
    }, []);

    const handlePlaceSelect = useCallback((): void => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry) {
            const address = place.formatted_address;
            const homeBaseLat = place.geometry.location.lat();
            const homeBaseLng = place.geometry.location.lng();
            let homeBaseCity = "";
            let homeBaseState = "";
            let homeBaseCountry = "";
            const components = place.address_components;
            components.forEach((component: ComponentType) => {
                if (component.types.includes("locality")) homeBaseCity = component.long_name;
                if (component.types.includes("administrative_area_level_1")) homeBaseState = component.long_name;
                if (component.types.includes("country")) homeBaseCountry = component.long_name;
            });
            setLat(homeBaseLat);
            setLng(homeBaseLng);
            setCity(homeBaseCity);
            setCountry(homeBaseCountry);
            setState(homeBaseState);
            setValue("location", address);
        }
    }, [setValue]);

    useEffect(() => {
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
    }, [loadGoogleMapsScript, initAutocomplete]);

    const handleProcedureContentChange = useCallback((content: string) => {
        setCode(content);
        console.log(content);
    }, []);

    const mapMemo = useMemo(
        () => <MapBox center={[lng, lat]} initialZoom={11} circle={10 * 10} className={"h-[43vh]"} />,
        [lng, lat]
    );

    return (
        <div className="mt-2 mb-5">
            <form onSubmit={handleSubmit(handleSubmits)} className="">
                <div className="w-full flex gap-5">
                    <div className="w-1/2 space-y-5">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Ride name</label>
                            <input
                                type="text"
                                placeholder="ride name"
                                {...register("rideName", { required: "Ride name is required" })}
                                className="border px-2 py-[6px]"
                            />
                            {errors.rideName && (
                                <p className="text-red-500 text-xs pt-1">{errors.rideName.message}</p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <div className="w-5/12 flex flex-col">
                                <label className="font-medium text-gray-600">Start date</label>
                                <input
                                    className="border px-2 py-[6px]"
                                    placeholder="Start date"
                                    type="date"
                                    {...register("startDate", { required: "Start date is required" })}
                                />
                                {errors.startDate && (
                                    <p className="text-red-500 text-xs pt-1">{errors.startDate.message}</p>
                                )}
                            </div>
                            <div className="w-3/12 flex flex-col">
                                <label className="font-medium text-gray-600">Start time</label>
                                <input
                                    className="border px-2 py-[6px]"
                                    placeholder="Start time"
                                    type="time"
                                    {...register("startTime", { required: "Start time is required" })}
                                />
                                {errors.startTime && (
                                    <p className="text-red-500 text-xs pt-1">{errors.startTime.message}</p>
                                )}
                            </div>
                            <div className="w-3/12 flex flex-col">
                                <label className="font-medium text-gray-600">End time</label>
                                <input
                                    className="border px-2 py-[6px]"
                                    placeholder="End time"
                                    type="time"
                                    {...register("endTime", { required: "End time is required" })}
                                />
                                {errors.endTime && (
                                    <p className="text-red-500 text-xs pt-1">{errors.endTime.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-full flex flex-col">
                                <label className="font-medium text-gray-600">
                                    Start Location - search
                                </label>
                                <input
                                    {...register("location", { required: "Home location is required" })}
                                    id="autocomplete"
                                    className="bg-white border px-2 py-[6px]"
                                    placeholder="Search location"
                                    type="text"
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-xs pt-1">{errors.location.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Ride Type </label>
                            <div className="flex flex-col w-full relative">
                                <select
                                    {...register("distance", { required: "Ride type is required" })}
                                    className="bg-white border px-2 py-[6px]"
                                >
                                    <option value="" disabled selected>
                                        Ride Type
                                    </option>
                                    {activityType.map((data) => (
                                        <option value={data.activityTypeID} key={data.activityTypeID}>
                                            {data.activityTypeName}
                                        </option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className="w-5 h-auto absolute right-3 top-[11px]" />
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mt-5">
                        <div>
                            {formData?.centerLatitude ? (
                                <MapComponent
                                    centerLatitude={formData.centerLatitude}
                                    centerLongitude={formData.centerLongitude}
                                    geoJSON={formData.geoJSON}
                                    className=""
                                />
                            ) : (
                                mapMemo
                            )}
                        </div>
                    </div>
                </div>

                <div className="my-5">
                    <label className="font-medium text-gray-600">Note</label>
                    <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={code}
                        onChange={handleProcedureContentChange}
                    />
                </div>
                <div className="flex justify-between mt-16">
                    <button
                        type="button"
                        onClick={startOver}
                        className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold"
                    >
                        START OVER
                    </button>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={prevForm}
                            className="bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-sm font-semibold"
                        >
                            PREVIOUS
                        </button>
                        <button
                            type="submit"
                            className="bg-primaryText text-white px-9 py-2 rounded-sm font-semibold"
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form3;
