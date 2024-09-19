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
    authGarminUser,
    authStravaUser,
    checkGarminUser,
    checkRWGPSUser,
    deleteGarminUser,
    deleteRWGPSUser,
    getGarminCallbackUrl,
} from "@/redux/slices/externalServicesSlice";
import { toast } from "react-toastify";
import { ReusableAlertDialog } from "@/components/basic/ReusableAlertDialog";
import { CLIENT_ID, STRAVA_REDIRECT_URI } from "@/constant/appConfig";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

export const Garmin = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
    const oauthToken = searchParams.get("oauth_token");
    const oauthVerifier = searchParams.get("oauth_verifier");
    const fetch = async () => {
        const response = await dispatch(checkGarminUser(user.id));
        if (checkRWGPSUser.fulfilled.match(response)) {
            setAuth(!!response.payload?.requestToken);
        } else if (checkRWGPSUser.rejected.match(response)) {
            toast.error("There was an error authenticating with Garmin.");
        }
    };

    useEffect(() => {
        fetch();
        if (oauthToken && oauthVerifier) {
            fetchToken(oauthToken, oauthVerifier);
        }
    }, [oauthToken, oauthVerifier]);

    const fetchToken = async (oauthToken: string, oauthVerifier: string) => {
        const payload = {
            userID: user?.id,
            requestToken: oauthToken,
            verifier: oauthVerifier,
            accessToken: null,
            tokenSecret: null,
            expiresAt: null,
            createdBy: user?.id,
            createdDate: dayjs().format(),
            modifiedBy: user?.id,
            modifiedDate: dayjs().format(),
        };
        const response = await dispatch(authGarminUser(payload));
        if (authGarminUser.fulfilled.match(response)) {
            setAuth(!!response.payload?.requestToken);
        } else if (authGarminUser.rejected.match(response)) {
            toast.error("There was an error authenticating with Garmin.");
        }
    };

    const handleRevoke = async () => {
        const response = await dispatch(deleteGarminUser(user.id));
        onAlertClose();
        setAuth(false);
    };

    const handleCallbackUrl = async () => {
        if (user.id) {
            const response = await dispatch(getGarminCallbackUrl(user.id));
            if (getGarminCallbackUrl.fulfilled.match(response)) {
                if (response.payload) {
                    push(response.payload);
                }
            }
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
                        <p className='text-primaryText'>Garmin Connect</p>
                    </h1>
                </div>
                <div className='bg-white rounded-md border border-neutral-300'>
                    <p className='text-2xl font-bold p-4 border-b text-gray-600'>
                        Garmin Connect
                    </p>
                    <div className='p-4 border-b '>
                        <p className='text-xl font-bold text-gray-800 flex flex-col'>
                            <span>
                                Connect to your Garmin account and create your
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
                    </div>
                    <div className='p-4'>
                        {auth ? (
                            <button
                                onClick={onAlertOpen}
                                className='text-white text-lg font-bold py-2 px-4 bg-orange rounded-md uppercase'>
                                REVOKE Garmin{" "}
                            </button>
                        ) : (
                            <button
                                onClick={handleCallbackUrl}
                                className='text-white text-lg font-bold py-2 px-4 bg-orange rounded-md uppercase'>
                                AUTHORIZE Garmin{" "}
                            </button>
                        )}
                    </div>
                </div>
                <div className='mt-5 ms-1 text-gray-500 text-lg'>
                    <p>
                        Not using Garmin?{" "}
                        <Link
                            className='text-primaryText'
                            href={"https://www.garmin.com/register/"}
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
