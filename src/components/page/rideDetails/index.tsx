"use client";

import {
  activityView,
  getActivityRoster,
  getActivityroute,
  getChatActivity,
  getFriendsList,
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

export const RideDetails = ({ id }: { id: number }) => {
  const [rideDetails, setRideDetails] = useState<FormattedRideData>();
  const [userInRide, setUserInRide] = useState<boolean>(false);

  const user = useSelector<RootState>((state) => state.auth.user) as User;
  const dispatch = useDispatch<AppDispatch>();

  const fetchApis = async (id: number) => {
    const response = await dispatch(getRideDetails(id));
    if (getRideDetails.fulfilled.match(response)) {
      const formatedRide = formatRideData(response.payload);
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
        userID: user?.id,
      };
      dispatch(getActivityroute(id));
      dispatch(getActivityRoster(id));
      dispatch(activityView(viewpayload));
      dispatch(getChatActivity(chatparams));
      dispatch(getWeather(params));
      dispatch(getFriendsList({ id: user.id, activityID: id }));
    }
  };

  useEffect(() => {
    fetchApis(id);
  }, [id]);

  useEffect(() => {
    const checkUser = async () => {
      if (id && user.id) {
        const response = await dispatch(
          checkUserInRide({ activityID: id, userID: user.id })
        );
        if (checkUserInRide.fulfilled.match(response)) {
          setUserInRide(response.payload);
        }
      }
    };
    checkUser();
  }, [id]);

  return (
    <div className=" mt-28 mb-6 ">
      <div className="w-11/12 mx-auto !max-w-[1320px]">
        {hasDatePassed(rideDetails?.activityDateTime) && (
          <div className="p-4 my-4 border border-[#cedce2] bg-[#e7eef1] rounded-lg flex gap-2 text-primaryDarkblue font-light items-center ">
            <FaFlagCheckered />
            <p className=" ">
              THIS RIDE HAS PASSED! WHERE YOU ON THE RIDE?{" "}
              {userInRide && (
                <>
                  {" "}
                  <Link href={`/rate/${id}`} className="font-bold">
                    {" "}
                    PLEASE RATE THE RIDE!
                  </Link>{" "}
                  <span>
                    This helps ride leaders create better rides going forward!?
                  </span>
                </>
              )}
            </p>
          </div>
        )}
        {rideDetails?.isCancelled && (
          <div className="p-4 my-4 border border-red-500 bg-red-50 rounded-lg flex gap-2 text-red-600 font-semibold items-center ">
            <MdOutlineCancelPresentation />
            <p className=" ">THIS RIDE HAS CANCELLED!</p>
          </div>
        )}
        <div className="flex gap-5 ">
          <div className="w-1/4">
            <SideBar id={id} />
          </div>
          <div className="w-3/4 space-y-5 ">
            <RideDetail />
            <MapRoute />
            <div className="w-full flex gap-5">
              <div className="w-1/2 ">
                <RoasterDetail />
              </div>
              <div className="w-1/2">
                <ChatBox />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
