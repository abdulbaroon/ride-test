"use client";
import MapBoxModal from "@/components/module/MapBoxModal";
import { getActivityExplore } from "@/redux/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import Link from "next/link";
import React, { useEffect } from "react";
import { IoMdHome } from "react-icons/io";
import { MdOutlineMyLocation } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const ExploreMap = () => {
    const userData = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (userData?.id && userData?.userProfile?.defaultRadius) {
            dispatch(
                getActivityExplore({
                    id: userData?.id,
                    radius: userData?.userProfile?.defaultRadius,
                })
            );
        }
    }, [userData]);
    return (
        <section className='flex items-center h-full w-11/12 mx-auto !max-w-[1320px] mt-[67px] py-6 text-gray-800 relative'>
            <div className='w-full bg-white border border-neutral-300 rounded-md p-2'>
                <MapBoxModal profile={userData.userProfile} />
            </div>
        </section>
    );
};

export default ExploreMap;
