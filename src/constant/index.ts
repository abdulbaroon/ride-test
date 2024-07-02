import { BsFillTriangleFill, BsLightningCharge } from 'react-icons/bs';
import { CiSquareAlert } from 'react-icons/ci';
import { FaArrowDownUpAcrossLine } from 'react-icons/fa6';
import { GrMapLocation } from 'react-icons/gr';
import { IoKeyOutline } from 'react-icons/io5';
import { LuBadge } from 'react-icons/lu';
import { MdLogout } from 'react-icons/md';
import { PiPersonSimpleBikeLight } from 'react-icons/pi';
import { RiDeleteBinLine, RiTeamLine } from 'react-icons/ri';
export const profileData=[
    {
        name:"My Ride Profile",
        icon: PiPersonSimpleBikeLight
    },
    {
        name:"My Teams",
        icon: RiTeamLine
    },
    {
        name:"My Joules",
        icon: BsLightningCharge
    },

    {
        name:"Ride w GPS Connect",
        icon: GrMapLocation
    },

    {
        name:"Strava Connect",
        icon: FaArrowDownUpAcrossLine
    },

    {
        name:"Garmin Connect",
        icon: BsFillTriangleFill
    },

    {
        name:"Manage Notifications",
        icon: CiSquareAlert
    },
    
    {
        name:"Badge Board",
        icon: LuBadge
    },

    {
        name:"Reset Password",
        icon: IoKeyOutline
    },

    {
        name:"Delete Account",
        icon: RiDeleteBinLine
    },
    
    {
        name:"Sign Out",
        icon: MdLogout
    },
]