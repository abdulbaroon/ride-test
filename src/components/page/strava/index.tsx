"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import {
    authStravaUser,
    checkRWGPSUser,
    checkStravaUser,
    deleteRWGPSUser,
    deleteStravaUser,
} from "@/redux/slices/externalServicesSlice";
import { toast } from "react-toastify";
import { ReusableAlertDialog } from "@/components/basic/ReusableAlertDialog";
import { CLIENT_ID, STRAVA_REDIRECT_URI } from "@/constant/appConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons/faCheckCircle";

export const Strava = () => {
    const searchParams = useSearchParams();
    const { push } = useRouter();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
    } = useDisclosure();
    const [auth, setAuth] = useState(false);
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();
    const AUTH_URL = `https://www.strava.com/oauth/mobile/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${STRAVA_REDIRECT_URI}&scope=read,activity:read`;
    const code = searchParams.get("code");
    const fetch = async () => {
        const response = await dispatch(checkStravaUser(user.id));
        if (checkStravaUser.fulfilled.match(response)) {
            setAuth(!!response.payload?.authToken);
        } else if (checkStravaUser.rejected.match(response)) {
            toast.error("There was an error authenticating with Strava.");
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        if (code) {
            fetchToken(code);
        }
    }, [code]);

    const fetchToken = async (code: string) => {
        const response = await dispatch(
            authStravaUser({
                id: user.id,
                code: code,
            })
        );
        fetch();
        if (authStravaUser.fulfilled.match(response)) {
            setAuth(!!response.payload?.authToken);
        } else if (authStravaUser.rejected.match(response)) {
            toast.error("There was an error authenticating with Strava.");
        }
    };
    const handleRevoke = async () => {
        const response = await dispatch(deleteStravaUser(user.id));
        if (deleteStravaUser.fulfilled.match(response)) {
            onAlertClose();
            setAuth(false);
        } else if (deleteStravaUser.rejected.match(response)) {
            toast.error("There was an error Revoke with Strava.");
        }
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
                        <p className='text-primaryText'>Strava Connect</p>
                    </h1>
                </div>
                <div className='bg-white rounded-lg border '>
                    <p className='text-2xl font-bold p-4 border-b text-gray-600'>
                        Strava Connect
                    </p>
                    <div className='p-4 border-b '>
                        <p className='text-xl font-bold text-gray-800 flex flex-col'>
                            <span>
                                Connect to your Strava account and create your
                                group rides even easier!
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
                                You are currently authenticated with Strava.
                            </p>
                        )}
                    </div>
                    <div className='p-4'>
                        {auth ? (
                            <button
                                onClick={onAlertOpen}
                                className='text-white text-lg font-bold py-2 px-4 bg-orange rounded-md uppercase'>
                                REVOKE Strava{" "}
                            </button>
                        ) : (
                            <button
                                onClick={() => push(AUTH_URL)}
                                className='text-white text-lg font-bold py-2 px-4 bg-orange rounded-md uppercase'>
                                AUTHORIZE Strava{" "}
                            </button>
                        )}
                    </div>
                </div>
                <div className='mt-5 ms-1 text-gray-500 text-lg'>
                    <p>
                        Not using Strava?{" "}
                        <Link
                            className='text-primaryText'
                            href={"https://www.strava.com/register/"}
                            target='_blank'>
                            {" "}
                            Register for a free account{" "}
                        </Link>{" "}
                        and start creating some great routes!
                    </p>
                </div>
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
