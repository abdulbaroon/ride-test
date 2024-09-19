import { useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { AiOutlineBarChart, AiOutlineUsergroupAdd } from "react-icons/ai";
import { GrStatusInfo } from "react-icons/gr";
import {
    MdOutlineContentCopy,
    MdOutlineModeEditOutline,
    MdOutlineShare,
} from "react-icons/md";
import { PiCalendarDots, PiMapPinLight, PiUsersThree } from "react-icons/pi";
import ShareImageModal from "./ShareImageModal";
import InviteFriendModal from "./InviteFriendModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Item } from "@/shared/types/dashboard.types";
import { User } from "@/shared/types/account.types";

const SideBar: React.FC<{ id: number }> = ({ id }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isInviteOpen,
        onOpen: OnInviteOpen,
        onClose: OnInviteClose,
    } = useDisclosure();
    const rides = useSelector<RootState>(
        (state) => state.rideDetail.rides
    ) as Item;
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    {
    }
    return (
        <div className='bg-white min-h-40 border border-neutral-300 rounded-md sticky top-28'>
            <div className='text-gray-700  hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                <GrStatusInfo />
                <Link className='font-bold text-lg' href={"#details"}>
                    Details
                </Link>
            </div>
            {(rides?.userID === user?.id || user?.role === "Admin") && (
                <div className='text-gray-700  hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                    <MdOutlineModeEditOutline />
                    <Link
                        className='font-bold text-lg'
                        href={`/ride/edit/${rides.activityID}`}>
                        Edit
                    </Link>
                </div>
            )}
            {(rides?.userID === user?.id || user?.role === "Admin") && (
                <div className='text-gray-700  hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                    <AiOutlineBarChart />
                    <Link
                        className='font-bold text-lg'
                        href={`/ridelog/${rides.activityID}`}>
                        Ride Log
                    </Link>
                </div>
            )}
            <div className='text-gray-700 text-lg hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                <PiMapPinLight />
                <Link className='font-bold text-lg' href={"#map"}>
                    Maps
                </Link>
            </div>
            <div className='text-gray-700 text-lg hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                <PiUsersThree />
                <Link className='font-bold text-lg' href={"#roster"}>
                    Roster
                </Link>
            </div>
            {/* <div className='text-gray-700 text-lg hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
            <MdOutlineContentCopy />
            <Link className='font-bold text-lg' href={"#"}>Copy Ride</Link>
         </div> */}
            {/* <div className='text-gray-700 text-lg hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
        <PiCalendarDots/>
        <Link className='font-bold text-lg' href={"#"}>Cal Reminder</Link>
     </div> */}
            {user?.id !== null && (
                <div className='text-gray-700 text-lg hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                    <AiOutlineUsergroupAdd />
                    <button
                        onClick={OnInviteOpen}
                        className='font-bold text-lg'>
                        Invite Friends
                    </button>
                </div>
            )}
            {rides?.activityRouteModel?.[0]?.mapSourceID !== 4 && (
                <div className='text-gray-700 text-lg hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                    <MdOutlineShare />
                    <button className='font-bold text-lg' onClick={onOpen}>
                        Share Image
                    </button>
                </div>
            )}
            <ShareImageModal isOpen={isOpen} onClose={onClose} id={id} />
            <InviteFriendModal
                isOpen={isInviteOpen}
                onClose={OnInviteClose}
                userId={id}
            />
        </div>
    );
};

export default SideBar;
