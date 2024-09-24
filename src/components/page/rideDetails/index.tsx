"use client";

import {
    activityView,
    getActivityRoster,
    getActivityroute,
    getChatActivity,
    getFriendsList,
    getresponsetype,
    getRideDetails,
    getWeather,
} from "@/redux/slices/rideDetailsSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RideDetail from "./parts/RideDetail";
import { formatRideData, hasDatePassed } from "@/shared/util/format.util";
import SideBar from "./parts/SideBar";
import ChatBox from "./parts/ChatBox";
import RoasterDetail from "./parts/RoasterDetail";
import { User } from "@/shared/types/account.types";
import MapRoute from "./parts/MapRoute";
import { FaFlagCheckered } from "react-icons/fa";
import { FormattedRideData } from "@/shared/types/dashboard.types";
import { MdOutlineCancelPresentation } from "react-icons/md";
import Link from "next/link";
import { checkUserInRide } from "@/redux/slices/ratingSlice";
import { toast } from "react-toastify";
import {  notFound, usePathname, useRouter, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import * as animationData from "../../../assets/lottieAssets/loader.json";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { getCookie } from "cookies-next";

export const RideDetails = ({ id }: { id: number }) => {
    const [rideDetails, setRideDetails] = useState<FormattedRideData>();
    const [userInRide, setUserInRide] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Fetching Ride...");
    const [cookieLoading, setCookieLoading] = useState(false);
    const [userLogin, setUserLogin] = useState<string>("");
    const searchParams = useSearchParams();
    const shareCode = searchParams.get("share");
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const router = useRouter();
    const pathname=usePathname()
    console.log(pathname,"path")

    const dispatch = useDispatch<AppDispatch>();

    const fetchApis = async (id: number) => {
        try {
            const response = await dispatch(getRideDetails(id));
            if (getRideDetails.fulfilled.match(response)) {
                const formatedRide = formatRideData(response.payload);
                console.log("ride fetching")
                setRideDetails(formatedRide);

                const params = {
                    date: formatedRide?.startDate,
                    lat: formatedRide?.startLat,
                    lng: formatedRide?.startLng,
                    uom: formatedRide?.rideCreateUoM ?? 1,
                };

                const viewpayload = {
                    activityID: id,
                    createdBy: user?.id,
                    createdDate: new Date().toISOString(),
                };

                const chatparams = {
                    activityID: id,
                    userID: user?.id || 0,
                };

                await Promise.all([
                    dispatch(getActivityroute(id)),
                    dispatch(getActivityRoster(id)),
                    dispatch(activityView(viewpayload)),
                    dispatch(getChatActivity(chatparams)),
                    dispatch(getWeather(params)),
                    dispatch(
                        getFriendsList({ id: user.id || 0, activityID: id })
                    ),
                    dispatch(getresponsetype()),
                ]);
                return response.payload;
            }else if(getRideDetails.rejected.match(response)){
                console.log("sadfasdfasdf=======>retun")
               return notFound()
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const checkUser = async () => {
        if (id && user.id) {
            const response = await dispatch(
                checkUserInRide({ activityID: id, userID: user.id })
            );
            if (checkUserInRide.fulfilled.match(response)) {
                setUserInRide(response.payload);
                return response.payload;
            }
        }
    };

    // useEffect(() => {
    //     const checkCookie = () => {
    //         const userCookie = getCookie("user");
    //         setCookieLoading(true);
    //         if (userCookie) {
    //             setUserLogin(userCookie);
    //         } else {
    //             setUserLogin("");
    //             localStorage.removeItem("persist:root");
    //         }

    //         setCookieLoading(false);
    //     };

    //     checkCookie();
    // }, []);

    useEffect(() => {
        const init = async () => {
            //if (cookieLoading) return;

            try {
                const userCookie = getCookie("user");
                if (userCookie) {
                    setUserLogin(userCookie);
                } else {
                    setUserLogin("");
                    localStorage.removeItem("persist:root");
                }

                console.log("***** User Cookie Direct", userCookie);

                const [res1, res2] = await Promise.all([
                    checkUser(),
                    fetchApis(id),
                ]);

                console.log("***** Ride index userLogin:", userLogin);

                if (!userCookie && res2?.isPrivate) {
                    setLoadingMessage(
                        "Hey, looks like you don't have access to this ride!"
                    );
                    //router.push("/account/login");
                    setTimeout(() => {
                        setLoadingMessage("Redirecting to login...");
                        router.push(`/account/login?returnurl=${pathname}`);
                    }, 2000);

                } else if (!res1 && res2?.isPrivate) {
                    if (res2.shareCode === shareCode) {
                        return true;
                    } else {
                        setLoadingMessage(
                            "Hey, looks like you don't have access to this ride!"
                        );
                        setTimeout(() => {
                            setLoadingMessage("Redirecting to dashboard...");
                            router.push("/dashboard");
                        }, 2000);
                    }
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error during init", error);
            }
        };

        if (userLogin !== undefined) {
            init();
        }
    }, [id]);

    if (loading) {
        return (
            <div className='z-50 absolute top-0'>
                <div className='w-[100vw] bg-white  border mx-auto min-h-screen flex flex-col justify-center items-center'>
                    <div>
                        <Lottie
                            className='w-full mx-auto'
                            aria-activedescendant=''
                            animationData={animationData}
                            loop={true}></Lottie>
                        <div className='text-center text-gray-500 text-xl'>
                            {loadingMessage}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=' mt-28 mb-6 '>
            <div className='w-11/12 mx-auto !max-w-[1320px]'>
                {!userLogin && (
                    <Alert
                        status='info'
                        variant='left-accent'
                        borderRadius={6}
                        marginBottom={5}>
                        <AlertIcon />
                        <div>
                            Hello! You are viewing this ride as a guest. Please{" "}
                            <Link href={`/account/login?returnurl=${pathname}`} className='font-bold'>
                                login
                            </Link>{" "}
                            or{" "}
                            <Link
                                href='/account/register'
                                className='font-bold'>
                                sign up
                            </Link>{" "}
                            to join the roster or chat!
                        </div>
                    </Alert>
                )}
                {hasDatePassed(rideDetails?.activityDateTime) &&
                    !rideDetails?.isCancelled && (
                        <Alert
                            status='error'
                            variant='left-accent'
                            borderRadius={6}
                            marginBottom={5}>
                            <AlertIcon />
                            <p className='font-base'>
                                This ride has passed! We hope you made it out
                                and had a great ride!{" "}
                                {userInRide && userLogin && (
                                    <>
                                        {" "}
                                        <Link
                                            href={`/rate/${id}`}
                                            className='font-bold'>
                                            {" "}
                                            PLEASE RATE THE RIDE!
                                        </Link>{" "}
                                        <span>
                                            Your feedback helps ride leaders
                                            create better rides!
                                        </span>
                                    </>
                                )}
                            </p>
                        </Alert>
                    )}
                {rideDetails?.isCancelled && (
                    <Alert
                        status='error'
                        variant='left-accent'
                        borderRadius={6}
                        marginBottom={5}>
                        <AlertIcon />
                        THIS RIDE HAS BEEN CANCELLED!
                    </Alert>
                )}
                {rideDetails?.isPrivate &&
                    userInRide &&
                    userLogin &&
                    !rideDetails.isCancelled && (
                        <Alert
                            status='warning'
                            variant='left-accent'
                            borderRadius={6}
                            marginBottom={5}>
                            <AlertIcon />
                            This is a private ride. Invite your friends or share
                            a share code to join.
                        </Alert>
                    )}
                <div className='flex gap-5 '>
                    <div className='w-1/4'>
                        <SideBar id={id} userLogin={userLogin} />
                    </div>
                    <div className='w-3/4 space-y-5 '>
                        <RideDetail userLogin={userLogin} />
                        <MapRoute />
                        <div className='w-full flex gap-5'>
                            <div className='w-1/2 '>
                                <RoasterDetail />
                            </div>
                            <div className='w-1/2'>
                                <ChatBox userLogin={userLogin} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
