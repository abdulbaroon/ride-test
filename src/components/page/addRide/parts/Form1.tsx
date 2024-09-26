"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoAlert } from "react-icons/io5";



/**
 * Props for the Form1 component.
 * @typedef {Object} Form1Props
 * @property {(data: FormData) => void} nextForm - Function to handle moving to the next form step.
 * @property {FormData} [formData] - Optional data passed from the previous form step.
 * @property {() => void} startOver - Function to reset the form and start over.
 * @property {() => void} [prevForm] - Optional function to navigate to the previous form step.
 */
interface Form1Props {
    nextForm: (data: FormData) => void;
    formData?: FormData;
    startOver: () => void;
    prevForm?: () => void;
}

/**
 * Interface for the form data object.
 * @typedef {Object} FormData
 * @property {string} [routeType] - The selected route type (gps, gpx, or noroute).
 */
interface FormData {
    routeType?: string;
}

/**
 * First form component for selecting a route type. 
 * Users can choose between linking a route, uploading a GPX file, or proceeding without a route.
 * 
 * @param {Form1Props} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
const Form1: React.FC<Form1Props> = ({ nextForm, formData, startOver }) => {
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    /**
     * Pre-fills the form fields with the provided data when the component mounts.
     */
    useEffect(() => {
        setValue("routeType", formData?.routeType || "");
    }, [formData, setValue]);

    /**
     * Handles the form submission and triggers the next form step with the form data.
     * 
     * @param {FormData} data - The form data after submission.
     */
    const handleSubmits: SubmitHandler<FormData> = (data) => {
        nextForm(data);
    };

    return (
        <div className='mt-2 mb-5'>
            <form onSubmit={handleSubmit(handleSubmits)} className=''>
                <div className='space-y-2 mt-4'>
                    <h1 className=' text-base tablet:text-xl desktop:text-2xl font-bold'>
                        Have a route mapped out? Ride with GPS, Strava or Garmin?
                    </h1>
                    <p className='font-bold text-xs tablet:text-sm'>
                        Quickly create a ride from any public route! Just paste the URL or upload a GPX file.
                    </p>
                    <p className='font-bold text-xs tablet:text-sm pb-2'>
                        If not, no worries! Just select &quot;No Route&quot; and create a ride with just a start location.
                    </p>
                </div>
                <div className='space-y-3 m-5 pt-4'>
                    <div className='flex items-center me-4'>
                        <input
                            id='gps-radio'
                            type='radio'
                            value='gps'
                            {...register("routeType", { required: true })}
                            className='w-4 h-4 bg-white border-gray-300'
                        />
                        <label
                            htmlFor='gps-radio'
                            className='ms-2 text-xl font-medium text-gray-900'>
                            Link a Route
                        </label>
                    </div>
                    <div className='flex items-center me-4'>
                        <input
                            id='gpx-radio'
                            type='radio'
                            value='gpx'
                            {...register("routeType", { required: true })}
                            className='w-4 h-4 bg-white border-gray-300 '
                        />
                        <label
                            htmlFor='gpx-radio'
                            className='ms-2 text-xl font-medium text-gray-900'>
                            GPX file
                        </label>
                    </div>
                    <div className='flex items-center me-4'>
                        <input
                            id='noroute-radio'
                            type='radio'
                            value='noroute'
                            {...register("routeType", { required: true })}
                            className='w-4 h-4 bg-white border-gray-300'
                        />
                        <label
                            htmlFor='noroute-radio'
                            className='ms-2 text-xl font-medium text-gray-900'>
                            No Route
                        </label>
                    </div>
                </div>
                {errors.routeType && (
                    <p className='text-red-500 text-sm mt-1'>
                        Please select a route type.
                    </p>
                )}
                <div className='flex items-center text-gray-600 gap-2 border-b py-5 mt-9 text-sm tablet:text-base'>
                    <IoAlert className='bg-gray-300 text-sm p-[1px] rounded-sm' />
                    <p>
                        Want to create some great routes? Check out 
                        <Link href={"https://ridewithgps.com"} className='text-primaryText'> Ride with GPS </Link>
                        or 
                        <Link href={"https://strava.com"} className='text-primaryText'> Strava </Link>!
                    </p>
                </div>
                <div className='flex justify-between mt-5'>
                    <button
                        type='button'
                        onClick={startOver}
                        className='bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold text-sm tablet:text-base'>
                        START OVER
                    </button>
                    <div className='flex gap-3'>
                        <button
                            type='submit'
                            className='bg-primaryText text-white px-9 py-2 rounded-md font-semibold text-sm tablet:text-base'>
                            NEXT
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form1;
