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
import { BiDetail } from "react-icons/bi";
import { FaRoad } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import {
  PiHouseLineBold,
  PiLightningBold,
  PiPersonSimpleBike,
} from "react-icons/pi";
import { TfiPin } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import RideCard from "../dashboard/parts/RideCard";
import { GrBike } from "react-icons/gr";
import { BsFlower2 } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ReusableAlertDialog } from "@/components/basic/ReusableAlertDialog";
import { useDisclosure } from "@chakra-ui/react";
import UpcomingRidesSVG from "@/assets/icons/UpcomingRidesSVG";

interface FriendProps {
  id: number;
}

export const Friend: React.FC<FriendProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl,setImageUrl]=useState("")

  const friendProfile = useSelector<RootState>(
    (state) => state.dashboard.friendProfile
  ) as UserProfileData;
  const pointDetails = useSelector<RootState, any>(
    (state) => state.dashboard.pointDetails
  );
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
      if (friendProfile.userID && friendProfile.defaultRadius) {
        const params = {
          id: friendProfile.userID,
          feedType: "me",
          radius: friendProfile.defaultRadius,
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
      const url = await checkImageLoad(`${IMAGE_URl}/useravatar/pfimg_${friendProfile.userID}.png?lastmod=${friendProfile.modifiedDate}`);
      setImageUrl(url || "https://dev.chasingwatts.com/useravatar/blank-avatar.png");
    };

    loadImage();
  }, [friendProfile.userID]);

  return (
    <div className="w-11/12 mx-auto !max-w-[1320px] mt-28">
      <div className="">
        <div className=" flex bg-white">
          <div className="">
            <img
              className="h-56 w-72"
              src={imageUrl}
              alt="profile"
            />
          </div>
          <div className="px-6 py-4 flex flex-col w-full ">
            <div className=" flex w-full justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {friendProfile.firstName} {friendProfile.lastName}
                </p>
                <p>CW ID: {friendProfile.userID}</p>
                <p>
                  Joined on{" "}
                  {formatDates(friendProfile.createdDate, "MMM dd, yyyy")}
                </p>
              </div>
              <div
                className="w-20 h-20 rounded-full border-4 flex justify-center items-center "
                style={{
                  backgroundColor:
                    (friendProfile?.activityTypeModel) && friendProfile?.activityTypeModel.activityTypeColor,
                }}
              >
                <p className="font-semibold">
                  {(friendProfile?.activityTypeModel) && friendProfile.activityTypeModel.activityTypeName}
                </p>
              </div>
            </div>
            <div className="flex gap-5 mt-2">
              <div className="border flex w-fit h-fit items-center gap-2 px-3 py-1 rounded-md shadow">
                <IoSpeedometer className="text-xl" />
                <div className="text-xs">
                  <p>AVG</p>
                  <p className="font-semibold">{userStats.userAvgSpeed}</p>
                </div>
              </div>
              <div className="border flex w-fit h-fit items-center gap-2 px-3 py-1 rounded-md shadow">
                <FaRoad className="text-xl" />
                <div className="text-xs">
                  <p>Miles</p>
                  <p className="font-semibold">{userStats.userDistance}</p>
                </div>
              </div>
              <div className="border flex w-fit h-fit items-center gap-2 px-3 py-1 rounded-md shadow">
                <GrBike className="text-xl" />
                <div className="text-xs">
                  <p>Rides</p>
                  <p className="font-semibold">{userStats.userRideCount}</p>
                </div>
              </div>
            </div>
            {user.id != friendProfile.userID && (
              <div>
                {isAlreadyConnected ? (
                  <button
                    onClick={onAlertOpen}
                    className="mt-4 text-white bg-red-500 font-semibold py-[6px] px-4 rounded-md"
                  >
                    {loading ? (
                      <CgSpinner className="animate-spin w-6 h-6" />
                    ) : (
                      "Remove Friend"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    className="mt-4 text-white bg-primaryDarkblue font-semibold py-[6px] px-4 rounded-md"
                  >
                    {loading ? (
                      <CgSpinner className="animate-spin w-6 h-6" />
                    ) : (
                      "+ Add Friend"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-3 my-5">
          <button
            className={`py-2 px-4 border-2 rounded-lg flex gap-1 items-center ${
              activeTab === "details"
                ? "bg-primaryButton text-white"
                : "bg-lightwhite  text-primaryButton"
            }`}
            onClick={() => setActiveTab("details")}
          >
            <BiDetail /> Details
          </button>
          <button
            className={`py-2 px-4 border-2 rounded-lg flex gap-1 items-center ${
              activeTab === "rides"
                ? "bg-primaryButton text-white"
                : "bg-lightwhite  text-primaryButton"
            }`}
            onClick={() => setActiveTab("rides")}
          >
            <PiPersonSimpleBike /> Rides
          </button>
        </div>
        <div className="">
          {activeTab === "details" && (
            <div className="bg-white  rounded-xl">
              <div className="flex items-center gap-2 py-2 px-5 border-b-2 border-lightGray">
                <PiHouseLineBold />
                <Link
                  href={`http://maps.google.com/maps?daddr=${friendProfile?.homeBaseLat},${friendProfile?.homeBaseLng}`}
                  target="_blank"
                  className="flex text-base text-[15px] "
                >
                  {friendProfile.homeBaseCity}, {friendProfile.homeBaseState},{" "}
                  {friendProfile.homeBaseCountry}
                </Link>
              </div>
              <div className="flex items-center gap-2 py-2 px-5 border-b-2 border-lightGray ">
                <PiLightningBold className="border border-black rounded-3xl p-[1px]" />
                <Link
                  href={`/points?userID=${friendProfile.userID}`}
                  target="_blank"
                  className="flex text-base text-[15px] "
                >
                  {pointDetails.joulePointTotal} Joules
                </Link>
              </div>
              <div className="flex items-center gap-2 py-2 px-5       ">
                <BsFlower2 />
                <p className="capitalize">{pointDetails.levelName}</p>
              </div>
            </div>
          )}
          {activeTab === "rides" && (
            <div>
              {rides?.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {rides?.map((data, index) => (
                    <RideCard data={data} key={index} isLike={false} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center gap-5">
                  <div>
                    <UpcomingRidesSVG />
                  </div>
                  <div className="text-xl font-semibold text-center my-auto ">
                    <p>
                      Bummer! {friendProfile?.firstName?.toUpperCase()} is not on
                      any upcoming rides!
                    </p>
                    <p>You should send an invite and connect!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ReusableAlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        title="Disconnect?"
        message="Are you sure you remove this friend?"
        onConfirm={handleLeave}
      />
    </div>
  );
};
