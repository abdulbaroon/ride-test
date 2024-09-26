"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { TbFilter, TbFilterX } from "react-icons/tb";
import { Tooltip, useDisclosure } from "@chakra-ui/react";
import { format } from "date-fns";
import { RootState, AppDispatch } from "@/redux/store/store";
import {
  getRideList,
  getHotRideList,
  getMyRideList,
  getPointDetails,
  getUserStats,
  getActivityExplore,
  getFriendCount,
  getDashBoardWeather,
  getLeaderBoard,
  getPointLevels,
} from "@/redux/slices/dashboardSlice";
import { formatRideList } from "@/shared/util/format.util";
import { isArray } from "lodash";
import Greeting from "./parts/Greeting";
import UserProfile from "./parts/UserProfile";
import RideCard from "./parts/RideCard";
import HotRideCard from "./parts/HotRideCard";
import DateFilterButton from "./parts/DateFilterButton";
import QuickFilter from "./parts/QuickFilter";
import WeatherForecast from "./parts/WeatherForecast";
import MyRideModal from "./parts/MyRideModal";
import LeaderBoardList from "./parts/LeaderBoardList";
import NewsCard from "./parts/NewsCard";
import { profileData } from "@/constant";
import { getProfile } from "@/redux/slices/authSlice";
import { FormattedRide, Item, RideItem } from "@/shared/types/dashboard.types";
import {
  faBeerMug,
  faCoffee,
  faHamburger,
  faThumbsUp,
  faZzz,
} from "@fortawesome/pro-light-svg-icons";
import { User } from "@/shared/types/account.types";
import { letsRide } from "@/assets";
import Link from "next/link";

/**
 * Returns an icon and greeting based on the current time of day.
 *
 * @returns {{ icon: any, greeting: string }} The icon and greeting message.
 */
const getTimeOfDayIconAndGreeting = (): { icon: any; greeting: string } => {
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

/**
 * Interface representing filter inputs for rides.
 */
interface FilterInputs {
  /** The radius for filtering rides. */
  radius: number;

  /** The ride type for filtering. */
  rideType: number;

  /** The name of the ride for filtering. */
  rideName: string;
}

/**
 * The DashboardPage component is responsible for rendering the main dashboard
 * of the user which includes ride lists, user profile, weather forecast, leaderboard,
 * and various filters.
 *
 * @component
 * @returns {JSX.Element} The rendered dashboard page component.
 *
 * @description This component integrates data from various Redux slices such as
 * `dashboardSlice`, `authSlice`, and fetches user-specific information like ride lists,
 * user stats, profile details, and leaderboard.
 */
export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Chakra UI modal hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isMapOpen,
    onOpen: onMapOpen,
    onClose: onMapClose,
  } = useDisclosure();

  /** The array of formatted rides for display */
  const [rideListArray, setRideListArray] = useState<FormattedRide[]>([]);

  /** The array of formatted hot rides */
  const [hotRideArray, setHotRideArray] = useState<FormattedRide[]>([]);

  /** Boolean state to toggle the filter panel */
  const [openFilter, setOpenFilter] = useState(false);

  /** The input values for filtering rides */
  const [inputFilter, setInputFilter] = useState<any>(null);

  /** Boolean state indicating if filters are applied */
  const [filter, setFilter] = useState(false);

  /** Fetches user data from the Redux store */
  const userData = useSelector<RootState>((state) => state.auth.user) as User;

  /** Fetches hot ride data from the Redux store */
  const hotRidedata = useSelector<RootState, Item[]>(
    (state) => state.dashboard.hotRideList
  );

  /** Fetches user's ride data from the Redux store */
  const myRidedata = useSelector<RootState, Item[]>(
    (state) => state.dashboard.myRideList
  );

  /** Fetches point details from the Redux store */
  const pointDetails = useSelector<RootState, any>(
    (state) => state.dashboard.pointDetails
  );

  /** Fetches user statistics from the Redux store */
  const userStats = useSelector<RootState, any>(
    (state) => state.dashboard.userStats
  );

  /** Fetches ride list data from the Redux store */
  const ridedata = useSelector<RootState, Item[]>(
    (state) => state.dashboard.rideList
  );

  /** Fetches user profile data from the Redux store */
  const profile = useSelector<RootState, any>((state) => state.auth.profileData);

  /**
   * Memoizes the list of ride cards for rendering.
   */
  const ridememo = useMemo(
    () =>
      rideListArray?.map((data) => (
        <RideCard data={data} key={data.activityID} userData={userData} />
      )),
    [rideListArray]
  );

  // Destructuring the time-based greeting and icon
  const { icon, greeting } = getTimeOfDayIconAndGreeting();

  /**
   * User object containing information such as name, location, level, and statistics.
   */
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

  /**
   * Fetches all required dashboard data such as ride lists, user stats, point details, etc.
   * Dispatches multiple Redux actions to fetch the required data.
   */
  const fetchDashboardData = useCallback(() => {
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
      dispatch(
        getFriendCount({ id: userData.id, radius: profile.defaultRadius })
      );
      dispatch(
        getDashBoardWeather({
          lat: profile?.homeBaseLat || 0,
          lng: profile.homeBaseLng,
          uom: profile?.unitOfMeasureID || 1,
        })
      );
    }
  }, [dispatch, userData?.id, profile?.defaultRadius]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Formats and sets the ride list and hot ride list based on the current filter or unfiltered data.
   */
  useEffect(() => {
    const formattedRides = ridedata.map(formatRideList);
    const formattedHotRides = hotRidedata.map(formatRideList);

    setRideListArray(
      inputFilter
        ? ridedata?.filter(applyFilter)?.map(formatRideList)
        : formattedRides
    );
    setHotRideArray(formattedHotRides);
  }, [inputFilter, ridedata, hotRidedata]);

  /**
   * Applies a filter to the rides based on ride name, radius, and type.
   *
   * @param {any} ride - The ride object to check against the filter.
   * @returns {boolean} Whether the ride matches the current filter.
   */
  const applyFilter = (ride: any): boolean => {
    const matchesName = inputFilter.rideName
      ? ride?.activityName
          .toLowerCase()
          .includes(inputFilter.rideName.toLowerCase())
      : true;
    const matchesRadius = inputFilter.radius
      ? inputFilter.radius > (ride?.activityRoutes?.[0]?.distance ?? Infinity)
      : true;
    const matchesType = inputFilter.rideType
      ? Number(inputFilter.rideType) === ride?.activityTypeID
      : true;
    return matchesName && matchesRadius && matchesType;
  };

  /**
   * Handles the filtered ride data and sets the ride list.
   *
   * @param {RideItem[]} data - The filtered ride data.
   */
  const handelFilterData = (data: RideItem[]) => {
    if (data) {
      const formatRide = data.map((data) => formatRideList(data));
      setRideListArray(formatRide);
      setFilter(true);
    } else {
      setRideListArray([]);
    }
  };

  /**
   * Clears the filter and resets the ride list to its original unfiltered state.
   */
  const clearFilter = () => {
    setFilter(false);
    setInputFilter(null);
    setRideListArray(ridedata.map(formatRideList));
  };


  return (
    <div className="mt-28 mb-6">
      <div className="w-11/12 mx-auto flex gap-5 max-w-[1320px]">
        <div className="w-1/4">
          <UserProfile {...user} />
          <WeatherForecast />
        </div>
        <div className="w-[75%]">
          <div className="w-full min-h-10 h-fit border border-neutral-300 rounded-md bg-white p-5 flex justify-between items-start">
            <Greeting
              rides={ridedata.length}
              icon={icon}
              greeting={greeting}
              name={user.name}
            />
            <div className="flex gap-2">
              <button
                onClick={onOpen}
                className="rounded-md flex bg-primaryButton text-white gap-1 text-sm py-2 px-4"
              >
                <MdOutlineDirectionsBike />
                My Rides
                <span className="bg-primaryText px-2 rounded-md">
                  {myRidedata.length}
                </span>
              </button>
              <Tooltip label="Clear Filter" placement="top" bg="black">
                <button
                  onClick={clearFilter}
                  className="text-2xl text-white bg-yellow-500 p-2 rounded-md"
                >
                  <TbFilterX />
                </button>
              </Tooltip>
              <Tooltip label="Filter" placement="top" bg="black">
                <button
                  onClick={() => setOpenFilter(true)}
                  className="text-2xl text-white bg-primaryText p-2 rounded-md"
                >
                  <TbFilter />
                </button>
              </Tooltip>
            </div>
          </div>

          {openFilter && (
            <QuickFilter
              closeFilter={() => setOpenFilter(false)}
              handelFilterData={setInputFilter}
            />
          )}

          <DateFilterButton
            ridedata={ridedata}
            handelFilterData={handelFilterData}
            filter={filter}
          />

          <div className="text-xl flex gap-5">
            <div className="w-[65%] mt-6">
              {hotRideArray.length > 0 && (
                <>
                  <p className="font-bold ms-1 mb-3">Hot Rides</p>
                  <HotRideCard data={hotRideArray} />
                </>
              )}
              {rideListArray.length > 0 ? (
                <>
                  <p className="font-bold ms-1 mb-3">Upcoming Rides</p>
                  {ridememo}
                </>
              ) : (
                <>
                  <div className="min-h-52 border border-neutral-300 rounded-md bg-white p-6 text-center">
                    <p className="mt-3 text-xl font-semibold ">
                      There are no upcoming rides in your area!
                    </p>
                    <div className="text-base mt-3">
                      <p>Want to see more rides by default?</p>
                      <p>Update your profile to increase your ride</p>
                      <p>radius, check out the calendar, or add a ride!</p>
                    </div>
                    <div className="w-56 mx-auto my-8">
                      <img
                        className="w-full"
                        src={letsRide.src}
                        alt="ride image"
                      />
                    </div>
                    <div className="flex gap-5">
                      <Link
                        href={"/calendar"}
                        className="w-1/2 py-2 rounded-md text-primaryDarkblue border border-primaryDarkblue"
                      >
                        Calendar
                      </Link>
                      <Link
                        href={`ride/add`}
                        className="w-1/2 py-2 rounded-md bg-primaryDarkblue text-white border border-primaryDarkblue "
                      >
                        {" "}
                        Add Ride
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="w-[35%] mt-6 space-y-7 ">
              <NewsCard />
              <LeaderBoardList />
            </div>
          </div>
        </div>
      </div>
      <MyRideModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
