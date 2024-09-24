import { FormattedRide } from "@/shared/types/dashboard.types";
import React, { useEffect, useRef, useState } from "react";
import { format, parse, parseISO } from "date-fns";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calculateTime, checkImageLoad } from "@/shared/util/format.util";
import { TbTriangleFilled } from "react-icons/tb";
import { BsExclamationSquareFill } from "react-icons/bs";
import { routePlaceHolder } from "@/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThreads } from "@fortawesome/free-brands-svg-icons/faThreads";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faReddit } from "@fortawesome/free-brands-svg-icons/faReddit";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faUserGroup } from "@fortawesome/pro-light-svg-icons/faUserGroup";
import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faComment } from "@fortawesome/pro-light-svg-icons/faComment";
import { faThumbsUp } from "@fortawesome/pro-light-svg-icons/faThumbsUp";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/pro-solid-svg-icons/faThumbsUp";
import { faCircle } from "@fortawesome/pro-solid-svg-icons/faCircle";
import { faSquare } from "@fortawesome/pro-solid-svg-icons/faSquare";
import { faTriangle } from "@fortawesome/pro-solid-svg-icons/faTriangle";
import { faExclamation } from "@fortawesome/pro-solid-svg-icons/faExclamation";
import { faCalendar } from "@fortawesome/pro-light-svg-icons/faCalendar";
import { faLocationDot } from "@fortawesome/pro-light-svg-icons/faLocationDot";
import { faBicycle } from "@fortawesome/pro-light-svg-icons/faBicycle";
import { faRuler } from "@fortawesome/pro-light-svg-icons/faRuler";
import { faShareNodes } from "@fortawesome/pro-light-svg-icons/faShareNodes";
import { faUser } from "@fortawesome/pro-light-svg-icons/faUser";
import { getDifficultyLevel } from "@/redux/slices/addRideSlice";
import { MY_DOMAIN } from "@/constant/appConfig";

interface RideCardProps {
    data: FormattedRide;
    handleLike?: () => void;
    userData?: any;
    isLike?: boolean;
    showPicture?: boolean;
}
const data=0
export const setDifficultyIcon = (
    iconName: string | any,
    iconColor: string | any
) => {
    switch (iconName) {
        case "Easy":
            return (
                <FontAwesomeIcon
                    icon={faCircle}
                    size='lg'
                    style={{ color: iconColor }}
                />
            );
        case "Moderate":
            return (
                <FontAwesomeIcon
                    icon={faSquare}
                    size='lg'
                    style={{ color: iconColor }}
                />
            );
        case "Difficult":
            return (
                <FontAwesomeIcon
                    icon={faTriangle}
                    size='lg'
                    style={{ color: iconColor }}
                />
            );
        case "Extreme":
            return (
                <FontAwesomeIcon
                    icon={faExclamation}
                    size='lg'
                    style={{ color: iconColor }}
                />
            );
        default:
            return (
                <FontAwesomeIcon
                    icon={faCircle}
                    size='sm'
                    style={{ color: iconColor }}
                />
            );
    }
};

const RideCard: React.FC<RideCardProps> = ({
    data,
    handleLike,
    userData,
    isLike = true,
    showPicture = true,
}) => {
    const [like, setLike] = useState(false);
    const imageUrlRef = useRef<string | null>(null);
        const dispatch = useDispatch<AppDispatch>();

        console.log("Ride Data: ", data);

        useEffect(() => {
            const loadImage = async () => {
                const url = await checkImageLoad(data.mapImage);
                const secondUrl = await checkImageLoad(data.image);
                imageUrlRef.current = secondUrl || url || routePlaceHolder.src;
                
                // Force update the component to apply the new image (if needed)
                // You can call some custom force update logic here if necessary.
            };
    
            loadImage();
        }, [data.mapImage, data.image]);

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
        <div
            style={{
                borderLeft: data.difficultyLevelColor,
                borderLeftWidth: "3px",
                borderLeftStyle: "solid",
                borderTopLeftRadius: "6px",
                borderBottomLeftRadius: "6px",
                borderRightWidth:
                    data.userResponseColor === null ||
                    data.userResponseColor === undefined
                        ? 1
                        : 3,
                borderRightStyle: "solid",
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
                borderRightColor:
                    data.userResponseColor === null ||
                    data.userResponseColor === undefined
                        ? "#d4d4d4" // neutral-300
                        : data.userResponseColor,
            }}
            className={`min-h-52 border border-neutral-300 rounded-md bg-white mb-6`}>
            <div className='border-b px-5 py-3 flex justify-between'>
                <div className='flex flex-col'>
                    <Link
                        href={`/ride/${data.activityID}`}
                        className='text-lg text-primaryText font-bold uppercase'>
                        {data.rideName}
                    </Link>
                    <div>
                        <div
                            className={`text-xs border ${
                                data.isPrivate
                                    ? "bg-red-300 border-red-400"
                                    : "bg-amber-300 border-amber-400"
                            } py-1 px-1.5 rounded-md justify-center items-center w-fit`}>
                            {data.viewStatus}
                        </div>
                    </div>
                </div>
                <Popover placement='bottom-start'>
                    <PopoverTrigger>
                        <div className='bg-secondaryButton cursor-pointer text-white w-8 h-8 flex items-center justify-center p-2 rounded-md'>
                            <FontAwesomeIcon
                                icon={faShareNodes}
                                size='sm'
                                className='text-white'
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent maxW={"220px"}>
                        <PopoverHeader fontWeight='semibold' fontSize={12}>
                            Share this ride!
                        </PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                            <div className='space-y-2'>
                                <Link
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${MY_DOMAIN}/ride/${data.activityID}`}
                                    target='_blank'>
                                    <p className='flex gap-2 items-center hover:text-primaryText mb-2'>
                                        <FontAwesomeIcon
                                            icon={faFacebook}
                                            size='sm'
                                            className='fa-fw text-neutral-500'
                                        />
                                        <span className='text-sm'>
                                            Facebook
                                        </span>
                                    </p>
                                </Link>
                                <Link
                                    href={`https://www.twitter.com/intent/tweet?url=${MY_DOMAIN}/ride/${data.activityID}&text=${data.rideName} via @ChasingWattsApp`}
                                    target='_blank'>
                                    <p className='flex gap-2 items-center hover:text-primaryText mb-2'>
                                        <FontAwesomeIcon
                                            icon={faTwitter}
                                            size='sm'
                                            className='fa-fw text-neutral-500'
                                        />
                                        <span className='text-sm'>Twitter</span>
                                    </p>
                                </Link>
                                <Link
                                    href={`https://www.reddit.com/submit?url=${MY_DOMAIN}/ride/${data.activityID}&title=${data.rideName}`}
                                    target='_blank'>
                                    <p className='flex gap-2 items-center hover:text-primaryText mb-2'>
                                        {" "}
                                        <FontAwesomeIcon
                                            icon={faReddit}
                                            size='sm'
                                            className='fa-fw text-neutral-500'
                                        />
                                        <span className='text-sm'>Reddit</span>
                                    </p>
                                </Link>
                                <Link
                                    href={`https://www.threads.net/intent/post?text=${MY_DOMAIN}/ride/${data.activityID}`}
                                    target='_blank'>
                                    <p className='flex gap-2 items-center hover:text-primaryText'>
                                        <FontAwesomeIcon
                                            icon={faThreads}
                                            size='sm'
                                            className='fa-fw text-neutral-500'
                                        />
                                        <span className='text-sm'>Threads</span>
                                    </p>
                                </Link>
                            </div>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </div>
            <div className='px-5 py-3'>
                <div className='flex items-center gap-1 '>
                    <FontAwesomeIcon
                        icon={faCalendar}
                        size='sm'
                        className='text-gray-500'
                    />
                    <h1 className=' flex text-[15px] font-semibold text-gray-500'>
                        {format(
                            parseISO(data.startDate as any),
                            "EEE, MMM dd, yyyy"
                        )}
                        {" @ "}
                        {format(
                            parse(
                                data.startTime as any,
                                "HH:mm:ss",
                                new Date()
                            ),
                            "hh:mm a"
                        )}
                        {" to "}
                        {format(
                            parse(data.endTime as any, "HH:mm:ss", new Date()),
                            "hh:mm a"
                        )}
                    </h1>
                </div>
                <div className='flex items-center gap-1 '>
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        size='sm'
                        className='text-gray-500'
                    />
                    <Link
                        href={`http://maps.google.com/maps?daddr=${data?.startLat},${data?.startLng}`}
                        target='_blank'
                        className=' flex text-base text-[15px] text-primaryText'>
                        {data.startAddress}
                    </Link>
                </div>
                <hr className='my-2' />
                <div className='flex flex-row items-center justify-between me-6'>
                    <div className=''>
                        <div className='text-xs text-neutral-500'>
                            Ride Type
                        </div>
                        <span className='text-base font-medium text-neutral-600'>
                            {data.rideType}
                        </span>
                    </div>
                    <div className=''>
                        <div className='text-xs text-neutral-500'>Distance</div>
                        <span className='text-base font-medium text-neutral-600'>
                            {data.distance} miles
                        </span>
                    </div>
                    <div className=''>
                        <div className='text-xs text-neutral-500'>Leader</div>
                        <span className='text-base font-medium text-neutral-600'>
                            {data.isCommunity
                                ? "Community"
                                : data.rideCreateFirstName +
                                  " " +
                                  data.rideCreateLastName}
                        </span>
                    </div>
                    {/* <div className='flex-row'>
                        <FontAwesomeIcon
                            icon={faBicycle}
                            size='sm'
                            className='text-gray-500'
                        />
                        <span className='ml-2 text-sm'>{data.rideType}</span>
                    </div>
                    <div className='flex-row'>
                        <FontAwesomeIcon
                            icon={faRuler}
                            size='sm'
                            className='text-gray-500'
                        />
                        <span className='ml-2 text-sm'>
                            {data.distance} miles
                        </span>
                    </div> 
                    <div className='flex-row'>
                        <FontAwesomeIcon
                            icon={faUser}
                            size='sm'
                            className='text-gray-500'
                        />
                        <span className='ml-2 text-sm'>
                            {data.isCommunity
                                ? "Community"
                                : data.rideCreateFirstName +
                                  " " +
                                  data.rideCreateLastName}
                        </span>
                    </div>*/}
                </div>
                <hr className='my-2' />
                <div className='flex items-center gap-1 '>
                    <div className='text-sm'>
                        {setDifficultyIcon(
                            data.difficultyLevelName,
                            data.difficultyLevelColor
                        )}
                    </div>
                    <h1 className=' flex gap-1 text-base text-[15px] text-gray-600'>
                        {data.difficultyLevelName} {" @ "}
                        <span className=''>{data.speed} mph </span>
                        <span className='ps-1 border-s'>
                            {calculateTime(data.distance, data.speed)}{" "}
                        </span>
                    </h1>
                </div>
            </div>
            {showPicture && (
                <div className='px-5 py-3 rounded-md overflow-hidden border-b'>
                    <img
                        className='rounded-md aspect-video object-cover'
                        src={imageUrlRef.current||""}
                        alt='map image'
                    />
                </div>
            )}
            <div className='px-5 py-3 flex gap-x-4'>
                <Link
                    href={`/ride/${data.activityID}#roster`}
                    className='flex justify-center items-center gap-2 border px-3 py-1 w-full rounded-md text-sm font-bold'>
                    <FontAwesomeIcon
                        icon={faUserGroup}
                        size='sm'
                        className='text-slate-500'
                    />{" "}
                    {data.rosterCount}
                </Link>
                <Link
                    href={`/ride/${data.activityID}`}
                    className='flex justify-center items-center gap-2 border px-3 py-1 w-full rounded-md text-sm font-bold'>
                    <FontAwesomeIcon
                        icon={faEye}
                        size='sm'
                        className='text-slate-500'
                    />{" "}
                    {data.viewCount}
                </Link>
                <Link
                    href={`/ride/${data.activityID}#chat`}
                    className='flex justify-center items-center gap-2 border px-3 py-1 w-full rounded-md text-sm font-bold'>
                    <FontAwesomeIcon
                        icon={faComment}
                        size='sm'
                        className='text-slate-500'
                    />{" "}
                    {data.chatCount}
                </Link>
                {isLike && (
                    <button
                        disabled={data?.userHasLiked || like}
                        onClick={handelLike}
                        className={`flex justify-center items-center gap-2 border px-3 py-1 w-full rounded-md text-sm font-bold `}>
                        <FontAwesomeIcon
                            icon={
                                data?.userHasLiked
                                    ? faThumbsUpSolid
                                    : faThumbsUp
                            }
                            size='sm'
                            className={`${
                                data?.userHasLiked
                                    ? "text-red-600"
                                    : "text-slate-500"
                            }`}
                        />{" "}
                        {data.likeCount}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RideCard;
