import { addDays, setHours } from 'date-fns';
import { AiOutlineShop } from 'react-icons/ai';
import { BsFillTriangleFill, BsLightningCharge } from 'react-icons/bs';
import { CiCalendar, CiSquareAlert } from 'react-icons/ci';
import { FaApple, FaRegMap } from 'react-icons/fa';
import { FaArrowDownUpAcrossLine } from 'react-icons/fa6';
import { FiFileText, FiLock, FiShare2 } from 'react-icons/fi';
import { GiPathDistance } from 'react-icons/gi';
import { GoPeople } from 'react-icons/go';
import { GrMapLocation } from 'react-icons/gr';
import { IoIosPeople } from 'react-icons/io';
import { IoChatbubbleOutline, IoEarthSharp, IoKeyOutline } from 'react-icons/io5';
import { LuBadge, LuBellRing } from 'react-icons/lu';
import { MdLogout } from 'react-icons/md';
import { PiPersonSimpleBikeLight } from 'react-icons/pi';
import { RiDeleteBinLine, RiTeamLine } from 'react-icons/ri';
import { TbSettingsBolt, TbSettingsPin } from 'react-icons/tb';

export const profileData = [
    {
        name: "My Ride Profile",
        icon: PiPersonSimpleBikeLight
    },
    {
        name: "My Teams",
        icon: RiTeamLine
    },
    {
        name: "My Joules",
        icon: BsLightningCharge
    },

    {
        name: "Ride w GPS Connect",
        icon: GrMapLocation
    },

    {
        name: "Strava Connect",
        icon: FaArrowDownUpAcrossLine
    },

    {
        name: "Garmin Connect",
        icon: BsFillTriangleFill
    },

    {
        name: "Manage Notifications",
        icon: CiSquareAlert
    },

    {
        name: "Badge Board",
        icon: LuBadge
    },

    {
        name: "Reset Password",
        icon: IoKeyOutline
    },

    {
        name: "Delete Account",
        icon: RiDeleteBinLine
    },

    {
        name: "Sign Out",
        icon: MdLogout
    },
]

export const toolbarModule = {
    toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] }
        ],
        [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
};

export const formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size",
];

export const homeRideDataLeft = [{
    title: "Ride Details",
    desc: "Know all the details to have a safe & fun ride. Date/Time, Start/Stop locations, Speed, Weather. All information syncs between web and mobile app instantly!",
    icons: FiFileText
}, {
    title: "Ride Roster",
    desc: "Curious to know who's going to show up? Easily see who you will be riding with. Know who's a yes, no or maybe.",
    icons: GoPeople
}, {
    title: "Geotargeted",
    desc: "See the rides in the area you define. Also control the distance radius of that area - see a few or a lot of rides.",
    icons: IoEarthSharp
},
]
export const homeRideDataRight = [{
    title: "Ride Route",
    desc: "Where are we going? Be prepared and know the route before you ride - the terrain, elevation and rest stops. Easily download the route to your cycling computer.",
    icons: FaRegMap
}, {
    title: "Ride Chat",
    desc: "Have a question or suggestion? Quickly and easily post a message to the ride group directly. Stay up-to-date with instant notifications.",
    icons: IoChatbubbleOutline
}, {
    title: "Ride Weather",
    desc: "Knowing what to wear on a ride can be one of the hardest decisions to make. Not anymore.",
    icons: TbSettingsBolt
},
]

export const steps = [
    {
        number: '01',
        title: 'Create an account',
        description: 'Quickly create a free account with just an email.',
    },
    {
        number: '02',
        title: 'Create/Find a ride',
        description: 'Create or find a ride in your local area in under one minute.',
    },
    {
        number: '03',
        title: 'Join a ride',
        description: 'Like a ride you see - join the roster and know all the details!',
    },
    {
        number: '04',
        title: 'Ride & have FUN!',
        description: 'Get ready to have some fun on two wheels!',
    },
];

export const featureCard = [
    {
        color: "#115674",
        icon: GiPathDistance,
        title: "The Route",
        desc: "Always great to know where you are riding! With Chasing Watts, know the exact route, elevation and sync the route to your cycling computer so you know what to expect and where to turn."
    },
    {
        color: "#fdbc31",
        icon: IoChatbubbleOutline,
        title: 'Easy Communication',
        desc: "Don't worry about using social media, text or emails. Communicate openly with the other cyclists on the roster. Stay up to date with what's happening on the ride!"
    },
    {
        color: "#f23c49",
        icon: IoIosPeople,
        title: "The Roster",
        desc: "Looking for a friend or know how many folks you'll be riding with. Stay in tune with who's riding, on the fence or just can't make it."
    },
    {
        color: "#07c98b",
        icon: AiOutlineShop,
        title: "Shops & Teams",
        desc: "Run a LBS or manage a team? Let us help take the pain out of coordinating your rides! One spot for team members and the associated rides."
    },
    {
        color: "#115674",
        icon: CiCalendar,
        title: "The Calendar",
        desc: "Easy view calendar of all your local rides - color coded by ride type. Look at day, week, month or agenda view all at a glance."
    },
    {
        color: "#fdbc31",
        icon: LuBellRing,
        title: 'Instant Notifications',
        desc: "Stay up to date with your ride udpates, roster or chat - instantly. Get instant notifications through email or in-application notifications!"
    },
    {
        color: "#f23c49",
        icon: FiLock,
        title: "Private Rides",
        desc: "Need to keep your ride private and invite only? Invite those who you want to be on the ride."
    },
    {
        color: "#07c98b",
        icon: FiShare2,
        title: "Share the ride",
        desc: "Manage your ride from ONE place - share to your social networks and friends to easily get the word out about your rides."
    },
    {
        color: "#115674",
        icon: FaApple,
        title: "Native Mobile Apps",
        desc: "With both Android and iOS mobile apps, Chasing Watts is everywhere you are! Add, find and join rides right from your phone. So easy."
    }
]







const currentYear = new Date().getFullYear();
export const displayDate = new Date(Date.UTC(currentYear, 5, 24));


