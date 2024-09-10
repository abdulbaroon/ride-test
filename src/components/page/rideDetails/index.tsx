"use client"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Link from "next/link";
import { FaFlagCheckered } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";
import {
  getRideDetails,
  getActivityRoster,
  getActivityroute,
  getChatActivity,
  getFriendsList,
  getWeather,
  activityView,
} from "@/redux/slices/rideDetailsSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { formatRideData, hasDatePassed } from "@/shared/util/format.util";
import SideBar from "./parts/SideBar";
import RideDetail from "./parts/RideDetail";
import MapRoute from "./parts/MapRoute";
import RoasterDetail from "./parts/RoasterDetail";
import ChatBox from "./parts/ChatBox";
import { checkUserInRide } from "@/redux/slices/ratingSlice";
import { FormattedRideData } from "@/shared/types/dashboard.types";
import { User } from "@/shared/types/account.types";
import { api } from "@/shared/api";

const fetchRide= async (id:any)=>{
  try {
    const endpoint = `/activity/${id}`;
    const response = await api.get(endpoint);
    return response.data as any;
  } catch (error: any) {
   console.log("errir")
  }
}
export const getServerSideProps = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);

  // Fetch ride details
  const rideResponse = await fetchRide(id);
  console.log(rideResponse,"sds");
  
  const formattedRide = rideResponse ? formatRideData(rideResponse) : null;

  return {
    props: {
      rideDetails: formattedRide,
      id,
    },
  };
};

const RideDetails = ({ rideDetails: initialRideDetails, id }: { rideDetails: FormattedRideData, id: number }) => {
  const [rideDetails, setRideDetails] = useState<FormattedRideData>(initialRideDetails);
  const [userInRide, setUserInRide] = useState<boolean>(false);

  const user = useSelector<RootState>((state) => state.auth.user) as User;
  const dispatch = useDispatch<AppDispatch>();

  const fetchApis = async (id: number) => {
    const response = await dispatch(getRideDetails(id));
    if (getRideDetails.fulfilled.match(response)) {
      const formattedRide = formatRideData(response.payload);
      setRideDetails(formattedRide);
      const params = {
        date: formattedRide?.startDate,
        lat: formattedRide?.startLat,
        lng: formattedRide?.startLng,
        uom: formattedRide?.rideCreateUoM ?? 1,
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
    if (!rideDetails) {
      fetchApis(id);
    }
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
    <>
      <Head>
        <meta
          property="og:title"
          content={rideDetails?.rideName?.toUpperCase() || "Ride Details"}
        />
        <meta
          property="og:description"
          content={rideDetails?.rideNotes || "Check out this exciting ride!"}
        />
        <meta
          property="og:url"
          content={`https://chasingwatts.com/ride/${id}`}
        />
        <meta
          property="og:image"
          content={
            "https://dev.chasingwatts.com/ridepictures/ridepicture_32497_981.png"
          }
        />
      </Head>

      <div className="mt-28 mb-6">
        <div className="w-11/12 mx-auto !max-w-[1320px]">
          {hasDatePassed(rideDetails?.activityDateTime) && (
            <div className="p-4 my-4 border border-[#cedce2] bg-[#e7eef1] rounded-lg flex gap-2 text-primaryDarkblue font-light items-center ">
              <FaFlagCheckered />
              <p className="">
                THIS RIDE HAS PASSED! WHERE YOU ON THE RIDE?{" "}
                {userInRide && (
                  <>
                    <Link href={`/rate/${id}`} className="font-bold">
                      PLEASE RATE THE RIDE!
                    </Link>
                    <span>
                      This helps ride leaders create better rides going
                      forward!
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
          {rideDetails?.isCancelled && (
            <div className="p-4 my-4 border border-red-500 bg-red-50 rounded-lg flex gap-2 text-red-600 font-semibold items-center ">
              <MdOutlineCancelPresentation />
              <p className="">THIS RIDE HAS CANCELLED!</p>
            </div>
          )}
          <div className="flex gap-5">
            <div className="w-1/4">
              <SideBar id={id} />
            </div>
            <div className="w-3/4 space-y-5">
              <RideDetail />
              <MapRoute />
              <div className="w-full flex gap-5">
                <div className="w-1/2">
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
    </>
  );
};

export default RideDetails;
