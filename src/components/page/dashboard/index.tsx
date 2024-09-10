"use client";
import {
    burder,
    coffee,
    beerMug,
    snooze,
    rideDetail,
    rideList,
    letsRide,
} from "@/assets";
import React, { useEffect, useState } from "react";
import { MdOutlineDirectionsBike } from "react-icons/md";
import UserProfile from "./parts/UserProfile";
import Greeting from "./parts/Greeting";
import { TbFilter, TbFilterX } from "react-icons/tb";
import { FaRegMap } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import {
    getActivityExplore,
    getDashBoardWeather,
    getFriendCount,
    getHotRideList,
    getLeaderBoard,
    getMyRideList,
    getPointDetails,
    getPointLevels,
    getRideList,
    getUserStats,
} from "@/redux/slices/dashboardSlice";
import {
    FormattedRide,
    FormattedRideData,
    Item,
    RideItem,
} from "@/shared/types/dashboard.types";
import { formatRideList } from "@/shared/util/format.util";
import RideCard from "./parts/RideCard";
import { addDays, format } from "date-fns";
import DateFilterButton from "./parts/DateFilterButton";
import QuickFilter from "./parts/QuickFilter";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import NewsCard from "./parts/NewsCard";
import HotRideCard from "./parts/HotRideCard";
import MyRideModal from "./parts/MyRideModal";
import { getProfile } from "@/redux/slices/authSlice";
import LeaderBoardList from "./parts/LeaderBoardList";
import FriendCard from "./parts/FriendCard";
import MapModal from "./parts/MapModal";
import { profileData } from "@/constant";
import WeatherForecast from "./parts/WeatherForecast";
import { isArray } from "lodash";
import Link from "next/link";
import { faCoffee } from "@fortawesome/pro-light-svg-icons/faCoffee";
import { faHamburger } from "@fortawesome/pro-light-svg-icons/faHamburger";
import { faBeerMug } from "@fortawesome/pro-light-svg-icons/faBeerMug";
import { faZzz } from "@fortawesome/pro-light-svg-icons/faZzz";
import { faThumbsUp } from "@fortawesome/pro-light-svg-icons/faThumbsUp";

const getTimeOfDayIconAndGreeting = () => {
    const now = new Date();
    const hours = now.getHours();

    let icon;
    let greeting;

    if (hours >= 6 && hours < 12) {
        icon = faCoffee;
        greeting = "Good Morning";
    } else if (hours >= 12 && hours < 18) {
        icon = faHamburger;
        greeting = "Good Afternoon";
    } else if ((hours >= 18 && hours < 24) || (hours >= 0 && hours < 6)) {
        if ((hours >= 18 && hours < 24) || (hours >= 0 && hours < 6)) {
            icon = faBeerMug;
            greeting = "Good Evening";
        } else {
            icon = faZzz;
            greeting = "Good Night";
        }
    } else {
        icon = faThumbsUp;
        greeting = "Let's Ride";
    }

    return { icon, greeting };
};
interface FilterInputs {
    radius: number;
    rideType: number;
    rideName: string;
}
export const DashboardPage: React.FC = () => {
    const [rideListArray, setRideListArray] = useState<FormattedRide[] | []>(
        []
    );
    const [rideArray, setRideArray] = useState<RideItem[] | []>([]);
    const [hotRideArray, setHotRideArray] = useState<FormattedRide[] | []>([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setfilter] = useState<boolean>(false);
    const userData = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();
    const hotRidedata = useSelector<RootState, Item[]>(
        (state) => state.dashboard.hotRideList
    );
    const myRidedata = useSelector<RootState, Item[]>(
        (state) => state.dashboard.myRideList
    );
    const pointDetails = useSelector<RootState, any>(
        (state) => state.dashboard.pointDetails
    );
    const userStats = useSelector<RootState, any>(
        (state) => state.dashboard.userStats
    );
    const ridedata = useSelector<RootState, Item[]>(
        (state) => state.dashboard.rideList
    );
    const profile = useSelector<RootState, any>(
        (state) => state.auth.profileData
    );

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isMapModal,
        onOpen: onMapOpen,
        onClose: onMapClose,
    } = useDisclosure();

    const { icon, greeting } = getTimeOfDayIconAndGreeting();

    const user = {
        name: profile?.firstName + " " + profile?.lastName,
        username: profile?.firstName,
        level: pointDetails?.levelName ?? "decawatt",
        location: `${profile?.homeBaseCity},${profile?.homeBaseState}`,
        radius: `${profile?.defaultRadius} mi`,
        ridesJoined: userStats?.userRideCount || 0,
        distance: userStats?.userDistance || 0,
        joules: pointDetails?.joulePointTotal ?? 0 + " pts",
        joinedDate: format(
            userData.userProfile?.createdDate ?? new Date(),
            "MMM yyyy"
        ),
        modifiedDate: profile.modifiedDate,
        userID: profile.userID,
    };

    useEffect(() => {
        if (ridedata) {
            setRideArray(ridedata);
            const formattedRide = ridedata.map((data) => formatRideList(data));
            setRideListArray(formattedRide);
        }

        if (hotRidedata) {
            const formattedHotRide = hotRidedata.map((data) =>
                formatRideList(data)
            );
            setHotRideArray(formattedHotRide);
        }
    }, [ridedata, hotRidedata]);

    const handleApi = async () => {
        if (userData.userProfile?.defaultRadius && userData.id) {
            const params = {
                id: userData.id,
                feedType: "Feed",
                radius: userData.userProfile?.defaultRadius,
            };
            dispatch(getRideList(params));
            dispatch(getPointDetails(userData.id));
            dispatch(getUserStats(userData.id));
            dispatch(getPointLevels());
            dispatch(getProfile(userData.id));
            dispatch(getLeaderBoard(0));
        }
    };
    useEffect(() => {
        if (userData?.id && profile) {
            dispatch(
                getActivityExplore({
                    id: userData?.id,
                    radius: profile?.defaultRadius,
                })
            );
            dispatch(
                getFriendCount({
                    id: userData?.id,
                    radius: profile?.defaultRadius,
                })
            );
            dispatch(
                getDashBoardWeather({
                    lat: profile?.homeBaseLat,
                    lng: profile?.homeBaseLng,
                    uom: profile?.unitOfMeasureID || 1,
                })
            );
        }
    }, [userData, profile]);

    const handleHotRideApi = async () => {
        if (userData.userProfile?.defaultRadius && userData.id) {
            const params = {
                id: userData.id,
                feedType: "Hot",
                radius: userData.userProfile?.defaultRadius,
            };
            await dispatch(getHotRideList(params));
        }
    };

    const handleMyRideApi = async () => {
        if (userData.userProfile?.defaultRadius && userData.id) {
            const params = {
                id: userData.id,
                feedType: "me",
                radius: userData.userProfile?.defaultRadius,
            };
            await dispatch(getMyRideList(params));
        }
    };

    const handelFilterData = (data: RideItem[]) => {
        if (data) {
            const formatRide = data?.map((data) => formatRideList(data));
            setRideListArray(formatRide);
            setfilter(true);
        } else {
            setRideListArray([]);
        }
    };

    const handelFilterInput = (data: FilterInputs) => {
        const rdata: RideItem[] = ridedata.filter((item: RideItem) => {
            const matchesName = data.rideName
                ? item?.activityName
                      .toLowerCase()
                      .includes(data.rideName.toLowerCase())
                : true;
            const matchesRadius = data.radius
                ? data.radius >
                  (item?.activityRoutes?.[0]?.distance ?? Infinity)
                : true;
            const matchesType = data.rideType
                ? Number(data.rideType) === item?.activityTypeID
                : true;
            return matchesName && matchesRadius && matchesType;
        });
        setRideArray(rdata);
        const formatRide = rdata?.map((data) => formatRideList(data));
        setRideListArray(formatRide);
    };
    const handelClearFilter = () => {
        setRideArray(ridedata);
        const formattedRide = ridedata.map((data) => formatRideList(data));
        setRideListArray(formattedRide);
        setfilter(false);
    };

    useEffect(() => {
        handleApi();
        handleHotRideApi();
        handleMyRideApi();
    }, []);

    return (
        <div className=' mt-28 mb-6 '>
            <div className='w-11/12 mx-auto flex gap-5 !max-w-[1320px] '>
                <div className='w-1/4'>
                    <UserProfile {...user} />
                    <WeatherForecast />
                </div>
                <div className='w-[75%]'>
                    <div className='w-full min-h-10 h-fit border rounded-lg shadow-lg bg-white p-5 flex justify-between items-start'>
                        <div>
                            <Greeting
                                rides={ridedata.length}
                                icon={icon}
                                greeting={greeting}
                                name={
                                    userData.userProfile?.firstName +
                                    " " +
                                    userData.userProfile?.lastName
                                }
                            />
                            <button
                                onClick={onOpen}
                                className='mt-5 ms-2 rounded-md flex justify-center items-center bg-primaryButton text-white gap-1 text-sm py-2 px-4'>
                                <MdOutlineDirectionsBike />
                                My Rides
                                <span className='bg-primaryText px-2 rounded-md'>
                                    {myRidedata?.length}
                                </span>
                            </button>
                        </div>
                        <div className='flex gap-2'>
                            <Tooltip
                                hasArrow
                                label='Clear Filter'
                                placement='top'
                                bg='black'>
                                <button
                                    onClick={handelClearFilter}
                                    className='text-2xl text-white bg-yellow-500 p-2 rounded-md  h-fit '>
                                    <TbFilterX />
                                </button>
                            </Tooltip>
                            <Tooltip
                                hasArrow
                                label='Filter'
                                placement='top'
                                bg='black'>
                                <button
                                    onClick={() => setOpenFilter(true)}
                                    className='text-2xl text-white bg-primaryText  p-2 rounded-md h-fit '>
                                    <TbFilter />
                                </button>
                            </Tooltip>
                            <button
                                onClick={onMapOpen}
                                className='flex justify-center items-center px-3 py-2 bg-primaryDarkblue rounded-md text-white gap-1'>
                                <FaRegMap /> Map
                            </button>
                        </div>
                    </div>

                    <div>
                        {openFilter && (
                            <QuickFilter
                                closeFilter={() => setOpenFilter(false)}
                                handelFilterData={handelFilterInput}
                            />
                        )}
                    </div>

                    <div>
                        <DateFilterButton
                            ridedata={rideArray}
                            handelFilterData={handelFilterData}
                            filter={filter}
                        />
                    </div>

                    <div className='text-xl flex gap-5'>
                        <div className='w-[65%] mt-6 '>
                            <div>
                                {isArray(hotRideArray) &&
                                    hotRideArray.length > 0 && (
                                        <p className='font-bold ms-1 mb-3'>
                                            Hot Rides
                                        </p>
                                    )}
                                <HotRideCard data={hotRideArray} />
                            </div>

                            <div className='mt-5'>
                                {isArray(rideListArray) &&
                                rideListArray.length > 0 ? (
                                    <>
                                        <p className='font-bold ms-1 mb-3'>
                                            Upcoming Rides{" "}
                                        </p>
                                        {rideListArray?.map((data) => (
                                            <RideCard
                                                data={data}
                                                key={data.activityID}
                                                userData={userData}
                                                handleLike={handleApi}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div className='min-h-52 border rounded-lg shadow-lg bg-white p-6 text-center'>
                                            <p className='mt-3 text-xl font-semibold '>
                                                There are no upcoming rides in
                                                your area!
                                            </p>
                                            <div className='text-base mt-3'>
                                                <p>
                                                    Want to see more rides by
                                                    default?
                                                </p>
                                                <p>
                                                    Update your profile to
                                                    increase your ride
                                                </p>
                                                <p>
                                                    radius, check out the
                                                    calendar, or add a ride!
                                                </p>
                                            </div>
                                            <div className='w-56 mx-auto my-8'>
                                                <img
                                                    className='w-full'
                                                    src={letsRide.src}
                                                    alt='ride image'
                                                />
                                            </div>
                                            <div className='flex gap-5'>
                                                <Link
                                                    href={"/calendar"}
                                                    className='w-1/2 py-2 rounded-md text-primaryDarkblue border border-primaryDarkblue'>
                                                    Calendar
                                                </Link>
                                                <Link
                                                    href={`ride/add`}
                                                    className='w-1/2 py-2 rounded-md bg-primaryDarkblue text-white border border-primaryDarkblue '>
                                                    {" "}
                                                    Add Ride
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='w-[35%] mt-6 space-y-7 '>
                            <NewsCard />
                            <LeaderBoardList />
                            {/* <FriendCard /> */}
                        </div>
                    </div>
                </div>
            </div>
            <MapModal isOpen={isMapModal} onClose={onMapClose} />
            <MyRideModal isOpen={isOpen} onClose={onClose} />
        </div>
    );
};
