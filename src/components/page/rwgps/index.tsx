"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import RWGPSModal from "./parts/RWGPSModal";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import {
    checkRWGPSUser,
    deleteRWGPSUser,
} from "@/redux/slices/externalServicesSlice";
import { toast } from "react-toastify";
import { ReusableAlertDialog } from "@/components/basic/ReusableAlertDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons/faCheckCircle";

export const RWGPS = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
    } = useDisclosure();
    const [auth, setAuth] = useState(false);
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();
    const fetch = async () => {
        const response = await dispatch(checkRWGPSUser(user.id));
        if (checkRWGPSUser.fulfilled.match(response)) {
            setAuth(!!response.payload?.authToken);
        } else if (checkRWGPSUser.rejected.match(response)) {
            toast.error(
                "There was an error authenticating with Ride with GPS."
            );
        }
    };
    useEffect(() => {
        fetch();
    }, []);

    const handleRevoke = async () => {
        const response = await dispatch(deleteRWGPSUser(user.id));
        onAlertClose();
        setAuth(false);
    };
    return (
        <>
            <div className='mt-28 !max-w-[1400px] w-11/12 mx-auto'>
                <div className='  py-6  '>
                    <h1 className=' text-gray-500 flex gap-1 items-center'>
                        <Link href={"/dashboard"}>
                            <HiOutlineHome />
                        </Link>
                        <IoIosArrowForward />
                        <Link
                            href={"/account/profile"}
                            className='hover:text-black'>
                            Profile
                        </Link>
                        <IoIosArrowForward />
                        <p className='text-primaryText'>
                            Ride with GPS Connect
                        </p>
                    </h1>
                </div>
                <div className='bg-white rounded-md border border-neutral-300'>
                    <p className='text-2xl font-bold p-4 border-b text-gray-600'>
                        Ride with GPS Connect
                    </p>
                    <div className='p-4 border-b '>
                        <p className='text-xl font-bold text-gray-800 flex flex-col'>
                            <span>
                                Connect to your Ride with GPS account and create
                                your group rides even easier!
                            </span>
                            <span>
                                When using RWGPS, Chasing Watts will auto load
                                most of the ride details including the route!
                            </span>
                        </p>
                        <p className='text-xl mt-5 text-gray-500'>
                            Click below to manage your authentication.
                        </p>
                        {auth && (
                            <p className='text-lg font-bold mt-5 text-neutral-700'>
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    size='xl'
                                    className='fa-fw text-green-500 mr-2'
                                />
                                You are currently authenticated with Ride with
                                GPS.
                            </p>
                        )}
                    </div>
                    <div className='p-4'>
                        {auth ? (
                            <button
                                onClick={onAlertOpen}
                                className='text-white text-lg font-bold py-2 px-4 bg-orange rounded-md'>
                                REVOKE RIDE WITH GPS{" "}
                            </button>
                        ) : (
                            <button
                                onClick={onOpen}
                                className='text-white text-lg font-bold py-2 px-4 bg-orange rounded-md'>
                                AUTHORIZE RIDE WITH GPS{" "}
                            </button>
                        )}
                    </div>
                </div>
                <div className='mt-5 ms-1 text-gray-500 text-lg'>
                    <p>
                        Not using Ride with GPS?{" "}
                        <Link
                            className='text-primaryText'
                            href={"https://ridewithgps.com/signup"}
                            target='_blank'>
                            {" "}
                            Register for a free account{" "}
                        </Link>{" "}
                        and start creating some great routes!
                    </p>
                </div>
                <RWGPSModal
                    onClose={onClose}
                    isOpen={isOpen}
                    id={user.id}
                    setAuth={setAuth}
                />
                <ReusableAlertDialog
                    isOpen={isAlertOpen}
                    onClose={onAlertClose}
                    title='Revoke?'
                    message='Are you sure you want to revoke authentication?'
                    onConfirm={handleRevoke}
                />
            </div>
        </>
    );
};
