"use client";
import { appleStore, featbg, googleStore } from "@/assets";
import React from "react";
import { FaRegEye, FaRoute } from "react-icons/fa";
import { MdDirectionsBike, MdPeopleAlt } from "react-icons/md";

import AnimatedNumbers from "react-animated-numbers";
import { RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";
import { BiLayerPlus } from "react-icons/bi";
import { FaRegSquareCheck } from "react-icons/fa6";

const rideFeatures = [
    {
        title: "Create",
        description:
            "Create your ride. With our easy add-a-ride wizard, you can set up a ride in under a minute! Create and share.",
        icon: <BiLayerPlus className='text-4xl text-primaryText ' />,
    },
    {
        title: "Join",
        description:
            "Easily find the rides in your area. Check out the details and join the roster. Stay up-to-date with any changes or the roster.",
        icon: <FaRegSquareCheck className='text-3xl text-primaryText ' />,
    },
    {
        title: "Ride",
        description:
            "Spend less time trying to find the right ride. See the details - the route, speed, roster - and get in on a safe and fun ride. Fast.",
        icon: <MdDirectionsBike className='text-4xl text-primaryText ' />,
    },
];

export const AboutUs = () => {
    return (
        <div
            className='min-h-screen '
            style={{
                backgroundImage: `url(${featbg.src})`,
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
            }}>
            <div className='bg-violet h-96 mt-20 flex justify-center items-center flex-col'>
                <p className=' text-white text-5xl font-bold'>
                    We help cyclists find{" "}
                    <span className='text-primaryText'>dream rides</span>
                </p>
                <p className='text-gray-400 text-xl mt-8 font-medium w-[55%] text-center'>
                    Our mission is to provide the very best ride search service
                    and help cyclists of all fitness levels find each other as
                    easily as possible.
                </p>
            </div>
            <div className='bg-transparent py-16 h-[330px] justify-center items-center '>
                <div className='flex !max-w-[1320px] mx-auto'>
                    <div className='w-4/12 flex flex-col items-center justify-center '>
                        <FaRoute className='text-5xl text-white  me-3' />
                        <p className='text-5xl text-white font-bold mt-2  flex flex-row'>
                            <AnimatedNumbers
                                includeComma
                                animateToNumber={15}
                                locale='en-US'
                                transitions={(index) => ({
                                    duration: index + 0.5,
                                })}
                            />
                            K+
                        </p>
                        <p className='text-white text-lg '>Rides created</p>
                    </div>
                    <div className='w-4/12 flex flex-col items-center justify-center '>
                        <FaRegEye className='text-5xl text-white  me-3 ' />
                        <p className='text-5xl text-white font-bold mt-2  flex flex-row'>
                            <AnimatedNumbers
                                includeComma
                                animateToNumber={2.6}
                                locale='en-US'
                                transitions={(index) => ({
                                    duration: index + 0.5,
                                })}
                            />
                            M+
                        </p>
                        <p className='text-white text-lg '>Rides viewed</p>
                    </div>
                    <div className='w-4/12 flex flex-col items-center justify-center   '>
                        <MdPeopleAlt className='text-5xl text-white  ' />
                        <p className='text-5xl text-white font-bold mt-2 flex flex-row'>
                            <AnimatedNumbers
                                includeComma
                                animateToNumber={10}
                                locale='en-US'
                                transitions={(index) => ({
                                    duration: index + 0.5,
                                })}
                            />
                            K+
                        </p>
                        <p className='text-white text-lg '>Cyclists</p>
                    </div>
                </div>
            </div>
            <div className='bg-LinkColor w-full h-[700px]'>
                <div className=' !max-w-[1320px] mx-auto'>
                    <div className='flex  gap-28 '>
                        <div className='w-1/2'>
                            <div className='w-11/12 bg-[#f6e4e2] p-12 my-16 space-y-6 rounded-lg '>
                                <p className='text-2xl font-bold'>
                                    Download Our App
                                </p>
                                <p className='font-light w-10/12'>
                                    Now finding a great ride just got even
                                    easier with our new app
                                </p>
                                <div className='flex gap-2 flex-col tablet:flex-row items-center tablet:items-start'>
                                    <Link
                                        href={
                                            "https://apps.apple.com/us/app/chasing-watts/id1436437976"
                                        }
                                        target='_blank'>
                                        <div className='w-48 sm:w-44 desktop:w-48'>
                                            <img src={appleStore.src} alt='' />
                                        </div>
                                    </Link>
                                    <Link
                                        href={
                                            "https://play.google.com/store/apps/details?id=com.ChasingWatts&pli=1"
                                        }
                                        target='_blank'>
                                        <div className='w-48 sm:w-44 desktop:w-48'>
                                            <img src={googleStore.src} alt='google' />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='w-1/2 py-12 text-gray-600 text-lg space-y-7'>
                            <p className='text-gray-700 font-bold text-4xl '>
                                For cyclists, by cyclists!
                            </p>
                            <div>
                                <p>
                                    Chasing Watts is not just about getting
                                    faster or racing.
                                </p>
                                <p>
                                    Chasing Watts is getting out there and doing
                                    what you love and what you&apos;re
                                    passionate about - riding a bike.
                                </p>
                            </div>
                            <div>
                                <p>
                                    We want Chasing Watts to serve as the go-to
                                    for cyclists to easily find, join and get
                                    together on a ride. Simple.
                                </p>
                            </div>
                            <div>
                                <Link
                                    href='/account/register'
                                    className='text-white w-fit bg-primaryText py-3 px-8 rounded-3xl font-bold flex justify-center items-center text-lg '>
                                    Get Started <RiArrowRightSLine />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-7 mt-6'>
                        {rideFeatures?.map((feature, index) => (
                            <div
                                className='w-4/12 bg-white rounded-lg p-6 space-y-1 shadow'
                                key={index}>
                                {feature.icon}
                                <p className='text-2xl text-gray-800 font-bold'>
                                    {feature.title}
                                </p>
                                <p className='text-[15px]'>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
