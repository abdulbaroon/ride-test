"use client";
import { getHubList } from "@/redux/slices/addRideSlice";
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
import { useDisclosure } from "@chakra-ui/react";
import { getHubsList } from "@/redux/slices/hubsSlice";
import { useRouter } from "next/navigation";

export const Hubs = () => {
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const hubs = useSelector<RootState, Hub[]>((state) => state.hubs.hubList);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (user.id) {
            dispatch(
                getHubsList({
                    id: user.id,
                    radius: user.userProfile?.defaultRadius,
                })
            );
        }
    }, [user]);

    return (
        <div className='w-11/12 mx-auto !max-w-[1320px] mt-28'>
            <div className='pt-1'>
                <h1 className=' text-gray-500 flex gap-1 items-center'>
                    <Link href={"/dashboard"}>
                        <HiOutlineHome />
                    </Link>
                    <IoIosArrowForward />
                    <p className='text-primaryText'>Hubs</p>
                </h1>
            </div>
            <div className='grid grid-cols-4 mt-5 gap-x-5 gap-y-5    '>
                {isArray(hubs) &&
                    hubs?.map((data) => (
                        <div
                            className='bg-white h-fit rounded-lg overflow-hidden shadow-md'
                            key={data.hubID}>
                            <div className='w-full h-[200px] mx-auto border  overflow-hidden'>
                                <img
                                    className='w-full h-[250px] object-contain'
                                    src={data.hubLogoUrl}
                                    alt='HubLogo'
                                />
                            </div>
                            <div className='px-5 pt-3 text-gray-600'>
                                <p className='text-xl font-bold text-gray-700 '>
                                    {data.hubName}
                                </p>
                                <p className='text-gray-700'>
                                    {data?.hubTypeModel?.hubTypeName &&
                                        data?.hubTypeModel?.hubTypeName}
                                </p>
                                <p>
                                    {data.hubCity}, {data.hubCountry}
                                </p>
                                <div className='flex gap-2 items-center text-gray-800 mt-1'>
                                    <p className='flex gap-1 items-center'>
                                        <LuBike /> Rides: {data.activityCount}{" "}
                                    </p>
                                    <div className='h-5 w-[1px] bg-black'></div>
                                    <p className='flex gap-1 items-center'>
                                        <MdGroups /> Members:{" "}
                                        {data.activeMembers}
                                    </p>
                                </div>
                            </div>
                            <div className='flex px-5 my-4'>
                                <Link
                                    href={`/hubs/${data.hubID}`}
                                    className='bg-primaryDarkblue py-[6px] px-4 text-white rounded-md'>
                                    View Hub
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
