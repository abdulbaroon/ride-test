import Link from 'next/link'
import React from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { FiShare2 } from 'react-icons/fi'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'
interface SuccessProps {
    id: number;
  }
const Success = ({id}:SuccessProps) => {
    return (
        <div className='flex flex-col justify-center items-center  w-full tablet:w-7/12 desktop:w-5/12 mx-auto mt-28 gap-7'>
            <div>
                <BsFillCheckCircleFill className='text-9xl text-green-500' />
            </div>
            <div> 
                <h1 className='text-3xl tablet:text-4xl  text-secondaryButton'>Ride Created.</h1>
                <p className='text-center text-secondaryButton'>Share and tell your friends!</p>
            </div>
            <Link href={`/ride/${id}`} className='bg-secondaryButton text-center py-[9px] w-9/12 tablet:w-8/12 px-6 font-bold text-white rounded-md flex justify-center items-center gap-3'>
               <MdOutlineRemoveRedEye className='text-xl'/> View Ride
            </Link>
            <Link href={`#`} className='bg-darkred text-center py-[9px] w-9/12 tablet:w-8/12 px-6 font-bold text-white rounded-md flex justify-center items-center gap-3'>
               <FiShare2 className='text-xl'/> Share Ride
            </Link>
            <Link href={"/dashboard"} className='bg-primaryButton text-center py-[9px] w-9/12 tablet:w-8/12 px-6 font-bold text-white rounded-md flex justify-center items-center gap-3'>
              <RxDashboard className='text-xl'/>  Dashboard
            </Link>
            <Link href={`/ride/edit/${id}`} className='bg-transparent border border-secondaryButton text-secondaryButton text-center py-[9px] w-9/12 tablet:w-8/12 px-6 font-bold rounded-md flex justify-center items-center gap-3'>
            <FaRegEdit className='text-xl' /> Edit Ride
            </Link>
        </div>
    )
}

export default Success