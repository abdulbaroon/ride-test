"use client";

import {
    appleStore,
    arrowRight,
    googleStore,
    rideDetail,
    rideList,
    rideMap,
} from "@/assets";
import { homeRideDataLeft, homeRideDataRight, steps } from "@/constant";
import Link from "next/link";
import { createElement } from "react";

export const HomePage = () => {
    return (
        <div className=' mt-[90px] '>
            <div className='bg-white'>
                <div className='w-11/12 !max-w-[1320px] mx-auto  flex flex-col-reverse tablet:flex-row gap-3 justify-center items-center'>
                    <div className='w-full tablet:w-3/5 flex flex-col justify-center items-start tablet:items-end  h-full gap-7'>
                        <div className='desktop:w-9/12 tablet:w-11/12 w-full'>
                            <div className='text-gray-500 text-xl font-normal flex flex-col gap-6 '>
                                <h1 className='text-5xl mobile:text-6xl tablet:text-7xl font-bold text-black flex flex-col gap-2 tablet:gap-4 '>
                                    <span className='text-primaryText'>
                                        Find your
                                    </span>
                                    <span className='text-secondaryButton'>
                                        Perfect ride.
                                    </span>
                                </h1>
                                <div className='text-start text-base space-y-1'>
                                    <p className='text-lg tablet:text-xl font-medium text-gray-700 '>
                                        Want to start or find a fun and safe
                                        group ride?
                                    </p>
                                    <p className='desktop:w-8/12 w-11/12'>
                                        Chasing Watts makes it easy to
                                        coordinate or find a group ride in your
                                        area. See all the rides and the details
                                        that matter at a glance!
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-5 mt-8 flex-col-reverse tablet:flex-row  my-8 text-sm'>
                                <Link
                                    href={"/account/register"}
                                    className='bg-primaryText rounded-lg w-fit py-[14px] px-7 h-fit text-white font-bold'>
                                    Join the Community
                                </Link>
                                <Link
                                    href={"#app"}
                                    className='bg-secondaryButton rounded-lg w-fit py-[14px] h-fit px-7 text-white font-bold'>
                                    Get the App
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='w-full tablet:w-2/5 flex justify-center desktop:justify-start '>
                        <div className='w-[350px]'>
                            <img
                                src={rideList.src}
                                className='w-full h-full'
                                alt='ridelist'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className='w-11/12 mx-auto !max-w-[1320px] py-10'>
                    <h1 className='font-bold text-3xl'>How it works</h1>
                    <div className='grid sm:grid-cols-2 desktop:grid-cols-4  gap-6  '>
                        {steps?.map((step, i) => (
                            <div
                                key={i}
                                className='bg-white rounded-md border border-neutral-300 p-5 relative mt-4 tablet:mt-10'>
                                <p className='text-3xl font-bold text-primaryText'>
                                    {step.number}
                                </p>
                                <p className='text-xl font-bold mt-2'>
                                    {step.title}
                                </p>
                                <p className='text-gray-500 font-normal text-sm'>
                                    {step.description}
                                </p>
                                <div
                                    className={`absolute -top-9 -right-12 ${
                                        i === 0 || i === 2
                                            ? "sm:block hidden"
                                            : i === 1
                                            ? "desktop:block hidden"
                                            : i === 3
                                            ? "hidden"
                                            : "block"
                                    } `}>
                                    <img
                                        src={arrowRight.src}
                                        className=''
                                        alt='Arrow'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className='bg-violet  '>
                    <div className='w-11/12 mx-auto !max-w-[1320px] py-20 text-wrap'>
                        <h1 className='text-5xl text-white font-bold text-center'>
                            Welcome to Chasing Watts.
                        </h1>
                        <div className='flex flex-col tablet:flex-row justify-center mt-14 gap-5 w-full'>
                            <div className=' mt-5 w-full tablet:w-1/2 desktop:w-5/12 flex  tablet:items-end flex-col '>
                                <div className='w-full tablet:w-11/12 desktop:w-9/12 space-y-16'>
                                    {homeRideDataLeft?.map((data, i) => (
                                        <div
                                            className='flex justify-end gap-4'
                                            key={i}>
                                            <div className='text-primaryText text-2xl mt-1'>
                                                {createElement(data.icons)}
                                            </div>
                                            <div className='flex flex-col items-start flex-wrap  gap-1'>
                                                <h1 className='text-white text-lg font-semibold '>
                                                    {data.title}
                                                </h1>
                                                <p className='text-gray-400 text-sm  '>
                                                    {data.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='w-2/12 hidden desktop:block '>
                                <div className=' '>
                                    <img
                                        src={rideDetail.src}
                                        className='w-full '
                                        alt=''
                                    />
                                </div>
                            </div>
                            <div className='space-y-16 mt-5 w-full tablet:w-1/2 desktop:w-5/12'>
                                {homeRideDataRight?.map((data, i) => (
                                    <div
                                        className='flex justify-start gap-4'
                                        key={i}>
                                        <div className='text-primaryText text-2xl mt-1'>
                                            {createElement(data.icons)}
                                        </div>
                                        <div className='flex flex-col items-start text-start gap-1'>
                                            <h1 className='text-white text-lg font-semibold'>
                                                {data.title}
                                            </h1>
                                            <p className='text-gray-400 text-sm w-full tablet:w-11/12 desktop:w-9/12'>
                                                {data.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-center items-center flex-col tablet:flex-row gap-6 mt-10 text-sm tablet:text-base'>
                            <Link
                                href={"/features"}
                                className='bg-transparent rounded-lg py-[14px] px-7 w-fit text-primaryText border border-primaryText font-bold'>
                                See all the Features
                            </Link>
                            <Link
                                href={"#"}
                                className='bg-transparent rounded-lg py-[14px] px-7 w-fit text-white border border-white font-bold'>
                                How to Find a Ride
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div id='app'>
                <div className='w-11/12 mx-auto !max-w-[1320px] bg-lightGray rounded-xl my-10 py-10 min-h-[40vh] flex flex-col tablet:flex-row px-2 tablet:px-10 desktop:px-32'>
                    <div className='w-full tablet:w-1/2'>
                        <div className='flex flex-col justify-center text-center tablet:text-start h-full gap-7'>
                            <h1 className='text-3xl font-bold text-gray-800'>
                                GET THE APP!
                            </h1>
                            <p className='text-gray-500 text-lg'>
                                Download Chasing Watts and join the community of
                                cycling enthusiasts. Don&apos;t stop your search
                                for great group rides when you leave your
                                computer with our iOS and Android app!
                            </p>
                            <div className='flex gap-2 flex-col tablet:flex-row items-center tablet:items-start'>
                                <Link
                                    href={
                                        "https://apps.apple.com/us/app/chasing-watts/id1436437976"
                                    }
                                    className='w-48 sm:w-44 desktop:w-48'>
                                    <img src={appleStore.src} alt='' />
                                </Link>
                                <Link
                                    href={
                                        "https://play.google.com/store/apps/details?id=com.ChasingWatts"
                                    }
                                    className='w-48 sm:w-44 desktop:w-48'>
                                    <img src={googleStore.src} alt='' />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='w-full mt-10 tablet:mt-0 tablet:w-1/2 flex justify-center tablet:justify-end'>
                        <div className='w-96'>
                            <img src={rideMap.src} className='w-full' />
                        </div>
                    </div>
                </div>
                <div className='my-12'>
                    <h1 className='text-center text-2xl tablet:text-4xl font-bold'>
                        Ready to ride? Let&apos;s go!
                    </h1>
                    <div className='flex justify-center flex-col items-center tablet:items-center tablet:flex-row gap-2 mt-3'>
                        <Link
                            href={"/account/register"}
                            target='_blank'
                            className='bg-primaryText rounded-lg py-2 px-7 w-fit text-white border  font-bold'>
                            Join In! It&apos;s FREE.
                        </Link>
                        <Link
                            href={"/account/login"}
                            className='bg-secondaryButton rounded-lg py-2 w-fit px-7 text-white border border-white font-bold'>
                            Already Member? Login.
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
