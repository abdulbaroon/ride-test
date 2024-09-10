"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import {
    Avatar,
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import {
    getHubDetails,
    getHubRideList,
    getMemberList,
    joinHub,
    leaveHub,
} from "@/redux/slices/hubsSlice";
import { Hub, HubActivity, HubMember } from "@/shared/types/hubs.types";
import { isArray } from "lodash";
import { IMAGE_URl } from "@/constant/appConfig";
import Link from "next/link";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { ReusableAlertDialog } from "@/components/basic/ReusableAlertDialog";
import { User } from "@/shared/types/account.types";
import { HiOutlineHome } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { GoLink } from "react-icons/go";
import { FiPhone } from "react-icons/fi";
import { formatRideList } from "@/shared/util/format.util";
import RideCard from "../dashboard/parts/RideCard";

interface HubDetailsProps {
    hubId: number | null;
}

export const HubDetails: React.FC<HubDetailsProps> = ({ hubId }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"rides" | "members">("rides");
    const hub = useSelector((state: RootState) => state.hubs.hubs) as Hub;
    const member = useSelector(
        (state: RootState) => state.hubs.members
    ) as HubMember[];
    const hubRides = useSelector(
        (state: RootState) => state.hubs.hubRides
    ) as HubActivity[];
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
    } = useDisclosure();
    const formattedRide = hubRides?.map((data) => formatRideList(data));
    const fetchAPi = async (id: any, hubId: number | null) => {
        if (id && hubId) {
            dispatch(
                getHubDetails({
                    hubID: hubId,
                    userID: id,
                })
            );
            dispatch(getMemberList(hubId));
            dispatch(
                getHubRideList({
                    hubID: hubId,
                    userID: id,
                })
            );
        }
    };

    useEffect(() => {
        if (user.id && hubId) {
            fetchAPi(user.id, hubId);
        }
    }, [user.id, hubId]);

    const handleJoin = async () => {
        const payload = {
            hubID: hubId,
            userID: user.id,
            hubMemberRoleID: 2,
        };
        setLoading(true);
        const response = await dispatch(joinHub(payload));
        setLoading(false);
        if (joinHub.fulfilled.match(response)) {
            toast.success("You have successfully joined this hub.");
            fetchAPi(user.id, hubId);
        } else {
            toast.error("We could not join you to this hub.");
        }
    };
    const handleLeave = async () => {
        onAlertClose();
        setLoading(true);
        const response = await dispatch(
            leaveHub({
                hubID: hubId,
                userID: user.id,
            })
        );
        setLoading(false);
        if (leaveHub.fulfilled.match(response)) {
            fetchAPi(user.id, hubId);
            toast.success("You have successfully left the hub.");
        } else {
            toast.error("We could not remove you from the hub.");
        }
    };

    return (
        <div className='  w-11/12  mx-auto !max-w-[1320px] gap-5 mt-[90px] '>
            <div className='mt-4-1 py-5'>
                <h1 className=' text-gray-500 flex gap-1 items-center'>
                    <Link href={"/dashboard"}>
                        <HiOutlineHome />
                    </Link>
                    <IoIosArrowForward />
                    <Link href={"/hubs"}>Hubs</Link>
                    <IoIosArrowForward />
                    <p className='text-primaryText'>{hub.hubName}</p>
                </h1>
            </div>
            <Box
                bg='darkBlack'
                h='full'
                w='full'
                overflowY='auto'
                position='relative'>
                <div className='flex border rounded-lg overflow-hidden bg-white'>
                    <div className='h-[180px] w-[20%]'>
                        <img className='w-full ' src={hub.hubLogoUrl} alt='' />
                    </div>
                    <div className='p-6 w-[30%] border-e'>
                        <p className='text-2xl font-bold text-gray-600'>
                            {hub.hubName}
                        </p>
                        <p className='font-semibold text-lg text-gray-600'>
                            {hub.hubTypeModel && hub.hubTypeModel.hubTypeName}
                        </p>
                        <p className='text-gray-500'>
                            {hub.hubAddress}, {hub.hubCity}, {hub.hubCountry}
                        </p>
                        {hub?.userInHub ? (
                            <button
                                onClick={onAlertOpen}
                                className='mt-3 text-white bg-red-500 font-semibold py-[6px] px-4 rounded-md'>
                                {loading ? (
                                    <CgSpinner className='animate-spin w-6 h-6' />
                                ) : (
                                    "Leave Hub"
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleJoin}
                                className='mt-3 text-white bg-primaryDarkblue font-semibold py-[6px] px-4 rounded-md'>
                                {loading ? (
                                    <CgSpinner className='animate-spin w-6 h-6' />
                                ) : (
                                    "Join Hub"
                                )}
                            </button>
                        )}
                    </div>
                    <div className='p-6 w-[30%]'>
                        <p className='font-semibold  text-gray-600 flex gap-1 items-center'>
                            <GoLink />
                            <Link
                                className='text-primaryText'
                                href={`${hub.hubUrl}`}>
                                {hub.hubUrl}
                            </Link>
                        </p>
                        {hub.hubPhone && (
                            <p className='font-semibold items-center text-gray-600 flex gap-1'>
                                <FiPhone />
                                <Link
                                    className='text-primaryText'
                                    href={`tel:${hub.hubPhone}`}>
                                    {hub.hubPhone}
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
                <div className='flex justify-start gap-3 mt-3'>
                    <button
                        className={`py-2 px-4 border-2 rounded-lg ${
                            activeTab === "rides"
                                ? "bg-primaryButton text-white"
                                : "bg-lightwhite border-primaryButton text-primaryButton"
                        }`}
                        onClick={() => setActiveTab("rides")}>
                        Upcoming Rides
                    </button>
                    <button
                        className={`py-2 px-4 border-2 rounded-lg ${
                            activeTab === "members"
                                ? "bg-primaryButton text-white"
                                : "bg-lightwhite border-gray-500 text-gray-500"
                        }`}
                        onClick={() => setActiveTab("members")}>
                        Members
                    </button>
                </div>
                <div className=' mt-3 rounded-lg grid grid-cols-4 gap-3 '>
                    {activeTab === "members" &&
                        isArray(member) &&
                        member.map((data) => (
                            <div className='flex gap-4 p-3 ' key={data.userID}>
                                <div className='min-h-28 w-full border relative mt-1 shadow-sm rounded-xl bg-white'>
                                    <div className='p-6 flex flex-col items-center justify-center gap-1 '>
                                        <Avatar
                                            borderWidth='1px'
                                            borderColor='gray.600'
                                            name={`${data?.userProfileModel.firstName} ${data.userProfileModel.lastName}`}
                                            size='xl'
                                            src={`${IMAGE_URl}/useravatar/pfimg_${data.userID}.png?lastmod=${data.userProfileModel.createdBy}`}
                                        />
                                        <div className='mt-1'>
                                            <h1 className='text-xl font-bold text-center '>
                                                {
                                                    data.userProfileModel
                                                        .firstName
                                                }{" "}
                                                {data.userProfileModel.lastName}
                                            </h1>
                                            <p className='text-gray-600 text-center '>
                                                {
                                                    data.userProfileModel
                                                        .homeBaseCity
                                                }
                                                ,{" "}
                                                {
                                                    data.userProfileModel
                                                        .homeBaseCountry
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className='grid grid-cols-2 gap-6'>
                    {activeTab === "rides" &&
                        isArray(formattedRide) &&
                        formattedRide?.map((data) => (
                            <RideCard
                                data={data}
                                key={data.activityID}
                                isLike={false}
                            />
                        ))}
                </div>
                <ReusableAlertDialog
                    isOpen={isAlertOpen}
                    onClose={onAlertClose}
                    title='Leave Hub?'
                    message='Are you sure you want to leave this hub?'
                    onConfirm={handleLeave}
                />
            </Box>
        </div>
    );
};
