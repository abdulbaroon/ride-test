import { IMAGE_URl } from "@/constant/appConfig";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { BsLightningCharge, BsLightningChargeFill } from "react-icons/bs";
import { GiPathDistance } from "react-icons/gi";
import { HiOutlineHome } from "react-icons/hi";
import { IoMdCalendar } from "react-icons/io";
import { MdOutlineShareLocation } from "react-icons/md";
import { PiPersonSimpleBike } from "react-icons/pi";

interface UserProfileProps {
    name: string;
    username: string;
    level: string;
    location: string;
    radius: string;
    ridesJoined: number;
    distance: number;
    joules: number;
    joinedDate: string;
    userID: number;
    modifiedDate: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
    userID,
    modifiedDate,
    name,
    username,
    level,
    location,
    radius,
    ridesJoined,
    distance,
    joules,
    joinedDate,
}) => (
    <div className=' w-full rounded-md border border-neutral-300 h-fit bg-white gap-3 overflow-hidden'>
        <div className='border-b px-4 py-3 flex items-center gap-2 bg-gray-200'>
            <div className='relative w-12 h-12 border overflow-hidden bg-gray-100 rounded-full'>
                <Avatar
                    borderWidth='1px'
                    name={`${name} `}
                    size='md'
                    src={`${IMAGE_URl}/useravatar/pfimg_${userID}.png?lastmod=${modifiedDate}`}
                />
            </div>
            <div>
                <p className='text-primaryButton font-semibold'>{name}</p>
                <p className='text-sm font-semibold leading-3'>{username}</p>
            </div>
        </div>
        <UserProfileItem
            icon={<BsLightningChargeFill className='text-darkred text-xl' />}
            label='Level'
            value={level}
            link={`/friend/${userID}`}
            className='text-primaryButton'
        />
        <UserProfileItem
            icon={<HiOutlineHome className='text-xl' />}
            label='Home'
            value={location}
        />
        <UserProfileItem
            icon={<MdOutlineShareLocation className='text-xl' />}
            label='Radius'
            value={radius}
        />
        <UserProfileItem
            icon={<PiPersonSimpleBike className='text-xl' />}
            label='Rides Joined'
            value={ridesJoined.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })}
        />
        <UserProfileItem
            icon={<GiPathDistance className='text-xl' />}
            label='Distance'
            value={distance.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })}
        />
        <UserProfileItem
            icon={<BsLightningCharge className='text-xl' />}
            label='Joules'
            value={joules.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })}
            link='/points'
            className='text-primaryButton'
        />
        <UserProfileItem
            icon={<IoMdCalendar className='text-xl' />}
            label='Joined'
            value={joinedDate}
        />
    </div>
);

interface UserProfileItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    link?: string;
    className?: string;
}

const UserProfileItem: React.FC<UserProfileItemProps> = ({
    icon,
    label,
    value,
    link,
    className = "",
}) => (
    <div className={`border-b px-4 py-3 flex justify-between `}>
        <div className='flex items-center gap-5'>
            {icon}
            {link ? (
                <Link href={link} className={`font-medium ${className}`}>
                    {label}
                </Link>
            ) : (
                <p>{label}</p>
            )}
        </div>
        {link ? (
            <Link href={link} className={`font-medium ${className}`}>
                {value}
            </Link>
        ) : (
            <p className={`font-medium ${className}`}>{value}</p>
        )}
    </div>
);

export default UserProfile;
