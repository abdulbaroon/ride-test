"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import Link from "next/link";
import dayjs from "dayjs";

import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { LeaderBoardItem } from "@/shared/types/dashboard.types";
import {
  GetUserPoint,
  PointsLevels,
  PointTypes,
} from "@/shared/types/points.types";
import {
  getPointLevel,
  getpointType,
  getUserPoint,
} from "@/redux/slices/pointSlice";
import { getLeaderBoard } from "@/redux/slices/dashboardSlice";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "next/navigation";

export const Points = () => {
  const [mode, setMode] = useState<string>("");
  const searchParams = useSearchParams();
  const userID = searchParams.get("userID");

  const dispatch = useDispatch<AppDispatch>();
  const leaderBoard = useSelector<RootState, LeaderBoardItem[]>(
    (state) => state.dashboard.leaderBoard
  );
  const pointLevels = useSelector<RootState, PointsLevels[]>(
    (state) => state.point.pointLevel
  );
  const pointTypes = useSelector<RootState, PointTypes[]>(
    (state) => state.point.pointType
  );
  const user = useSelector<RootState>((state) => state.auth.user) as User;
  const userPoints = useSelector<RootState, GetUserPoint[]>(
    (state) => state.point.userPoint
  );

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = userPoints.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(userPoints.length / itemsPerPage);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % userPoints.length;
    
    setItemOffset(newOffset);
  };

  useEffect(() => {
    dispatch(getPointLevel());
    dispatch(getpointType());
  }, [dispatch]);

  useEffect(() => {
    if (mode && user) {
      const params = {
        userID: userID ? userID : user.id,
        mode: Number(mode),
      };
      dispatch(getLeaderBoard(params.mode));
      dispatch(getUserPoint(params));
    }
  }, [mode, dispatch, user, userID]);

  return (
    <div className="w-11/12 mx-auto max-w-[1320px] mt-28">
      <div className="flex w-full gap-5">
        <div className="w-1/2 bg-white rounded-lg">
          <p className="text-2xl font-bold text-gray-800 p-5 border-b">
            Earn points while Chasing Watts!
          </p>
          <div className="p-5 space-y-4 text-lg text-gray-500">
            <p>
              While chasing watts, you will also power up with the joule points
              program! Through your interaction on the Chasing Watts site and
              <Link href={"#"} className="text-primaryText">
                {" "}
                mobile apps
              </Link>
              , you will earn valuable points.
            </p>
            <p>
              Create a ride, join a ride, chat, invite your friends, and review
              rides - all will earn you points that can get you limited swag and
              cool bike stuff!
            </p>
            <p>
              Please{" "}
              <Link href={"#"} className="text-primaryText">
                contact
              </Link>{" "}
              us with any questions or feedback on the Joule program!
            </p>
            <p className="text-sm w-[90%]">
              Please note, adding content will earn points and deleting content
              will deduct points equally.
            </p>
          </div>
        </div>

        <div className="flex w-1/2 gap-5">
          <div className="w-1/2 bg-white rounded-lg">
            <p className="text-2xl font-bold text-gray-800 p-5 border-b">
              Joule Classification
            </p>
            <div className="p-5">
              {pointTypes.map((type, index) => (
                <div
                  key={index}
                  className={`flex justify-between py-2 px-2 text-lg ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <p className="font-semibold">{type.pointTypeName}</p>
                  <p>{type.pointAmount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/2 bg-white rounded-lg">
            <p className="text-2xl font-bold text-gray-800 p-5 border-b">
              Joule Levels
            </p>
            <div className="p-5">
              {pointLevels.map((level, index) => (
                <div
                  key={index}
                  className={`flex justify-between py-2 px-2 text-lg ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <p className="font-semibold">{level.levelName}</p>
                  <p>
                    {level.levelMin} - {level.levelMax}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="my-3">
        <RadioGroup defaultValue="0" onChange={setMode}>
          <Stack spacing={5} flexDirection="row" gap={3}>
            <Radio colorScheme="blue" value="0">
              All Time
            </Radio>
            <Radio colorScheme="blue" value="2">
              Month to Date
            </Radio>
            <Radio colorScheme="blue" value="1">
              Quarter to Date
            </Radio>
          </Stack>
        </RadioGroup>
      </div>

      <div className="flex gap-5 w-full my-5">
        <div className="w-1/3 bg-white rounded-lg">
          <p className="text-2xl font-bold text-gray-800 p-5 border-b">
            Joule LeaderBoard - Top 20
          </p>
          <div className="p-5">
            <div className="flex justify-between py-2 px-2 text-lg border-b-2 border-black">
              <p className="font-semibold">User</p>
              <p className="font-semibold">Points</p>
            </div>
            {leaderBoard.map((entry, index) => (
              <div
                key={index}
                className={`flex justify-between py-1 px-2 text-base ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                <Link
                  href={`friend/${entry.userID}`}
                  target="_blank"
                  className="text-primaryText"
                >
                  {entry.fullName}
                </Link>
                <p>{entry.pointAmount}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3 bg-white rounded-lg h-fit">
          <p className="text-2xl font-bold text-gray-800 p-5 border-b">
            Activity-Points Total:{" "}
            {userPoints?.reduce(
              (acc, res) => acc + res.pointTypeModel.pointAmount,
              0
            )}
          </p>
          <div className="p-5">
            <div className="py-2 px-2 text-lg flex font-bold justify-between border-b-2 border-black">
              <p className="w-5/12">Activity</p>
              <p className="w-3/12">Earned On</p>
              <p className="w-2/12">Point Type</p>
              <p className="w-2/12">Points</p>
            </div>
            {currentItems.length > 0 ? (
              <>
                {currentItems.map((point, index) => (
                  <div
                    key={index}
                    className={`flex justify-between py-1 px-2 text-base ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <Link
                      href={`/ride/${point.activityModel.activityID}`}
                      target="_blank"
                      className="text-primaryText w-5/12"
                    >
                      {point.activityModel.activityName}
                    </Link>
                    <p className="w-3/12">
                      {dayjs(point.createdDate).format("MM/DD/YYYY")}
                    </p>
                    <p className="w-2/12">
                      {point.pointTypeModel.pointTypeName}
                    </p>
                    <p className="w-2/12 ps-5">
                      {point.pointTypeModel.pointAmount}
                    </p>
                  </div>
                ))}
                <div className="mt-4">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    previousLabel="< Previous"
                    onPageChange={handlePageClick}
                    pageCount={pageCount}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    pageClassName={"page-item"}
                  />
                </div>
              </>
            ) : (
              <div className="py-2 px-5 bg-primaryGray space-y-6">
                <p className="text-gray-600">
                  Sorry, you have not earned any joules yet. Get out there - add
                  or join a ride today!
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/ride/"
                    className="border w-fit py-2 px-4 rounded-md bg-LinkColor hover:shadow-lg"
                  >
                    Add a Ride!
                  </Link>
                  <Link
                    href="#"
                    className="border w-fit py-2 px-4 rounded-md bg-LinkColor hover:shadow-lg"
                  >
                    Find A Ride
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
