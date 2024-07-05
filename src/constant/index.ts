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