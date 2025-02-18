"use client";
import MapBox from "@/components/module/MapBox";
import MapComponent from "@/components/module/MapComponent";
import { RootState } from "@/redux/store/store";
import { addDays, format, setHours, setMinutes } from "date-fns";
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";
import DatePicker from "react-datepicker";
import { setTime } from "react-datepicker/dist/date_utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";

/**
 * Represents the props for the Form3 component.
 */
interface Form1Props {
    nextForm: (data: FormData) => void;  // Function to handle form submission
    formData?: FormData;                  // Initial form data
    startOver: () => void;                // Function to reset the form
    prevForm: () => void;                 // Function to go to the previous form
}

/**
 * Represents the data structure for the form.
 */
interface FormData {
    rideName?: string;                     // Name of the ride
    note?: string | undefined;             // Notes for the ride
    startDate?: Date | null;               // Start date of the ride
    startTime?: Date | null;               // Start time of the ride
    startLat?: number;                     // Starting latitude
    startLng?: number;                     // Starting longitude
    startState?: string;                   // Starting state
    startCountry?: string;                 // Starting country
    startCity?: string;                    // Starting city
    endTime?: Date | null;                 // End time of the ride
    location?: string;                     // Location description
    routeType?: string;                    // Type of route
    distance?: string;                     // Distance of the ride
    centerLatitude?: number;               // Center latitude for the map
    centerLongitude?: any;                 // Center longitude for the map
    rideType?: string;                     // Type of the ride
    startAddress?: string;                 // Starting address
    geoJSON?: {
        features?: any[];                  // GeoJSON features for the map
    };
}

/**
 * Represents the component type for address components from Google Places API.
 */
interface ComponentType {
    types: string[];                       // Types of the address component
    long_name: string;                     // Long name of the address component
}

/**
 * Represents the structure for activity types.
 */
interface ActivityType {
    activityTypeID: number;               // ID of the activity type
    activityTypeName: string;              // Name of the activity type
    activityTypeIcon: string;              // Icon for the activity type
    activityTypeColor: string;             // Color associated with the activity type
}

/**
 * Represents the root state structure for Redux.
 */
interface RootStates {
    addRide: {
        activityTypes: ActivityType[];     // List of activity types
    };
}

/**
 * Module configuration for ReactQuill toolbar.
 */
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

/**
 * Formats for ReactQuill editor.
 */
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

/**
 * Form3 component for ride details.
 * 
 * @param {Form1Props} props - Props for the component.
 */
const Form3: React.FC<Form1Props> = ({
    nextForm,
    formData,
    startOver,
    prevForm,
}) => {
    const profile = useSelector<RootState, any>(
        (state) => state.auth.profileData
    );
    
    const [lat, setLat] = useState<number>(
        formData?.startLat || profile?.homeBaseLat
    );
    const [lng, setLng] = useState<number>(
        formData?.startLng || profile?.homeBaseLng
    );
    const [code, setCode] = useState<string | undefined>(
        formData?.note || "Let's ride and be respectful to each other!"
    );
    const [address, setAddress] = useState<string | undefined>(
        formData?.startAddress
    );
    const [city, setCity] = useState<string | undefined>(formData?.startCity);
    const [state, setState] = useState<string | undefined>(
        formData?.startState
    );
    const [country, setCountry] = useState<string | undefined>(
        formData?.startCountry
    );
    const autocompleteRef = useRef<any>(null);

    const [startDate, setStartDate] = useState<Date | null>(
        addDays(new Date(), 1)
    );
    const [startTime, setStartTime] = useState<Date | null>(
        setHours(setMinutes(new Date(), 30), 7)
    );
    const [endTime, setEndTime] = useState<Date | null>(
        setHours(setMinutes(new Date(), 30), 11)
    );

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const ridetype = watch("rideType");

    const activityType = useSelector<RootState, ActivityType[]>(
        (state) => state.addRide.activityTypes
    );

    useEffect(() => {
        if (formData?.startDate) {
            setStartDate(formData.startDate);
        }
        if (formData?.startTime) {
            setStartTime(formData.startTime);
        }
        if (formData?.endTime) {
            setEndTime(formData.endTime);
        }
        if (formData?.startLat) {
            setLat(formData.startLat);
        }
        if (formData?.startLng) {
            setLng(formData.startLng);
        }
    }, []);

    /**
     * Handles form submission.
     * 
     * @param {FormData} data - The form data submitted by the user.
     */
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
            startDate: startDate,
            startTime: startTime,
            endTime: endTime,
        };
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

    /**
     * Handles the selection of a place from the autocomplete suggestions.
     */
    const handlePlaceSelect = useCallback((): void => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry) {
            // Extract the name and vicinity (which might reflect what is shown in the dropdown)
            const placeName = place.name || "";
            const placeVicinity = place.vicinity || "";

            const components = place.address_components;
            let streetNumber = "";
            let route = "";
            let homeBaseCity = "";
            let homeBaseState = "";
            let homeBaseCountry = "";
            let postalCode = "";

            components.forEach((component: ComponentType) => {
                if (component.types.includes("street_number")) streetNumber = component.long_name;
                if (component.types.includes("route")) route = component.long_name;
                if (component.types.includes("locality")) homeBaseCity = component.long_name;
                if (component.types.includes("administrative_area_level_1")) homeBaseState = component.long_name;
                if (component.types.includes("country")) homeBaseCountry = component.long_name;
                if (component.types.includes("postal_code")) postalCode = component.long_name;
            });

            const fullAddress = `${streetNumber} ${route}, ${homeBaseCity}, ${homeBaseState}, ${postalCode}, ${homeBaseCountry}`;

            // Selected address fallback
            const selectedAddress = place.name
                ? `${place.name}, ${place.vicinity}, ${homeBaseState}`
                : fullAddress;

            const homeBaseLat = place.geometry.location.lat();
            const homeBaseLng = place.geometry.location.lng();

            // Update state with the selected address
            setLat(homeBaseLat);
            setLng(homeBaseLng);
            setCity(homeBaseCity);
            setCountry(homeBaseCountry);
            setState(homeBaseState);
            setAddress(selectedAddress);
            setValue("location", selectedAddress);
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

    /**
     * Handles changes in the content of the procedure.
     * 
     * @param {string} content - The new content.
     */
    const handleProcedureContentChange = useCallback((content: string) => {
        setCode(content);
    }, []);

    /**
     * Handles changes in marker position on the map.
     * 
     * @param {[number, number]} cords - The new coordinates for the marker.
     */
    const handelMarkerChnage = (cords: [number, number]) => {
        setLng(cords[0]);
        setLat(cords[1]);
    };

    const mapMemo = useMemo(
        () => (
            <MapBox
                center={[lng, lat]}
                initialZoom={11}
                className={"h-[30vh]"}
                setMarkerPos={handelMarkerChnage}
            />
        ),
        [lng, lat]
    );

    return (
        <div className='mt-2 mb-5'>
            <form onSubmit={handleSubmit(handleSubmits)} className=''>
                <div className='w-full flex flex-col tablet:flex-row gap-5'>
                    <div className='tablet:w-1/2 w-full space-y-5'>
                        <div className='flex flex-col'>
                            <label className='text-sm text-gray-400'>
                                Ride name
                            </label>
                            <input
                                type='text'
                                defaultValue={formData?.rideName}
                                placeholder='ride name'
                                {...register("rideName", {
                                    required: "Please enter a ride name.",
                                })}
                                className={`border rounded-md px-2 py-[6px] w-full ${
                                    errors.rideName ? "input-error" : ""
                                }`}
                            />
                            {errors.rideName && (
                                <p className='text-red-500 text-xs pt-1'>
                                    {errors.rideName.message}
                                </p>
                            )}
                        </div>
                        <div className='flex gap-4 flex-col tablet:flex-row '>
                            <div className='w-full tablet:w-1/2 flex flex-col'>
                                <label className='text-sm text-gray-400'>
                                    Start date
                                </label>
                                <DatePicker
                                    showIcon
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    className='custom-datepicker-input  !rounded-md'
                                    dateFormat='eee, MMMM d, yyyy'
                                />
                            </div>
                            <div className='flex w-full tablet:w-1/2 gap-3 '>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-gray-400'>
                                        Start time
                                    </label>
                                    <DatePicker
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        className='custom-datepicker-input !rounded-md '
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption='Time'
                                        dateFormat='h:mm aa'
                                    />
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-gray-400'>
                                        End time
                                    </label>
                                    <DatePicker
                                        selected={endTime}
                                        onChange={(date) => setEndTime(date)}
                                        className='custom-datepicker-input !rounded-md'
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption='Time'
                                        dateFormat='h:mm aa'
                                    />
                                    {errors.endTime && (
                                        <p className='text-red-500 text-xs pt-1'>
                                            {errors.endTime.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-full flex flex-col'>
                                <label className='text-sm text-gray-400'>
                                    Start Location - search
                                </label>
                                <input
                                    {...register("location", {
                                        required:
                                            "Please select a start location.",
                                    })}
                                    id='autocomplete'
                                    defaultValue={formData?.location}
                                    className={`bg-white border rounded-md px-2 py-[6px] ${
                                        errors.location ? "input-error" : ""
                                    }`}
                                    placeholder='Search location'
                                    type='text'
                                />
                                {errors.location && (
                                    <p className='text-red-500 text-xs pt-1'>
                                        {errors.location.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-sm text-gray-400'>
                                Ride Type{" "}
                            </label>
                            <div className='flex flex-col w-full relative'>
                                <select
                                    defaultValue={formData?.rideType}
                                    {...register("rideType", {
                                        required: "Please select a Ride Type",
                                    })}
                                    className={`bg-white border  rounded-md px-2 py-[6px] ${
                                        ridetype
                                            ? "text-black"
                                            : "text-gray-500"
                                    } ${errors.rideType ? "input-error" : ""}`}>
                                    <option
                                        value=''
                                        disabled
                                        selected
                                        className={`${
                                            ridetype
                                                ? "text-black"
                                                : "text-gray-500"
                                        }`}>
                                        Ride Type
                                    </option>
                                    {activityType.map((data) => (
                                        <option
                                            value={data.activityTypeID}
                                            key={data.activityTypeID}>
                                            {data.activityTypeName}
                                        </option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className='w-5 h-auto absolute right-3 top-[11px]' />
                                {errors.rideType && (
                                    <p className='text-red-500 text-xs pt-1'>
                                        {errors.rideType.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='tablet:w-1/2 w-full mt-5'>
                        <div>{mapMemo}</div>
                    </div>
                </div>
                <div className='my-5'>
                    <label className='text-sm text-gray-400'>Notes</label>
                    <ReactQuill
                        theme='snow'
                        defaultValue="Let's ride and be respectful to each other!"
                        placeholder='Notes for the ride or the route.'
                        className='rounded-md'
                        modules={modules}
                        formats={formats}
                        value={code}
                        style={{
                            minHeight: "300px",
                            height: "300px",
                            fontSize: "20px",
                        }}
                        onChange={handleProcedureContentChange}
                    />
                </div>
                <div className='flex justify-between mt-28 tablet:mt-20'>
                    <button
                        type='button'
                        onClick={startOver}
                        className='text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold h-fit'>
                        START OVER
                    </button>
                    <div className='flex gap-3 flex-col-reverse tablet:flex-row'>
                        <button
                            type='button'
                            onClick={prevForm}
                            className='text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold'>
                            PREVIOUS
                        </button>
                        <button
                            type='submit'
                            className='text-sm tablet:text-base bg-primaryText text-white px-9 py-2 rounded-md font-semibold'>
                            NEXT
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form3;
