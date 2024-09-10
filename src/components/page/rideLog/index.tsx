"use client";

import {
  fetchActivityLog,
  fetchActivityRating,
  fetchActivityView,
} from "@/redux/slices/rideLogSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { formatDates } from "@/shared/util/dateFormat.util";
import { ViewBase } from "@syncfusion/ej2-react-schedule";
import dayjs from "dayjs";
import { FC, useEffect } from "react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const StarRating: FC<{ rating: number }> = ({ rating }) => {
  const getStarElements = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Full Star
        stars.push(
          <svg
            key={i}
            className="w-6 h-6 text-blue-900 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
            />
          </svg>
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        // Half Star
        stars.push(
          <svg
            key={i}
            className="w-6 h-6 text-blue-900 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <defs>
              <linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
              fill="url(#half)"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              fill="none"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
            />
          </svg>
        );
      } else {
        // Empty Star
        stars.push(
          <svg
            key={i}
            className="w-6 h-6 text-blue-900  fill-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
            />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center justify-center mb-4">
      {getStarElements(rating)}
    </div>
  );
};

export const RideLog: FC<{ id: number }> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { activityview, activitylog, activityrating, loading, error } =
    useSelector<RootState, any>((state) => state.ridelog);

  useEffect(() => {
    if (id) {
      dispatch(fetchActivityView(id));
      dispatch(fetchActivityLog(id));
      dispatch(fetchActivityRating(id));
    }
  }, [id]);

 
  const transformedData = activityview?.map((item: any) => {
    const date = new Date(item.label);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    return {
      views: item.value,
      date: label,
    };
  });

  return (
    <>
      <div className="w-11/12 mx-auto !max-w-[1320px] mt-28 mb-5">
        <div className="flex mb-6 mt-3  gap-5">
          <div
            className={` bg-white w-1/2  rounded-lg  p-6 mx-auto max-h-[395px] overflow-y-auto`}
          >
            <div className="">
              <p className="pb-4 text-2xl font-semibold">Ride Log</p>
              {activitylog?.map((data: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div>
                    <p className="text-xl font-medium">{data.logText}</p>
                    <p className=" text-gray-500 text-sm">
                      {formatDates(data.createdDate, "MMM dd, yyyy ,hh:mm a")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm me-3">
                      {data.userProfileModel &&
                        `${data.userProfileModel.firstName} ${data.userProfileModel.lastName}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={` bg-white w-1/2  rounded-lg p-6 mx-auto h-fit`}>
            <div className="">
              <p className="pb-4 text-2xl font-semibold">Ride Views</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transformedData} barSize={20} barGap={14}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                  <Tooltip />
                  <Bar
                    dataKey="views" 
                    fill="#244161"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  >
                    <LabelList dataKey="views" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {activityrating?.map((data: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow p-4  ">
              <StarRating rating={data.userRating} />
              <p className=" text-gray-700 font-semibold   border-b py-1">
                Overall rating: {data.userRating}
              </p>

              <div className="">
                <div className="flex justify-between items-center   border-b py-1">
                  <p className="text-gray-700">Route was good?</p>

                  <div>
                    {data?.routeGood ? (
                      <FaCircleCheck className="text-green-500" />
                    ) : (
                      <FaCircleXmark className="text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center   border-b py-1">
                  <p className="text-gray-700">Felt safe?</p>

                  <div>
                    {data?.saftetyGood ? (
                      <FaCircleCheck className="text-green-500" />
                    ) : (
                      <FaCircleXmark className="text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center   border-b py-1">
                  <p className="text-gray-700">Weather accurate?</p>

                  <div>
                    {data?.weatherGood ? (
                      <FaCircleCheck className="text-green-500" />
                    ) : (
                      <FaCircleXmark className="text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center   border-b py-1">
                  <p className="text-gray-700">Speed was as posted?</p>

                  <div>
                    {data?.speedGood ? (
                      <FaCircleCheck className="text-green-500" />
                    ) : (
                      <FaCircleXmark className="text-red-600" />
                    )}
                  </div>
                </div>
              </div>
              {data?.userComments && (
                <p className="text-gray-700 border-b py-1">
                  {data?.userComments}
                </p>
              )}
              <div className="text-gray-500 text-[10px] mt-4">
                Submitted by {data?.userProfileModel?.firstName}{" "}
                {data?.userProfileModel?.lastName.charAt(0).toUpperCase()} on{" "}
                {dayjs(data?.ratingDate).format("MMM DD, YYYY hh:mm A")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
