import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useRef } from "react";
import { AiOutlineBarChart, AiOutlineUsergroupAdd } from "react-icons/ai";
import { GrStatusInfo } from "react-icons/gr";
import { MdOutlineModeEditOutline, MdOutlineShare } from "react-icons/md";
import { PiCalendarDots, PiMapPinLight, PiUsersThree } from "react-icons/pi";
import ShareImageModal from "./ShareImageModal";
import InviteFriendModal from "./InviteFriendModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Item } from "@/shared/types/dashboard.types";
import { User } from "@/shared/types/account.types";
import {
    formatRideData,
    hasDatePassed,
    removeTags,
} from "@/shared/util/format.util";
import dayjs from "dayjs";
import { download, googleCal, outLook } from "@/assets";
import utc from "dayjs/plugin/utc";

const SideBar: React.FC<{ id: number; userLogin: any }> = ({
    id,
    userLogin,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isInviteOpen,
        onOpen: OnInviteOpen,
        onClose: OnInviteClose,
    } = useDisclosure();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
    } = useDisclosure();
    const cancelRef = useRef(null);

    const rides = useSelector<RootState>(
        (state) => state.rideDetail.rides
    ) as Item;
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const formatRide = formatRideData(rides);

    const handleCalReminder = (type: string) => {
        dayjs.extend(utc);
        const eventName = formatRide.rideName;
        const eventDescription = formatRide.rideNotes;
        const eventAddress = formatRide.startAddress;

        const activityDateTime = dayjs(formatRide.activityDateTime).format(
            "YYYY-MM-DD"
        );
        const startTime = dayjs
            .utc(`${activityDateTime}T${formatRide.startTime}`)
            .format("YYYYMMDDTHHmmss");
        const endTime = dayjs
            .utc(`${activityDateTime}T${formatRide.endTime}`)
            .format("YYYYMMDDTHHmmss");

   

        switch (type) {
            case "google":
                const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
                    eventName
                )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
                    removeTags(eventDescription) || "Let's ride together"
                )}&location=${encodeURIComponent(eventAddress || "")}`;
                window.open(googleCalendarUrl, "_blank");
                break;

            case "outlook":
                const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(
                    eventName
                )}&body=${encodeURIComponent(
                    removeTags(eventDescription) || "Let's ride together"
                )}&location=${encodeURIComponent(
                    eventAddress || ""
                )}&startdt=${startTime}&enddt=${endTime}`;
                window.open(outlookCalendarUrl, "_blank");
                break;

            case "download":
                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventName}
DESCRIPTION:${removeTags(eventDescription) || "Let's ride together"}
LOCATION:${eventAddress || ""}
DTSTART:${startTime}
DTEND:${endTime}
END:VEVENT
END:VCALENDAR`;
                const blob = new Blob([icsContent], { type: "text/calendar" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${eventName}.ics`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                break;

            default:
                break;
        }
    };

    return (
        <>
            <div className='bg-white min-h-40 border border-neutral-300 rounded-md sticky top-28'>
                <div className='text-gray-700 hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                    <GrStatusInfo />
                    <Link className='font-bold text-lg' href={"#details"}>
                        Details
                    </Link>
                </div>
                {userLogin &&
                    (rides?.userID === user?.id || user?.role === "Admin") && (
                        <div className='text-gray-700 hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                            <MdOutlineModeEditOutline />
                            <Link
                                className='font-bold text-lg'
                                href={`/ride/edit/${rides.activityID}`}>
                                Edit
                            </Link>
                        </div>
                    )}
                {(rides?.userID === user?.id || user?.role === "Admin") && (
                    <div className='text-gray-700 hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
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
                {!dayjs(rides?.activityDate).isBefore(dayjs()) && (
                    <div className='text-gray-700 text-lg hover:text-primaryButton flex gap-3 py-4 px-7 border-b items-center'>
                        <PiCalendarDots />
                        <button
                            onClick={onAlertOpen}
                            className='font-bold text-lg'>
                            Cal Reminder
                        </button>
                    </div>
                )}
                {userLogin && !dayjs(rides?.activityDate).isBefore(dayjs()) && (
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

            <AlertDialog
                motionPreset='slideInBottom'
                onClose={onAlertClose}
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                isCentered>
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>Select Calendar</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <div className='flex gap-4'>
                            <div
                                onClick={() => handleCalReminder("google")}
                                className='w-4/12 border shadow rounded-md hover:shadow-xl cursor-pointer'>
                                <img src={googleCal.src} alt='google' />
                            </div>
                            <div
                                onClick={() => handleCalReminder("outlook")}
                                className='w-4/12 border shadow rounded-md hover:shadow-xl cursor-pointer '>
                                <img src={outLook.src} alt='outlook' />
                            </div>
                            <div
                                onClick={() => handleCalReminder("download")}
                                className='w-4/12 border shadow rounded-md hover:shadow-xl cursor-pointer'>
                                <img src={download.src} alt='download' />
                            </div>
                        </div>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onAlertClose}>
                            Cancel
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SideBar;
