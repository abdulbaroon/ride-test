"use client";
import MapBox from "@/components/module/MapBox";
import MapComponent from "@/components/module/MapComponent";
import { RootState } from "@/redux/store/store";
import { addDays, format, setHours, setMinutes } from "date-fns";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
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
    startDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    location?: string;
    routeType?: string;
    distance?: string;
    centerLatitude?: number;
    centerLongitude?: any;
    rideType?: string;
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
    const [code, setCode] = useState("");
    const [address, setAddress] = useState()
    const [city, setCity] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const autocompleteRef = useRef<any>(null);
    const [startDate, setStartDate] = useState<Date | null>(addDays(new Date(), 1));
    const [startTime, setStartTime] = useState<Date | null>(setHours(setMinutes(new Date(), 30), 7));
    const [endTime, setEndTime] = useState<Date | null>(setHours(setMinutes(new Date(), 30), 11));
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
        const payload = {
            ...data,
            note: code,
            startAddress: address,
            startCity: city,
            startState: state,
            startCountry: country,
            startLat: lat,
            startLng: lng,
            startDate: startDate ,
            startTime:startTime? format(startTime,'hh:mm:ss'):null,
            endTime:endTime? format(endTime,'hh:mm:ss'):null,
        }
        nextForm(payload);
    };

    const loadGoogleMapsScript = useCallback(() => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places,geometry`;
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
                types: ["establishment", "geocode"],
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
            setAddress(address)
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
    }, []);
    const handelMarkerChnage = (cords: [number, number]) => {
        setLng(cords[0])
        setLat(cords[1])
    }
    const mapMemo = useMemo(
        () => <MapBox center={[lng, lat]} initialZoom={11} circle={10 * 1} className={"h-[43vh]"} setMarkerPos={handelMarkerChnage} />,
        [lng, lat]
    );

    return (
        <div className="mt-2 mb-5">
            <form onSubmit={handleSubmit(handleSubmits)} className="">
                <div className="w-full flex flex-col tablet:flex-row gap-5">
                    <div className="tablet:w-1/2 w-full space-y-5">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Ride name</label>
                            <input
                                type="text"
                                defaultValue={formData?.rideName}
                                placeholder="ride name"
                                {...register("rideName", { required: "Please enter a ride name." })}
                                className={`border px-2 py-[6px] w-full ${errors.rideName ? "input-error" : ""}`}
                            />
                            {errors.rideName && (
                                <p className="text-red-500 text-xs pt-1">{errors.rideName.message}</p>
                            )}
                        </div>
                        <div className="flex gap-4 flex-col tablet:flex-row ">
                            <div className="w-full tablet:w-1/2 flex flex-col">
                                <label className="font-medium text-gray-600">Start date</label>
                                <DatePicker
                                    showIcon
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    className="custom-datepicker-input"
                                    dateFormat="eee, MMMM d, yyyy"
                                />
                            </div>
                            <div className="flex w-full tablet:w-1/2 gap-3 ">
                                <div className="w-1/2 flex flex-col">
                                    <label className="font-medium text-gray-600">Start time</label>
                                    <DatePicker
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        className="custom-datepicker-input"
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                    />
                                </div>
                                <div className="w-1/2 flex flex-col">
                                    <label className="font-medium text-gray-600">End time</label>
                                    <DatePicker
                                        selected={endTime}
                                        onChange={(date) => setEndTime(date)}
                                        className="custom-datepicker-input"
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                    />
                                    {errors.endTime && (
                                        <p className="text-red-500 text-xs pt-1">{errors.endTime.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-full flex flex-col">
                                <label className="font-medium text-gray-600">
                                    Start Location - search
                                </label>
                                <input
                                    {...register("location", { required: "Please select a start location." })}
                                    id="autocomplete"
                                    defaultValue={formData?.location}
                                    className={`bg-white border px-2 py-[6px] ${errors.location ? "input-error" : ""}`}
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
                                    defaultValue={formData?.rideType}
                                    {...register("rideType", { required: "Please select a Ride Type" })}
                                    className={`bg-white border px-2 py-[6px] ${errors.rideType ? "input-error" : ""}`}
                                >
                                    <option value="" disabled selected className={`${true ? "text-black" : "text-gray-500"}`}>
                                        Ride Type
                                    </option>
                                    {activityType.map((data) => (
                                        <option value={data.activityTypeID} key={data.activityTypeID}>
                                            {data.activityTypeName}
                                        </option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className="w-5 h-auto absolute right-3 top-[11px]" />
                                {errors.rideType && (
                                    <p className="text-red-500 text-xs pt-1">{errors.rideType.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="tablet:w-1/2 w-full mt-5">
                        <div>
                            {(
                                mapMemo
                            )}
                        </div>
                    </div>
                </div>
                <div className="my-5">
                    <label className="font-medium text-gray-600">Notes</label>
                    <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={code}
                        onChange={handleProcedureContentChange}
                    />
                </div>
                <div className="flex justify-between mt-28 tablet:mt-20">
                    <button type="button" onClick={startOver} className="text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold h-fit">START OVER</button>
                    <div className="flex gap-3 flex-col-reverse tablet:flex-row">
                        <button type="button" onClick={prevForm} className="text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold">PREVIOUS</button>
                        <button type="submit" className="text-sm tablet:text-base bg-primaryText text-white px-9 py-2 rounded-md font-semibold">NEXT</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form3;
