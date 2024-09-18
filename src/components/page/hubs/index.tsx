"use client";
import { getHubsList } from "@/redux/slices/hubsSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { Hub } from "@/shared/types/hubs.types";
import { isArray } from "lodash";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { LuBike } from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { hubEmpty, hubImage } from "@/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-solid-svg-icons/faStar";
import { faCircleCheck } from "@fortawesome/pro-light-svg-icons/faCircleCheck";
import { Tooltip } from "@chakra-ui/react";

export const Hubs: React.FC = () => {
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const hubs = useSelector<RootState, Hub[]>((state) => state.hubs.hubList);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (user?.id) {
            dispatch(
                getHubsList({
                    id: user.id,
                    radius: user.userProfile?.defaultRadius,
                })
            );
        }
    }, [user, dispatch]);

    return (
        <div className='w-11/12 mx-auto !max-w-[1320px] mt-28'>
            <div className='pt-1'>
                <h1 className='text-gray-500 flex gap-1 items-center'>
                    <Link href='/dashboard'>
                        <HiOutlineHome />
                    </Link>
                    <IoIosArrowForward />
                    <p className='text-primaryText'>Hubs</p>
                </h1>
            </div>
            {hubs?.length > 0 ? (
                <div>
                    <div className='bg-white border border-neutral-300 p-3 rounded-md mt-3'>
                        <div>
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                size='lg'
                                className='text-green-500'
                            />
                            <span className='ml-2'>
                                Fantastic! There are <b>{hubs?.length}</b> Hubs
                                in your area! Take a look around and join a
                                ride!
                            </span>
                        </div>
                    </div>
                    <div className='grid grid-cols-4 my-5 gap-x-5 gap-y-5'>
                        {hubs?.map((data) => (
                            <HubCard key={data.hubID} data={data} />
                        ))}
                    </div>
                    <div className='my-6 bg-yellow-50 border border-yellow-300 rounded-md p-3'>
                        <div className='text-neutral-700 font-semibold mb-2'>
                            Interested in setting up a hub for your shop, team,
                            or club? Please reach out - it&apos;s free and easy!
                        </div>
                        <Link rel='noopener noreferrer' href='/contactus'>
                            <button className='px-8 py-2 font-semibold rounded bg-secondaryButton text-gray-50'>
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className='bg-white my-5 h-full rounded-lg overflow-hidden shadow-md w-full flex justify-center items-center'>
                    <div className='w-2/5 p-10'>
                        <div className='w-96'>
                            <img src={hubEmpty.src} alt='empty Image' />
                        </div>
                    </div>
                    <div className='w-3/5 '>
                        <div className=' space-y-2'>
                            <p className='text-3xl font-semibold'>
                                There are no hubs setup{"\n"}in your area!
                            </p>
                            <p className='w-8/12 text-gray-500 text-lg'>
                                Talk your local bike shops, coffee shops, teams
                                or club about Chasing Watts. We make it easy to
                                coordinate, manage & analyze group rides.
                            </p>
                        </div>
                        <div className='mt-7  '>
                            <Link rel='noopener noreferrer' href='/contactus'>
                                <button className='px-8 py-2 font-semibold rounded bg-secondaryButton text-gray-50'>
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface HubCardProps {
    data: Hub;
}

const HubCard: React.FC<HubCardProps> = ({ data }) => {
    const [hover, setHover] = useState(false);

    const variants = {
        initial: { scale: 1, opacity: 1 },
        hover: { scale: 1.1, opacity: 0.9 },
    };

    return (
        <div
            className='bg-white h-full rounded-md overflow-hidden border border-neutral-300'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <div className='w-full h-24 mx-auto rounded-md overflow-hidden flex items-center justify-center'>
                <motion.div
                    variants={variants}
                    initial='initial'
                    animate={hover ? "hover" : "initial"}
                    transition={{ duration: 0.3 }}>
                    <img
                        className='w-full object-contain aspect-video'
                        //src={hubImage.src}
                        src={data.hubLogoUrl || hubImage.src}
                        alt='Hub Logo'
                    />
                </motion.div>
            </div>
            <hr className='border-t border-neutral-200 my-2' />
            <div className='px-5 text-gray-600'>
                <p className='text-xl font-bold text-gray-700 truncate '>
                    {data.hubName}
                </p>
                <p className='text-gray-700'>
                    {data?.hubTypeModel?.hubTypeName}
                </p>
                <p>
                    {data.hubCity}, {data.hubCountry}
                </p>
                <div className='flex gap-2 items-center text-gray-800 mt-1'>
                    <p className='flex gap-1 items-center'>
                        <LuBike /> Rides: {data.activityCount}
                    </p>
                    <div className='h-5 w-[1px] bg-black'></div>
                    <p className='flex gap-1 items-center'>
                        <MdGroups /> Members: {data.activeMembers}
                    </p>
                </div>
            </div>
            <hr className='border-t border-neutral-200 my-2' />
            <div className='flex flex-row px-5 my-4 justify-between items-center'>
                <Link href={`/hubs/${data.hubID}`} className=''>
                    <button className='bg-primaryDarkblue py-[6px] px-4 text-white rounded-md text-sm'>
                        View Hub
                    </button>
                </Link>

                {data.userInHub && (
                    <div className='items-center justify-center flex flex-col'>
                        <Tooltip
                            hasArrow
                            label='Your Hub'
                            placement='top'
                            bg='gray'>
                            <FontAwesomeIcon
                                icon={faStar}
                                size='lg'
                                className='text-red-500'
                            />
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
};
