import { featbg, logo, navLogo } from "@/assets";
import FeatureCard from "@/components/basic/FeatureCard";
import { featureCard } from "@/constant";
import { url } from "inspector";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";
import { MdCheck } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

const tableArray = [
    "Date/Time based events",
    "Cycling specific details - speed, distance, roads and weather",
    "Direct Route integration - RWGPS, Strava, GPX",
    "Route sync to cycling computer",
    "Instant notification from ride, roster, and chat",
    "Locally based rides making it easy to find the rides that matter",
    "Club/Team Rides",
    "Cycling specific - no distractions",
];
export const FeaturesPage = () => {
    return (
        <div
            className='mt-[90px]  !max-w-[1400px] mx-auto'
            style={{
                backgroundImage: `url(${featbg.src})`,
                //backgroundPosition: "0% 40%",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
            }}>
            <div className=' border bg-white py-6  '>
                <h1 className='w-11/12 mx-auto text-gray-500 flex gap-2 items-center'>
                    <HiOutlineHome />
                    {">"}
                    <span className='text-primaryText'>The Features</span>
                </h1>
            </div>
            <div className='bg-transparent py-16'>
                <div className='w-11/12 mx-auto space-y-10 pb-16'>
                    <h1 className='text-6xl font-bold text-white'>
                        The Features
                    </h1>
                    <div className='text-xl text-white'>
                        <p>
                            Whether in front of a PC/Tablet or on the go with
                            your phone,
                        </p>
                        <p>Chasing Watts offers you the details that matter.</p>
                    </div>
                </div>
            </div>
            <div className='bg-white  mt-48'>
                <div className=''>
                    <div className='grid grid-cols-3 gap-5 pb-10 mt-10 px-5'>
                        {featureCard.map((data, i) => (
                            <FeatureCard
                                color={data.color}
                                icon={data.icon}
                                key={i}
                                desc={data.desc}
                                tittle={data.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='bg-white'>
                <div className='relative overflow-x-auto  w-10/12 mx-auto pt-14 '>
                    <h1 className='text-4xl font-bold text-center mb-10'>
                        The Chasing Watts Advantage
                    </h1>
                    <table className='w-full text-sm text-left rtl:text-right text-gray-500 shadow-md sm:rounded-lg mt-3'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50  '>
                            <tr>
                                <th
                                    scope='col'
                                    className='px-6 py-3 w-1/2'></th>
                                <th scope='col' className='px-6 py-3 w-1/4'>
                                    Chasing Watts
                                </th>
                                <th scope='col' className='px-6 py-3 w-1/4'>
                                    Competition
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableArray.map((d, i) => (
                                <tr className='bg-white border-b ' key={i}>
                                    <th
                                        scope='row'
                                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap '>
                                        {d}
                                    </th>
                                    <td className='px-6 py-4 text-center ps-16'>
                                        <MdCheck className='text-2xl font-bold' />
                                    </td>
                                    <td className='px-6 py-4 ps-16 '>
                                        {i === 0 || i === 3 ? (
                                            <MdCheck className='text-2xl font-bold' />
                                        ) : (
                                            <RxCross1 className='text-xl font-bold' />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='bg-white'>
                <div className='w-11/12 mx-auto pt-20 pb-36'>
                    <div className='bg-secondaryButton rounded-md flex  mx-auto px-[8%] '>
                        <div className='w-1/2 py-10'>
                            <h1 className='text-3xl mt-1 font-semibold text-white'>
                                Join Chasing Watts today.
                            </h1>
                            <p className='text-2xl text-white mt-7 font-bold w-11/12'>
                                Be a part of the cycling community and
                                let&apos;s ride!
                            </p>
                            <div className='flex  gap-2 mt-5'>
                                <button className='bg-darkred rounded-lg py-3 px-5 w-fit text-white  font-bold'>
                                    Sign up - it&apos;s free
                                </button>
                                <button className='bg-primaryButton rounded-lg py-3 w-fit px-5 text-white font-bold'>
                                    Already Member? Login.
                                </button>
                            </div>
                        </div>
                        <div className='w-1/2 flex items-center'>
                            <div className='w-[450px]'>
                                <img
                                    src={logo.src}
                                    alt='logo'
                                    className='w-full'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
