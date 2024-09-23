"use client";
import { navLogo } from "@/assets";
import { getProfile, refreshToken, userEmail } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User, UserProfileData } from "@/shared/types/account.types";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import { Avatar, useDisclosure } from "@chakra-ui/react";
import { IMAGE_URl } from "@/constant/appConfig";
import {
    getAllNotification,
    getNotifications,
} from "@/redux/slices/notificationSlice";
import NotificationBar from "./NotificationBar";
import {
    getActivityTag,
    getActivityType,
    getDifficultyLevel,
} from "@/redux/slices/addRideSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<string>();
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector<RootState>((state) => state.auth.user) as User;
    const token = useSelector<RootState>((state) => state.auth.token);
    const notification = useSelector<RootState, any>(
        (state) => state.notification.notifications
    );

    const profile = useSelector<RootState>(
        (state) => state.auth.profileData
    ) as UserProfileData;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: notifIsOpen,
        onOpen: notifOnOpen,
        onClose: notifOnClose,
    } = useDisclosure();

    const [dropdown, setDropdown] = useState(false);

    useEffect(() => {
        const userCookie = getCookie("user");
        if (userCookie) {
            setUser(userCookie);
        } else {
            setUser("");
            localStorage.removeItem("persist:root");
        }
    }, [userData, token]);

    useEffect(() => {
        if (userData?.id) {
            dispatch(getProfile(userData.id));
            dispatch(userEmail(userData.id));
            fetchNotifications();
            dispatch(getDifficultyLevel());
            dispatch(getActivityType());
            dispatch(getActivityTag());
        }
    }, [userData]);

    const fetchNotifications = () => {
        if (userData.id) {
            dispatch(
                getNotifications({
                    id: userData.id,
                    isRead: false,
                    limit: 20,
                })
            );
            dispatch(
                getAllNotification({
                    id: userData.id,
                    limit: 20,
                })
            );
        }
    };

    return (
        <header className=' bg-secondaryButton fixed top-0 w-full z-50'>
            <div className='w-11/12 mx-auto py-4 flex justify-between !max-w-[1320px]'>
                <div className='flex items-center '>
                    <div className=''>
                        <Link href={"/"}>
                            <img src={navLogo.src} alt='logo' />
                        </Link>
                    </div>
                    <div className='ms-6 '>
                        <div className='text-white font-semibold hidden tablet:flex gap-5 py-4 cursor-pointer'>
                            {user ? (
                                <Link
                                    href={"/dashboard"}
                                    className=' hover:text-gray-400 '>
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={"/account/register"}
                                    className='border-r pe-4 hover:text-gray-400 '>
                                    Register
                                </Link>
                            )}
                            {user ? (
                                <Link
                                    href={"/ride/add"}
                                    className='hover:text-gray-400'>
                                    Add Ride
                                </Link>
                            ) : (
                                <Link
                                    href={"/features"}
                                    className='hover:text-gray-400'>
                                    Features
                                </Link>
                            )}
                            <Link
                                href={"/search"}
                                className='hover:text-gray-400'>
                                Search
                            </Link>
                            {user && (
                                <Link
                                    href={"/calendar"}
                                    className='hover:text-gray-400'>
                                    Calendar
                                </Link>
                            )}
                            {user && (
                                <Link
                                    href={"/explore"}
                                    className='hover:text-gray-400'>
                                    Explore
                                </Link>
                            )}
                            {user && (
                                <Link
                                    href={"/hubs"}
                                    className='hover:text-gray-400'>
                                    Hubs
                                </Link>
                            )}
                            <div
                                onMouseEnter={() => setDropdown(true)}
                                onMouseLeave={() => setDropdown(false)}
                                className='dropdown'>
                                <Link
                                    href={"/about"}
                                    className='hover:text-gray-400'>
                                    About Us
                                </Link>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    size='sm'
                                    className='text-white ml-1'
                                />
                                {dropdown && (
                                    <div className='dropdown-menu'>
                                        <div>
                                            <Link href='/about'>About Us</Link>
                                        </div>
                                        <div>
                                            <Link href='/contactus'>
                                                Contact Us
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href='https://help.chasingwatts.com'>
                                                Help
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    {user ? (
                        <>
                            <div
                                onClick={notifOnOpen}
                                className='cursor-pointer relative'>
                                <FaBell className='text-xl text-white' />
                                {notification?.length > 0 && (
                                    <div className='w-4 h-4 flex justify-center items-center text-white text-xs font-semibold bg-red-600 rounded-full absolute -top-2 -right-2'>
                                        {notification?.length}
                                    </div>
                                )}
                            </div>
                            <Avatar
                                className='cursor-pointer'
                                onClick={onOpen}
                                borderWidth='1px'
                                name={`${profile.firstName} ${profile.lastName}`}
                                size='md'
                                src={`${IMAGE_URl}/useravatar/pfimg_${profile.userID}.png?lastmod=${profile.modifiedDate}`}
                            />
                            <div className='cursor-pointer' onClick={onOpen}>
                                <RxHamburgerMenu className='text-white text-3xl ' />
                            </div>
                        </>
                    ) : (
                        <Link
                            href={`/account/login`}
                            className='bg-primaryText text-white px-4 py-[6px] rounded-lg font-bold'>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
            <SideBar isOpen={isOpen} onClose={onClose} />
            <NotificationBar
                onClick={fetchNotifications}
                isOpen={notifIsOpen}
                onClose={notifOnClose}
            />
        </header>
    );
};
export default Navbar;
