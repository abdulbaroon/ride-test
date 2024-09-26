import { RootState } from '@/redux/store/store';
import { ActivityType } from '@/shared/types/addRide.types';
import { Tooltip } from '@chakra-ui/react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoMdArrowDropdown, IoMdClose } from 'react-icons/io';
import { TbFilter } from 'react-icons/tb';
import { useSelector } from 'react-redux';

interface FormData {
    radius?: number;
    rideType?: number;
    rideName?: string;
}

interface QuickFilterProps {
    closeFilter: () => void;
    handelFilterData: (data: FormData) => void;
}

/**
 * QuickFilter component that provides a form for filtering rides based on radius, ride type, and ride name.
 *
 * @component
 * @param {QuickFilterProps} props - The properties for the QuickFilter component.
 * @param {Function} props.closeFilter - A function to close the filter.
 * @param {Function} props.handelFilterData - A function to handle the filtered data submission.
 * @returns {JSX.Element} The rendered QuickFilter component.
 */
const QuickFilter: React.FC<QuickFilterProps> = ({ closeFilter, handelFilterData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const activityType = useSelector<RootState, ActivityType[]>(
        (state) => state.addRide.activityTypes
    );

    /**
     * Handles the submission of the form data.
     *
     * @param {FormData} data - The submitted form data containing radius, rideType, and rideName.
     */
    const handleSubmits: SubmitHandler<FormData> = (data) => {
        handelFilterData(data);
    };

    return (
        <div className='mt-6 border rounded-lg shadow-lg bg-white px-4 py-7 items-center relative'>
            <h1 className='text-xl font-bold pb-2'>Quick Filter</h1>
            <form onSubmit={handleSubmit(handleSubmits)}>
                <div className='flex gap-x-6'>
                    <div className='w-1/4'>
                        <input
                            {...register("radius")}
                            className='bg-white border px-2 py-[6px] w-full'
                            type="number"
                            placeholder='Radius'
                        />
                    </div>
                    <div className="w-1/4 relative">
                        <select
                            {...register("rideType")}
                            className={`bg-white border px-2 py-[6px] w-full`}
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
                    </div>
                    <div className="w-1/4">
                        <input
                            className='bg-white border px-2 py-[6px] w-full'
                            {...register("rideName")}
                            type="text"
                            placeholder='Ride Name'
                        />
                    </div>
                    <Tooltip hasArrow label='Add Filter' placement='top' bg='black'>
                        <button type='submit' className="text-2xl text-white bg-primaryText p-[7px] rounded-md h-fit">
                            <TbFilter />
                        </button>
                    </Tooltip>
                </div>
            </form>
            <div className='absolute top-3 right-3 text-xl cursor-pointer'>
                <Tooltip hasArrow label='close' placement='top' bg='black'>
                    <button onClick={closeFilter}>
                        <IoMdClose />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default QuickFilter;
