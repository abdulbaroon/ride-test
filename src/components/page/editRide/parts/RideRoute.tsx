import MapComponent from "@/components/module/MapComponent";
import { DifficultyLevel } from "@/shared/types/addRide.types";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
interface RideRouteProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
    loading?: boolean;
    difficultyLevel?: DifficultyLevel[];
    centerLatitude: number;
    centerLongitude: number;
    type: string;
    geoJSON: {
        features?: any[];
    };
}
const RideRoute: React.FC<RideRouteProps> = ({
    register,
    errors,
    loading,
    difficultyLevel,
    centerLatitude,
    centerLongitude,
    geoJSON,
    type,
}) => {
    return (
        <div>
            {geoJSON?.features && (
                <div className='border rounded-xl p-6 flex items-center gap-5  '>
                    <div className='w-1/2 '>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-600 text-sm'>
                                Route Name
                            </label>
                            <input
                                type='text'
                                placeholder={""}
                                disabled
                                {...register(`routeName${type}`)}
                                className='border px-2 py-[6px] mt-1 remove-arrow'
                            />
                        </div>
                        <div className='flex gap-2 tablet:gap-4 flex-col tablet:flex-col mt-3'>
                            <div className='flex flex-col w-full'>
                                <label className='font-medium text-gray-600 text-sm'>
                                    Distance (miles)
                                </label>
                                <input
                                    type='number'
                                    placeholder={"Distance"}
                                    {...register(`distance${type}`, {
                                        required: "Please enter the distance.",
                                    })}
                                    className={`border px-2 py-[6px] mt-1 remove-arrow ${
                                        errors.distance ? "input-error" : ""
                                    }`}
                                />
                                {errors.distance && (
                                    <p className='text-xs mt-1 text-red-600'>
                                        {"Please enter the distance."}
                                    </p>
                                )}
                            </div>
                            <div className='flex flex-col  w-full'>
                                <label className='font-medium text-gray-600 text-sm'>
                                    Avg speed (mph)
                                </label>
                                <input
                                    type='number'
                                    placeholder={"Avg speed"}
                                    {...register(`avgSpeed${type}`, {
                                        required:
                                            "Please enter the average speed.",
                                    })}
                                    className={`border px-2 py-[6px] mt-1 remove-arrow ${
                                        errors.avgSpeed ? "input-error" : ""
                                    }`}
                                />
                                {errors.avgSpeed && (
                                    <p className='text-xs mt-1 text-red-600'>
                                        {"Please enter the average speed."}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='flex gap-0 tablet:gap-4 mt-3'>
                            <div className='flex flex-col w-full relative'>
                                <select
                                    {...register(`difficulty${type}`, {
                                        required:
                                            "Please select a difficulty level.",
                                    })}
                                    className={`bg-white border px-2 py-[6px]  ${
                                        errors.difficulty ? "input-error" : ""
                                    }`}
                                    defaultValue={""}>
                                    <option value='' disabled>
                                        Select difficulty level
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
                                {errors.difficulty && (
                                    <p className='text-xs mt-1 text-red-600'>
                                        {"Please select a difficulty level."}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='mt-4'>
                            <label className='inline-flex items-center cursor-pointer'>
                                <input
                                    {...register(`isGroup${type}`)}
                                    type='checkbox'
                                    className='sr-only peer'
                                />
                                <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                                <span className='font-medium'>
                                    ABC Groups
                                    <span className='text-sm text-gray-500'>
                                        {"  "}add roster groups option
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className='w-1/2 mt-16 '>
                        {geoJSON?.features && (
                            <MapComponent
                                centerLatitude={centerLatitude}
                                centerLongitude={centerLongitude}
                                geoJSON={geoJSON}
                                className='h-[50vh]'
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RideRoute;
