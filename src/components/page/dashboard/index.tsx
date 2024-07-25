import { burder, coffee, beerMug, snooze } from '@/assets';
import React from 'react';
import { BsLightningCharge, BsLightningChargeFill } from 'react-icons/bs';
import { FaRegMap } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { HiOutlineHome } from 'react-icons/hi';
import { IoMdCalendar } from 'react-icons/io';
import { LiaFilterSolid, LiaStreetViewSolid } from 'react-icons/lia';
import { MdOutlineDirectionsBike, MdOutlineShareLocation } from 'react-icons/md';
import { PiPersonSimpleBike } from 'react-icons/pi';
import { TbFilter, TbFilterX } from 'react-icons/tb';

const getTimeOfDayIconAndGreeting = () => {
  const now = new Date();
  const hours = now.getHours();

  let icon;
  let greeting;

  if (hours >= 6 && hours < 12) {
    icon = coffee;
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 18) {
    icon = burder;
    greeting = "Good Afternoon";
  } else if ((hours >= 18 && hours < 24) || (hours >= 0 && hours < 6)) {
    if ((hours >= 18 && hours < 24) || (hours >= 0 && hours < 6)) {
      icon = beerMug;
      greeting = "Good Evening";
    } else {
      icon = snooze;
      greeting = "Good Night";
    }
  }

  return { icon, greeting };
};

export const DashboardPage = () => {
  const { icon, greeting } = getTimeOfDayIconAndGreeting();

  return (
    <div className='min-h-screen mt-28'>
      <div className='w-11/12 mx-auto flex gap-5 '>
        <div className="w-[25%] shadow-lg rounded-lg bg-white  gap-3 overflow-hidden border">
          <div className='border-b px-4 py-3 flex items-center gap-2 bg-gray-200'>
            <div className='relative w-12 h-12 border overflow-hidden bg-gray-100 rounded-full  '>
              <svg
                className='absolute w-14 h-14 text-gray-400 -left-1'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'></path>
              </svg>
            </div>
            <div >
              <p className='text-primaryButton font-semibold'>Dev Ashish</p>
              <p className='text-sm font-semibold leading-3'>Ashish</p>
            </div>
          </div>
          
          <div className='border-b px-4 py-3 flex justify-between'>
            <div className='flex items-center gap-5'>
              <BsLightningChargeFill className='text-darkred text-xl' />
              <p> Level</p>
            </div>
            <p className='font-bold text-primaryButton'>microwatt</p>
          </div>
          <div className='border-b px-4 py-3 flex justify-between'>
            <div className='flex items-center gap-4'>
              <HiOutlineHome className='text-xl' />
              <p> Home</p>
            </div>
            <p className='font-medium text-primaryText'>Noida,UP</p>
          </div>
          <div className='border-b px-4 py-3 flex justify-between'>
            <div className='flex items-center gap-5'>
              <LiaStreetViewSolid className='text-xl' />
              <p>  Radius</p>
            </div>
            <p className='font-medium text-primaryButton'>50 mi</p>
          </div>
          <div className='border-b px-4 py-3 flex justify-between'>
            <div className='flex items-center gap-5'>
              <PiPersonSimpleBike className='text-xl' />
              <p>  Rides Joined</p>
            </div>
            <p className='font-medium'>0</p>
          </div>
          <div className='border-b px-4 py-3 flex justify-between'>
            <div className='flex items-center gap-5'>
              <GiPathDistance className='text-xl' />
              <p> Distance</p>
            </div>
            <p className='font-medium'>0</p>
          </div>
          <div className='border-b px-4 py-3 flex justify-between'>
            <div className='flex items-center gap-5'>
              <BsLightningCharge className='text-xl' />
              <p className=' text-primaryButton'>Joules</p>
            </div>
            <p className='font-medium text-primaryButton'>10 pts</p>
          </div>
          <div className=' px-4 py-3 flex justify-between'>
            <div className='flex items-center gap-5'>
              <IoMdCalendar className='text-xl' />
              <p>  Joined</p>
            </div>
            <p className='font-medium'>Jun 2024</p>
          </div>
          
        </div>
        <div className='w-[75%] min-h-10 h-fit border rounded-lg shadow-lg bg-white p-5 flex justify-between items-start'>
          <div>
            <div className='flex items-center gap-3'>
              <img src={icon.src} alt={`${greeting}`} className='w-20' />
              <div>
                <p className='text-3xl font-bold'>{greeting}{" "}<span className='text-primaryButton '>John D</span></p>
                <p>There are no upcoming rides in your area!</p>
              </div>
            </div>
            <button
              className='mt-5 ms-2 rounded-md flex justify-center items-center bg-primaryButton text-white gap-1 text-sm py-2 px-4'>
              <MdOutlineDirectionsBike />
              My Rides
              <span className='bg-primaryText px-2 rounded-md'>1</span>
            </button>
          </div>
          <div className='flex gap-2 '>
            <button className='text-2xl'><TbFilter /></button>
            <button className='text-2xl'><TbFilterX /></button>
            <button className='flex justify-center items-center px-3 py-2 bg-primaryDarkblue rounded-lg text-white gap-1'><FaRegMap /> map</button>
          </div>
        </div>
      </div>
    </div>
  );
};