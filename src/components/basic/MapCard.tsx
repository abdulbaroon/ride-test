import { formatDates, formatTime } from "@/shared/util/dateFormat.util";
import { format, parse, parseISO } from "date-fns";
import Link from "next/link";
import React from "react";
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { LiaRoadSolid } from "react-icons/lia";
import { RiUserSettingsLine } from "react-icons/ri";

interface ActivityData {
    activityName: string;
    startAddress: string;
    activityPictures: Array<{ picturePath: string }>;
}

const MapCard = ({ data }: { data: ActivityData | any }) => {
    return (
        <div className=' bg-white border rounded-md mx-4 my-10  flex  justify-between'>
            <div className='p-5 w-1/2'>
                <Link
                    href={`/ride/${data.activityID}`}
                    target='_blank'
                    className='mb-2 text-2xl font-bold tracking-tight text-primaryText'>
                    {data.activityName}
                </Link>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <IoLocationOutline className='text-lg' />
                    <p>{data.startAddress}</p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <FaRegCalendarDays className='text-lg' />
                    <p>
                        {data.activityDate &&
                            formatDates(
                                data.activityDate,
                                "EEE, MMM dd, yyyy"
                            )}{" "}
                        @{" "}
                        {data.activityStartTime &&
                            formatTime(data.activityStartTime)}
                    </p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <LiaRoadSolid className='text-lg' />
                    <p>Road for {data.activityRoutes[0].distance} miles</p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <IoIosCheckmarkCircleOutline className='text-lg' />
                    <p>Roster Count: {data.rosterCount}</p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <RiUserSettingsLine className='text-lg' />
                    <p>{data.isprivate ? "Private ride" : "Community ride"}</p>
                </div>
                <Link
                    href={`/ride/${data.activityID}`}
                    target='_blank'
                    className='inline-flex mt-3 items-center px-3 py-2 text-sm font-medium text-center text-white bg-secondaryButton rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300'>
                    View Ride
                    <svg
                        className='rtl:rotate-180 w-3.5 h-3.5 ms-2'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 14 10'>
                        <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M1 5h12m0 0L9 1m4 4L9 9'
                        />
                    </svg>
                </Link>
            </div>
            <div className='p-4 h-64 w-[350px]'>
                <img
                    className='rounded-lg h-full w-full object-fill'
                    src={`https://dev.chasingwatts.com${data.activityPictures[0].picturePath}`}
                    alt='map'
                />
            </div>
        </div>
    );
};

export default MapCard;
