import { RootState } from "@/redux/store/store";
import { LeaderBoardItem } from "@/shared/types/dashboard.types";
import Link from "next/link";
import React from "react";
import { BsLightningCharge } from "react-icons/bs";
import { useSelector } from "react-redux";

const LeaderBoardList = () => {
    const leaderBoard = useSelector<RootState, LeaderBoardItem[]>(
        (state) => state.dashboard.leaderBoard
    );

    return (
        <div className='border border-neutral-300 rounded-md bg-white'>
            <div className='px-4 py-2 border-b'>
                <p className='font-bold'>Joules Leaderboard</p>
                <p className='font-bold text-xs'>
                    59 days left in the quarter!
                </p>
            </div>
            {leaderBoard?.map((data, index) => (
                <div
                    className='px-4 py-2 border-b flex items-center justify-between'
                    key={index}>
                    <Link href={`/friend/${data.userID}`}>
                        <p className='text-base text-primaryText'>
                            {data.fullName}
                        </p>
                    </Link>
                    <p className='font-bold text-xs text-gray-700'>
                        {data.pointAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </p>
                </div>
            ))}
            <div className='px-4 py-2'>
                <p className='text-xs flex items-center gap-1'>
                    <BsLightningCharge className='text-yellow-600' />
                    Get on the leaderboard!
                    <Link href='/points' className='text-primaryText'>
                        Earn points!
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LeaderBoardList;
