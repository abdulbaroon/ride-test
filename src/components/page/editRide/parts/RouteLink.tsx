import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";

interface RouteLinkProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
    loading: boolean;
    handleClick: () => void;
}

const RouteLink: React.FC<RouteLinkProps> = ({
    register,
    errors,
    loading,
    handleClick,
}) => (
    <div className='min-h-40 p-10 flex items-center gap-4'>
        <div className='flex flex-col relative w-1/2'>
            <label className='text-gray-600 font-bold'>Paste route link:</label>
            <input
                type='input'
                placeholder='https://www.strava.com/routes/your-route-id'
                {...register("url", { required: "Please enter a valid URL." })}
                className={`border px-2 py-2 ${
                    errors.url ? "input-error" : ""
                }`}
            />
            {errors.url && (
                <p className='text-xs mt-1 text-red-600'>
                    {"Please enter a valid URL."}
                </p>
            )}
        </div>
        <div>
            <button
                onClick={handleClick}
                type='button'
                className='text-sm tablet:text-base bg-secondaryButton text-white h-fit px-9 py-2 mt-[22px] rounded-md font-semibold w-fit'>
                {loading ? (
                    <CgSpinner className='mx-auto animate-spin w-6 h-6' />
                ) : (
                    "Process Route"
                )}
            </button>
        </div>
    </div>
);

export default RouteLink;
