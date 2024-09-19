"use client";
import { IMAGE_URl } from "@/constant/appConfig";
import { getFriends } from "@/redux/slices/profileSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { UserFollowingData } from "@/shared/types/rideDetail.types";
import { Avatar, Badge } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { myFriend } from "@/assets";

export const MyFriends = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const friendsList = useSelector<RootState, UserFollowingData[]>(
        (state) => state.profile.friendList
    );

    useEffect(() => {
        if (user?.id) {
            dispatch(getFriends(user?.id));
        }
    }, [user]);

    const filteredFriends = friendsList.filter((friend) =>
        `${friend.userProfileModelFollowing.firstName} ${friend.userProfileModelFollowing.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );
    //console.log(filteredFriends, "===>df");
    return (
        <div className='w-11/12 mt-28 mx-auto !max-w-[1320px]'>
            <div className='pt-1'>
                <h1 className='text-gray-500 flex gap-1 items-center'>
                    <Link href='/dashboard'>
                        <HiOutlineHome />
                    </Link>
                    <IoIosArrowForward />
                    <p className='text-primaryText'>My Friends</p>
                </h1>
            </div>
            <div className='bg-white border border-neutral-300 min-h-full px-7 py-4 rounded-md mt-3'>
                <h1 className=' text-2xl font-bold text-gray-700'>
                    My Friends
                </h1>
                <div className='relative mt-3'>
                    <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                        <svg
                            className='w-5 h-5 text-gray-500'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 20 20'>
                            <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                            />
                        </svg>
                    </div>
                    <input
                        type='search'
                        id='default-search'
                        className='block outline-none w-2/5 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='Search friends'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button> */}
                </div>
                {filteredFriends?.length > 0 ? (
                    <div>
                        <div className='mt-3'>
                            <p>
                                😎 You have{" "}
                                {filteredFriends.length === 1
                                    ? "one friend "
                                    : filteredFriends.length}{" "}
                                friends. Create a ride and invite them!
                            </p>
                        </div>
                        <div className='grid grid-cols-4 gap-2 mt-2'>
                            {filteredFriends?.map((data, i) => {
                                return (
                                    <Link
                                        href={`/friend/${data.userProfileModelFollowing.userID}`}
                                        key={i}>
                                        <motion.div
                                            // initial={{ scale: 1 }}
                                            // whileHover={{ scale: 1.02 }}
                                            className='bg-[#f4f5f9] border border-neutral-300 m-1 flex px-4 py-6 rounded-md gap-3 hover:border hover:border-white'>
                                            <Avatar
                                                borderWidth='0px'
                                                borderColor='gray.600'
                                                name={`${data?.userProfileModelFollowing.firstName} ${data.userProfileModelFollowing.lastName}`}
                                                size='lg'
                                                src={`${IMAGE_URl}/useravatar/pfimg_${data.userProfileModelFollowing.userID}.png?lastmod=${data.userProfileModel.createdBy}`}
                                            />
                                            <div>
                                                <h1 className='text-sm text-gray-700 font-bold'>
                                                    {
                                                        data
                                                            .userProfileModelFollowing
                                                            .firstName
                                                    }{" "}
                                                    {
                                                        data
                                                            .userProfileModelFollowing
                                                            .lastName
                                                    }
                                                </h1>
                                                <p className='text-sm text-gray-600'>
                                                    {
                                                        data
                                                            .userProfileModelFollowing
                                                            .homeBaseCity
                                                    }
                                                    ,{" "}
                                                    {
                                                        data
                                                            .userProfileModelFollowing
                                                            .homeBaseState
                                                    }
                                                </p>
                                                <div className='mt-2'>
                                                    {data.isConfirmed ? (
                                                        <Badge colorScheme='green'>
                                                            Confirmed
                                                        </Badge>
                                                    ) : (
                                                        <Badge colorScheme='yellow'>
                                                            Requested
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center text-lg mb-28 text-primaryButton'>
                        <img className='w-52' src={myFriend.src} alt='' />
                        <p>
                            You do not have any other friends! Find some folks
                            and get connected!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
