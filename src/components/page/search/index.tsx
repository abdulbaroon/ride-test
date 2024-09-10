"use client";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePlacesWidget } from "react-google-autocomplete";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { searchRide } from "@/redux/slices/addRideSlice";
import { ImSearch } from "react-icons/im";
import MapCard from "@/components/basic/MapCard";
import { toast } from "react-toastify";
import { User } from "@/shared/types/account.types";
import Slider from "react-slick";
import { isArray } from "lodash";
import { addDays, format } from "date-fns";

interface FormData {
    rideName?: string;
    location?: string;
    startTime?: string;
    endTime?: string;
    rideType?: string;
    difficulty?: string;
    minDistance?: string;
    maxDistance?: number;
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

interface DifficultyLevel {
    difficultyLevelID: number;
    levelName: string;
    levelDescription: string;
    levelColor: string;
    levelIcon: string;
}

export const SearchPage = () => {
    const [lat, setLat] = useState<number>(28.5355);
    const [lng, setLng] = useState<number>(77.391);
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [ride, setRide] = useState<[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const activityType = useSelector<RootState, ActivityType[]>(
        (state) => state.addRide.activityTypes
    );
    const difficultyLevel = useSelector<RootState, DifficultyLevel[]>(
        (state) => state.addRide.difficultyLevels
    );

    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        if (user.userProfile?.defaultRadius) {
            setValue("maxDistance", user.userProfile?.defaultRadius);
        }
    }, [user]);

    useEffect(() => {
        if (user.userProfile?.defaultRadius) {
            setValue("maxDistance", user.userProfile?.defaultRadius);
        }
        
        const today = new Date();
        const defaultStartDate = format(addDays(today, 1), "yyyy-MM-dd");
        const defaultEndDate = format(addDays(today, 30), "yyyy-MM-dd");
    
        setValue("startTime", defaultStartDate);
        setValue("endTime", defaultEndDate);
    }, [user, setValue]);
    const handlePlaceSelect = useCallback(
        (place: google.maps.places.PlaceResult): void => {
            if (place && place.geometry && place.geometry.location) {
                const address = place.formatted_address;
                const homeBaseLat = place.geometry.location.lat();
                const homeBaseLng = place.geometry.location.lng();
                let homeBaseCity = "";
                let homeBaseState = "";
                let homeBaseCountry = "";
                const components = place.address_components || [];
                components.forEach((component: ComponentType) => {
                    if (component.types.includes("locality"))
                        homeBaseCity = component.long_name;
                    if (component.types.includes("administrative_area_level_1"))
                        homeBaseState = component.long_name;
                    if (component.types.includes("country"))
                        homeBaseCountry = component.long_name;
                });
                setLat(homeBaseLat);
                setLng(homeBaseLng);
                setCity(homeBaseCity);
                setCountry(homeBaseCountry);
                setState(homeBaseState);
                setAddress(address || "");
                setValue("location", address || "");
            }
        },
        [setValue]
    );

    const { ref: autocompleteRef } = usePlacesWidget({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API || "",
        onPlaceSelected: handlePlaceSelect,
        options: {
            types: ["establishment", "geocode"],
        },
    });

    const handleSubmits: SubmitHandler<FormData> = async (data) => {
        const payload = {
            userID: user.id || 1,
            startLat: lat,
            startLng: lng,
            radius:
                Number(data.maxDistance) ||
                Number(user.userProfile?.defaultRadius),
            activityName: data.rideName || null,
            startDate: data.startTime || null,
            endDate: data.endTime || null,
            activityTypeID: Number(data.rideType) || null,
            difficultyLevelID: Number(data.difficulty) || null,
            minDistance: Number(data.minDistance) || null,
            maxDistance: Number(data.maxDistance) || null,
        };
        const response = await dispatch(searchRide(payload));
        if (searchRide.fulfilled.match(response)) {
            if (response.payload.length > 0) {
                setRide(response.payload);
                toast.success(`We found ${response.payload.length} rides!`);
            } else {
                toast.error("No rides found");
                setRide([]);
            }
        } else if (searchRide.rejected.match(response)) {
            toast.error("failed to find ride");
        }
    };
 
    return (
        <div className='mt-[90px] w-11/12 mx-auto  flex gap-10 p-4 !max-w-[1320px]'>
            <div className='w-4/12 bg-white rounded-2xl shadow-lg h-fit'>
                <h1 className='text-2xl font-bold p-4 border-b'>
                    Search Criteria
                </h1>
                <form onSubmit={handleSubmit(handleSubmits)} className=''>
                    <div className='w-11/12 mx-auto my-6 space-y-3'>
                        <div className='flex flex-col'>
                            <label className='font-normal text-sm text-gray-400'>
                                Start Location - search
                            </label>
                            <input
                                type='text'
                                className='border px-2 py-[6px] w-full rounded-lg'
                                {...register("location", {
                                    required:
                                        "Please search and select a location",
                                })}
                                ref={autocompleteRef as any}
                            />
                            {errors.location && (
                                <p className='text-red-500 text-xs pt-1'>
                                    {errors.location.message}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-normal text-sm text-gray-400'>
                                Ride name (can be partial)
                            </label>
                            <input
                                type='text'
                                placeholder='Ride name'
                                {...register("rideName")}
                                className='border px-2 py-[6px] w-full rounded-lg'
                            />
                            {errors.rideName && (
                                <p className='text-red-500 text-xs pt-1'>
                                    {errors.rideName.message}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-normal text-sm text-gray-400'>
                                Starts within x miles of location
                            </label>
                            <input
                                type='number'
                                placeholder=''
                                {...register("maxDistance", {
                                    required: "Please enter a ride radius",
                                })}
                                className='border px-2 py-[6px] w-full rounded-lg remove-arrow'
                            />
                            {errors.maxDistance && (
                                <p className='text-red-500 text-xs pt-1'>
                                    {errors.maxDistance.message}
                                </p>
                            )}
                        </div>
                        <div className='flex w-full gap-3'>
                            <div className='w-1/2 flex flex-col'>
                                <label className='font-normal text-sm text-gray-400'>
                                    Date from
                                </label>
                                <input
                                    className='border px-2 py-[6px]'
                                    placeholder='Start date'
                                    type='date'
                                    {...register("startTime")}
                                />
                                {errors.startTime && (
                                    <p className='text-red-500 text-xs pt-1'>
                                        {errors.startTime.message}
                                    </p>
                                )}
                            </div>
                            <div className='w-1/2 flex flex-col'>
                                <label className='font-normal text-sm text-gray-400'>
                                    Date to
                                </label>
                                <input
                                    className='border px-2 py-[6px]'
                                    placeholder='End date'
                                    type='date'
                                    {...register("endTime")}
                                />
                                {errors.endTime && (
                                    <p className='text-red-500 text-xs pt-1'>
                                        {errors.endTime.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-normal text-sm text-gray-400'>
                                Ride Type
                            </label>
                            <div className='flex flex-col w-full relative'>
                                <select
                                    {...register("rideType")}
                                    className='bg-white border px-2 py-[6px]'>
                                    <option value='' disabled selected>
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
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-normal text-sm text-gray-400'>
                                Difficulty Level
                            </label>
                            <div className='flex flex-col w-full relative'>
                                <select
                                    {...register("difficulty")}
                                    className='bg-white border px-2 py-[6px]'>
                                    <option value='' disabled selected>
                                        Difficulty Level
                                    </option>
                                    {difficultyLevel?.map((data) => (
                                        <option
                                            value={data.difficultyLevelID}
                                            key={data.difficultyLevelID}>
                                            {data.levelName}
                                        </option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className='w-5 h-auto absolute right-3 top-[11px]' />
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-normal text-sm text-gray-400'>
                                Minimum ride distance
                            </label>
                            <input
                                type='text'
                                placeholder='Minimum distance'
                                {...register("minDistance")}
                                className='border px-2 py-[6px] w-full rounded-lg'
                            />
                            {errors.minDistance && (
                                <p className='text-red-500 text-xs pt-1'>
                                    {errors.minDistance.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='flex gap-3 p-5 border-t'>
                        <button
                            type='submit'
                            className='bg-primaryText text-white px-6 py-2 rounded-lg font-semibold text-sm tablet:text-base'>
                            Search
                        </button>
                        <button
                            type='button'
                            className='bg-gray-100 shadow-md text-gray-600 px-6 py-2 rounded-lg font-semibold text-sm tablet:text-base'>
                            Clear
                        </button>
                    </div>
                </form>
            </div>
            <div className='w-8/12 bg-white rounded-2xl shadow-lg h-fit'>
                <h1 className='text-2xl font-bold p-4 border-b'>Find a ride</h1>
                <div>
                    {ride.length > 0 ? (
                        <div className=''>
                            <div className='p-4 m-4 border border-[#79d59d] bg-[#e6faf3] rounded-lg '>
                                <p className='text-[#79d59d] font-semibold '>
                                    We found {ride.length} rides! Join one and
                                    get out there!
                                </p>
                            </div>
                            <div className='slider-container '>
                                {isArray(ride) &&
                                    ride.map((data, index) => (
                                        <div key={index} className='w-full'>
                                            <MapCard data={data} />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div className='text-center flex flex-col items-center m-8 '>
                            <div className='rounded-full shadow-xl '>
                                <ImSearch className='text-4xl text-darkred  m-5' />
                            </div>
                            <h1 className='text-xl font-bold mt-4 text-darkred'>
                                Please select ride criteria and find yourself
                                some great rides!
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
