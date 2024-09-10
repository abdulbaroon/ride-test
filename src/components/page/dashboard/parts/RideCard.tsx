import { FormattedRide } from "@/shared/types/dashboard.types";
import {
  IoCalendarOutline,
  IoEyeOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { TfiPin } from "react-icons/tfi";
import { format, parse, parseISO } from "date-fns";
import { LiaRoadSolid, LiaTachometerAltSolid } from "react-icons/lia";
import { LuUsers } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import {
  FaCircle,
  FaFacebookSquare,
  FaRedditSquare,
  FaRegComment,
  FaSquare,
  FaTwitterSquare,
} from "react-icons/fa";
import { GoThumbsup } from "react-icons/go";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { postLike } from "@/redux/slices/dashboardSlice";
import { User } from "@/shared/types/account.types";
import { toast } from "react-toastify";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FaSquareInstagram } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calculateTime, checkImageLoad } from "@/shared/util/format.util";
import { TbTriangleFilled } from "react-icons/tb";
import { BsExclamationSquareFill } from "react-icons/bs";
import { routePlaceHolder } from "@/assets";

interface RideCardProps {
  data: FormattedRide;
  handleLike?: () => void;
  userData?: any;
  isLike?: boolean;
}

export const setDifficultyIcon = (iconName: string | any, iconColor: string | any) => {
  switch (iconName) {
    case 'Easy':
      return (
        <FaCircle
        style={{color:iconColor}}
        />
      )
    case 'Moderate':
      return (
        <FaSquare
        style={{color:iconColor}}
        />
      )
    case 'Difficult':
      return (
        <TbTriangleFilled
        style={{color:iconColor}}
        />
      )
    case 'Extreme':
      return (
        <BsExclamationSquareFill
        style={{color:iconColor}}
        />
      )
    default:
      return (
        <FaCircle
        style={{color:iconColor}}
        />
      )
  }
}


const RideCard: React.FC<RideCardProps> = ({
  data,
  handleLike,
  userData,
  isLike = true,
}) => {
  const [like, setLike] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | any>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadImage = async () => {
      const url = await checkImageLoad(data.mapImage);
      const secondUrl = await checkImageLoad(data.image);
      setImageUrl( secondUrl || url || routePlaceHolder.src);
    };

    loadImage();
  }, [data.mapImage]);

  const handelLike = async () => {
    const payload = {
      activityID: data?.activityID,
      createdBy: userData.id,
      createdDate: new Date(),
    };
    setLike(true);
    const response = await dispatch(postLike(payload));
    setLike(false);
    if (postLike.fulfilled.match(response)) {
      setLike(true);
      await handleLike?.();
      setLike(false);
      toast.success("Thanks for the support.");
    }
  };
  return (
    <div className="min-h-52 border rounded-lg shadow-lg bg-white mb-6">
      <div className="border-b px-5 py-3 flex justify-between">
        <div>
          <Link
            href={`/ride/${data.activityID}`}
            className="text-2xl text-primaryText font-bold capitalize"
          >
            {data.rideName}
          </Link>
          <p className="text-sm leading-3 font-bold ps-1 italic ">
            Public Ride
          </p>
        </div>
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <div className="bg-secondaryButton cursor-pointer text-white h-fit w-fit p-2 rounded-md">
              <IoShareSocialOutline />
            </div>
          </PopoverTrigger>
          <PopoverContent maxW={"220px"}>
            <PopoverHeader fontWeight="semibold">
              Share this ride!
            </PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <div className="space-y-2">
                <Link href={"#"}>
                  <p className="flex gap-2 items-center hover:text-primaryText">
                    <FaFacebookSquare />
                    Facebook
                  </p>
                </Link>
                <Link href={"#"}>
                  <p className="flex gap-2 items-center hover:text-primaryText">
                    <FaTwitterSquare />
                    Twitter
                  </p>
                </Link>
                <Link href={"#"}>
                  <p className="flex gap-2 items-center hover:text-primaryText">
                    {" "}
                    <FaRedditSquare />
                    Reddit
                  </p>
                </Link>
                <Link href={"#"}>
                  <p className="flex gap-2 items-center hover:text-primaryText">
                    <FaSquareInstagram />
                    Instagram
                  </p>
                </Link>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
      <div className="px-5 py-3">
        <div className="flex items-center gap-1 ">
          <IoCalendarOutline className="text-gray-500" />
          <h1 className=" flex text-[15px] font-semibold text-gray-500">
            {format(parseISO(data.startDate as any), "EEE, MMM dd, yyyy")}
            {" @ "}
            {format(
              parse(data.startTime as any, "HH:mm:ss", new Date()),
              "hh:mm a"
            )}
            {" to "}
            {format(
              parse(data.endTime as any, "HH:mm:ss", new Date()),
              "hh:mm a"
            )}
          </h1>
        </div>
        <div className="flex items-center gap-1 ">
          <TfiPin className="text-gray-500 " />
          <Link
            href={`http://maps.google.com/maps?daddr=${data?.startLat},${data?.startLng}`}
            target="_blank"
            className=" flex text-base text-[15px] text-primaryText"
          >
            {data.startAddress}
          </Link>
        </div>
        <div className="flex items-center gap-1 ">
          <LiaTachometerAltSolid className="text-gray-500 " />
          <h1 className=" flex text-base text-[15px] text-gray-600">
            {data.rideType} for{" "}
            <span className="font-bold ps-1">{data.distance} miles</span>
          </h1>
        </div>
        <div className="flex items-center gap-1 ">
          <div className="text-sm">
          {setDifficultyIcon(data.difficultyLevelName,data.difficultyLevelColor)}
          </div>
          <h1 className=" flex gap-1 text-base text-[15px] text-gray-600">
            {data.difficultyLevelName} {" @ "}
            <span className="">{data.speed} mph </span>
            <span className="ps-1 border-s">{calculateTime(data.distance,data.speed)} </span>
          </h1>
        </div>
        <div className="flex items-center gap-1 ">
          <LiaRoadSolid className="text-gray-500 " />
          <h1 className=" flex text-base text-[15px] text-gray-600">
            Great Road
          </h1>
        </div>
        <div className="flex items-center gap-1 ">
          <LuUsers className="text-gray-500 " />
          <h1 className=" flex text-base text-[15px] text-gray-600">
            Community ride
          </h1>
        </div>
      </div>
      <div className="px-5 py-3 rounded-lg overflow-hidden border-b">
        <img className="w-full max-h-8/12" src={imageUrl} alt="map image" />
      </div>
      <div className="px-5 py-3 flex gap-x-4 text-gray-600">
        <Link
          href={`/ride/${data.activityID}#roster`}
          className="flex justify-center items-center gap-1 border  px-3 py-1 w-full rounded-md"
        >
          <PiUsersThree /> {data.rosterCount}
        </Link>
        <Link
          href={`/ride/${data.activityID}`}
          className="flex justify-center items-center gap-1 border  px-3 py-1 w-full rounded-md"
        >
          <IoEyeOutline /> {data.viewCount}
        </Link>
        <Link
          href={`/ride/${data.activityID}#chat`}
          className="flex justify-center items-center gap-1 border  px-3 py-1 w-full rounded-md"
        >
          <FaRegComment /> {data.chatCount}
        </Link>
        {isLike && (
          <button
            disabled={data?.userHasLiked || like}
            onClick={handelLike}
            className={`flex justify-center items-center gap-1 border  px-3 py-1 w-full rounded-md `}
          >
            <GoThumbsup className={`${data?.userHasLiked && "text-red-600"}`} />{" "}
            {data.likeCount}
          </button>
        )}
      </div>
    </div>
  );
};

export default RideCard;
