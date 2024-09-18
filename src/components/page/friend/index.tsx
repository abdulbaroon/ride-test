"use client";
import { IMAGE_URl } from "@/constant/appConfig";
import {
    getFriendProfile,
    getMyRideList,
    getPointDetails,
    getUserStats,
} from "@/redux/slices/dashboardSlice";
import {
    connectFriend,
    getFriends,
    removeFriend,
} from "@/redux/slices/profileSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User, UserProfileData } from "@/shared/types/account.types";
import { formatDates } from "@/shared/util/dateFormat.util";
import { checkImageLoad, formatRideList } from "@/shared/util/format.util";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaRoad } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import { PiHouseLineBold, PiLightningBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import RideCard from "../dashboard/parts/RideCard";
import { GrBike } from "react-icons/gr";
import { BsFlower2 } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ReusableAlertDialog } from "@/components/basic/ReusableAlertDialog";
import { useDisclosure } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/pro-light-svg-icons/faHome";
import { faBoltLightning } from "@fortawesome/pro-light-svg-icons/faBoltLightning";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { faTachometer } from "@fortawesome/pro-light-svg-icons/faTachometer";
import { faRoad } from "@fortawesome/pro-light-svg-icons/faRoad";
import { faBicycle } from "@fortawesome/pro-light-svg-icons/faBicycle";
import Lottie from "lottie-react";
import * as animationData from "../../../assets/lottieAssets/loader.json";

interface FriendProps {
    id: number;
}

export const Friend: React.FC<FriendProps> = ({ id }) => {
    const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const friendProfile = useSelector<RootState>(
        (state) => state.dashboard.friendProfile
    ) as UserProfileData;

    const pointDetails = useSelector<RootState, any>(
        (state) => state.dashboard.pointDetails
    ) as any;

    const userStats = useSelector<RootState, any>(
        (state) => state.dashboard.userStats
    );

    const friendsList = useSelector<RootState, any>(
        (state) => state.profile.friendList
    );

    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
    } = useDisclosure();

    const fetchApi = useCallback(() => {
        dispatch(getFriendProfile(id));
        dispatch(getPointDetails(id));
        dispatch(getUserStats(id));
        dispatch(getFriends(user.id));
    }, [dispatch, id]);

    useEffect(() => {
        fetchApi();
    }, [fetchApi]);

    useEffect(() => {
        const isConnected = friendsList.some(
            (friend: any) => friend.followingID === friendProfile?.userID
        );
        setIsAlreadyConnected(isConnected);
    }, [friendsList]);

    useEffect(() => {
        const fetchRides = async () => {
            if (friendProfile?.userID && friendProfile?.defaultRadius) {
                const params = {
                    id: friendProfile?.userID,
                    feedType: "me",
                    radius: friendProfile?.defaultRadius,
                };
                const response = await dispatch(getMyRideList(params));
                if (getMyRideList.fulfilled.match(response)) {
                    const formattedRide = response.payload?.map(formatRideList);
                    setRides(formattedRide);
                }
            }
        };
        fetchRides();
    }, [friendProfile]);

    const handleJoin = async () => {
        const payload = {
            userID: user?.id,
            followingID: friendProfile?.userID,
            isConfirmed: true,
            createdBy: user?.id,
            createdDate: new Date().toISOString(),
        };
        setLoading(true);
        const response = await dispatch(connectFriend(payload));
        setLoading(false);
        if (connectFriend.fulfilled.match(response)) {
            toast.success("You have a new friend!");
            fetchApi();
        } else {
            toast.error("Something went wrong. Please try again");
        }
    };
    const handleLeave = async () => {
        onAlertClose();
        setLoading(true);
        const response = await dispatch(
            removeFriend({
                followingID: friendProfile?.userID,
                userID: user.id,
            })
        );
        setLoading(false);
        if (removeFriend.fulfilled.match(response)) {
            fetchApi();
            toast.success("You have one less friend!");
        } else {
            toast.error("Something went wrong. Please try again.");
        }
    };

    useEffect(() => {
        const loadImage = async () => {
            const url = await checkImageLoad(
                `${IMAGE_URl}/useravatar/pfimg_${friendProfile?.userID}.png?lastmod=${friendProfile?.modifiedDate}`
            );
            setImageUrl(
                url ||
                    "https://dev.chasingwatts.com/useravatar/defaultavatar.jpg"
            );
        };

        loadImage();
    }, [friendProfile?.userID]);

    return (
        <div className='w-11/12 mx-auto !max-w-[1320px] mt-28'>
            <div className=''>
                <div className=' flex bg-white rounded-md border border-neutral-300'>
                    <div className=''>
                        <img
                            className='aspect-auto object-cover rounded-l-md'
                            src={imageUrl}
                            alt='profile'
                        />
                    </div>
                    <div className='px-6 py-4 flex flex-col w-full '>
                        <div className=' flex w-full justify-between'>
                            <div>
                                <p className='text-2xl font-bold text-gray-700'>
                                    {friendProfile?.firstName}{" "}
                                    {friendProfile?.lastName}
                                </p>
                                <p>CW ID: {friendProfile?.userID}</p>
                                <p>
                                    Joined on{" "}
                                    {formatDates(
                                        friendProfile?.createdDate,
                                        "MMM dd, yyyy"
                                    )}
                                </p>
                            </div>
                            <div
                                className='w-20 h-20 rounded-full border-4 flex justify-center items-center '
                                style={{
                                    backgroundColor:
                                        friendProfile?.activityTypeModel &&
                                        friendProfile?.activityTypeModel
                                            .activityTypeColor,
                                }}>
                                <p className='font-semibold'>
                                    {friendProfile?.activityTypeModel &&
                                        friendProfile?.activityTypeModel
                                            .activityTypeName}
                                </p>
                            </div>
                        </div>
                        <div className='flex gap-5 mt-2'>
                            <div className='border border-neutral-300 flex w-fit h-fit items-center gap-2 px-3 py-1 rounded-md'>
                                <FontAwesomeIcon
                                    icon={faTachometer}
                                    size='lg'
                                    className='fa-fw text-neutral-500'
                                />
                                <div className='text-xs'>
                                    <p>Avg Spd</p>
                                    <p className='font-semibold'>
                                        {userStats?.userAvgSpeed} mph
                                    </p>
                                </div>
                            </div>
                            <div className='border border-neutral-300 flex w-fit h-fit items-center gap-2 px-3 py-1 rounded-md'>
                                <FontAwesomeIcon
                                    icon={faRoad}
                                    size='lg'
                                    className='fa-fw text-neutral-500'
                                />
                                <div className='text-xs'>
                                    <p>Miles</p>
                                    <p className='font-semibold'>
                                        {userStats&&userStats?.userDistance?.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className='border border-neutral-300 flex w-fit h-fit items-center gap-2 px-3 py-1 rounded-md'>
                                <FontAwesomeIcon
                                    icon={faBicycle}
                                    size='lg'
                                    className='fa-fw text-neutral-500'
                                />
                                <div className='text-xs'>
                                    <p>Rides</p>
                                    <p className='font-semibold'>
                                        {userStats&&userStats.userRideCount.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {user.id != friendProfile?.userID && (
                            <div>
                                {isAlreadyConnected ? (
                                    <button
                                        onClick={onAlertOpen}
                                        className='mt-4 text-white bg-red-500 font-semibold py-[6px] px-4 rounded-md'>
                                        {loading ? (
                                            <CgSpinner className='animate-spin w-6 h-6' />
                                        ) : (
                                            "Remove Friend"
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleJoin}
                                        className='mt-4 text-white bg-primaryDarkblue font-semibold py-[6px] px-4 rounded-md'>
                                        {loading ? (
                                            <CgSpinner className='animate-spin w-6 h-6' />
                                        ) : (
                                            "+ Add Friend"
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* details and upcoming ride list */}
                <div className='flex justify-start gap-3 my-5'>
                    <div className='w-1/2'>
                        <div className='bg-white border border-neutral-300 p-3 rounded-md mb-3 flex flex-row items-center'>
                            <FontAwesomeIcon
                                icon={faHome}
                                size='sm'
                                className='fa-fw text-neutral-500'
                            />
                            <Link
                                href={`http://maps.google.com/maps?daddr=${friendProfile?.homeBaseLat},${friendProfile?.homeBaseLng}`}
                                target='_blank'
                                className='flex text-base ml-2 flex-grow'>
                                {friendProfile?.homeBaseCity},{" "}
                                {friendProfile?.homeBaseState},{" "}
                                {friendProfile?.homeBaseCountry}
                            </Link>
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                size='sm'
                                className='fa-fw text-neutral-500 ml-2'
                            />
                        </div>
                        <div className='bg-white border border-neutral-300 p-3 rounded-md mb-3 flex flex-row items-center'>
                            <FontAwesomeIcon
                                icon={faBoltLightning}
                                //size='sm'
                                className='fa-fw text-neutral-500'
                            />
                            <Link
                                href={`/points?userID=${friendProfile?.userID}`}
                                target='_blank'
                                className='flex text-base ml-2 flex-grow'>
                                {pointDetails
                                    ? pointDetails.joulePointTotal.toLocaleString(
                                          undefined,
                                          {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 0,
                                          }
                                      ) + " joules"
                                    : "No points at this time."}
                            </Link>
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                size='sm'
                                className='fa-fw text-neutral-500 ml-2'
                            />
                        </div>
                        <div className='bg-white border border-neutral-300 p-3 rounded-md mb-3 flex flex-row items-center'>
                            <FontAwesomeIcon
                                icon={faBoltLightning}
                                size='sm'
                                className='fa-fw text-red-500'
                            />
                            <Link
                                href='/points'
                                target='_blank'
                                className='flex text-base ml-2 flex-grow'>
                                {pointDetails
                                    ? pointDetails.levelName
                                    : "picowatt"}
                                <span className='text-gray-500 ml-3'>
                                    Level up!
                                </span>
                            </Link>
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                size='sm'
                                className='fa-fw text-neutral-500 ml-2'
                            />
                        </div>
                        <div className='bg-white border border-neutral-300 p-3 rounded-md mb-3 flex flex-row items-center'>
                            <div className='text-sm text-neutral-500'>
                                <p className='mb-2'>
                                    While using the Chasing Watts platform, you
                                    will automatically power up with the joule
                                    points program! Through your easy
                                    interaction on the Chasing Watts site and
                                    mobile apps, you will earn valuable points.
                                </p>
                                <p className='mb-2'>
                                    Create a ride, join a ride, chat, invite
                                    your friends and review rides - all will
                                    earn you points that can get you limited
                                    swag and cool bike stuff!
                                </p>
                                <p className='mb-2'>
                                    Please note, adding content will earn points
                                    and deleting content will deduct points
                                    equally.
                                </p>
                                <p>
                                    <Link
                                        href={`/points?userID=${user?.id}`}
                                        target='_blank'
                                        className='flex text-base text-primaryText'>
                                        Check out your details!
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <div>
                            {rides?.length > 0 ? (
                                <div className=''>
                                    {rides?.map((data, index) => (
                                        <RideCard
                                            data={data}
                                            key={index}
                                            isLike={false}
                                            showPicture={false}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='justify-center gap-5 bg-white border border-neutral-300 rounded-md p-3 pb-6'>
                                    <div className='content-center'>
                                        <Lottie
                                            className='w-1/2 mx-auto'
                                            aria-activedescendant=''
                                            animationData={animationData}
                                            loop={true}></Lottie>
                                    </div>
                                    <div className='text-base text-center my-auto mb-4'>
                                        <p>
                                            Bummer! {friendProfile?.firstName}{" "}
                                            has not joined any upcoming rides!
                                        </p>
                                        <p>
                                            You should send an invite and
                                            connect!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ReusableAlertDialog
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                title='Disconnect?'
                message='Are you sure you remove this friend?'
                onConfirm={handleLeave}
            />
        </div>
    );
};
