import React from 'react';
import { FaRegCalendarDays } from 'react-icons/fa6';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { IoLocationOutline } from 'react-icons/io5';
import { LiaRoadSolid } from 'react-icons/lia';
import { RiUserSettingsLine } from 'react-icons/ri';

interface ActivityData {
    activityName: string;
    startAddress: string;
    activityPictures: Array<{ picturePath: string }>;
}

const MapCard = ({data}: { data: ActivityData | any}) => {
    return (
        <div className="w-9/12 bg-white border border-gray-200 rounded-lg shadow-lg">
            <a href="#">
                <img className="rounded-t-lg h-72 w-full" src={`https://dev.chasingwatts.com${data[0].activityPictures[0].picturePath}`} alt="map" />
            </a>
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-primaryText">{data[0].activityName}</h5>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <IoLocationOutline className='text-lg' />
                    <p>{data[0].startAddress}</p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <FaRegCalendarDays className='text-lg' />
                    <p>6/12/2024 @ 06:00 AM</p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <LiaRoadSolid className='text-lg' />
                    <p>Road for {data[0].activityRoutes[0].distance} miles</p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <IoIosCheckmarkCircleOutline className='text-lg' />
                    <p>Roster Count: {data[0].rosterCount}</p>
                </div>
                <div className='flex items-center text-gray-500 gap-3 '>
                    <RiUserSettingsLine className='text-lg' />
                    <p>Community ride</p>
                </div>
                <a
                    href="#"
                    className="inline-flex mt-3 items-center px-3 py-2 text-sm font-medium text-center text-white bg-secondaryButton rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                    Read more
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default MapCard;
