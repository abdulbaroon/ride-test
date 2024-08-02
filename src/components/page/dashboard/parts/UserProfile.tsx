import React from 'react';
import { BsLightningCharge, BsLightningChargeFill } from 'react-icons/bs';
import { GiPathDistance } from 'react-icons/gi';
import { HiOutlineHome } from 'react-icons/hi';
import { IoMdCalendar } from 'react-icons/io';
import { MdOutlineShareLocation } from 'react-icons/md';
import { PiPersonSimpleBike } from 'react-icons/pi';

interface UserProfileProps {
  name: string;
  username: string;
  level: string;
  location: string;
  radius: string;
  ridesJoined: number;
  distance: number;
  joules: string;
  joinedDate: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, username, level, location, radius, ridesJoined, distance, joules, joinedDate }) => (
  <div className="w-[25%] shadow-lg rounded-lg h-fit bg-white gap-3 overflow-hidden border">
    <div className="border-b px-4 py-3 flex items-center gap-2 bg-gray-200">
      <div className="relative w-12 h-12 border overflow-hidden bg-gray-100 rounded-full">
        <svg className="absolute w-14 h-14 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div>
        <p className="text-primaryButton font-semibold">{name}</p>
        <p className="text-sm font-semibold leading-3">{username}</p>
      </div>
    </div>
    <UserProfileItem icon={<BsLightningChargeFill className="text-darkred text-xl" />} label="Level" value={level} />
    <UserProfileItem icon={<HiOutlineHome className="text-xl" />} label="Home" value={location} />
    <UserProfileItem icon={<MdOutlineShareLocation className="text-xl" />} label="Radius" value={radius} />
    <UserProfileItem icon={<PiPersonSimpleBike className="text-xl" />} label="Rides Joined" value={ridesJoined} />
    <UserProfileItem icon={<GiPathDistance className="text-xl" />} label="Distance" value={distance} />
    <UserProfileItem icon={<BsLightningCharge className="text-xl" />} label="Joules" value={joules} className="text-primaryButton" />
    <UserProfileItem icon={<IoMdCalendar className="text-xl" />} label="Joined" value={joinedDate} />
  </div>
);

interface UserProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const UserProfileItem: React.FC<UserProfileItemProps> = ({ icon, label, value, className = "" }) => (
  <div className={`border-b px-4 py-3 flex justify-between ${className}`}>
    <div className="flex items-center gap-5">
      {icon}
      <p>{label}</p>
    </div>
    <p className={`font-medium ${className}`}>{value}</p>
  </div>
);

export default UserProfile;
