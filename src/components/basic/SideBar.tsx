import { profileData, sideBarData } from "@/constant";
import { IMAGE_URl } from "@/constant/appConfig";
import { logout } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { UserProfileData } from "@/shared/types/account.types";
import { deleteCookies } from "@/shared/util/auth.util";
import {
    Avatar,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReusableAlertDialog } from "./ReusableAlertDialog";

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideBar: FC<SideBarProps> = ({ isOpen, onClose }) => {
    const profile = useSelector<RootState>(
        (state) => state.auth.profileData
    ) as UserProfileData;
    const email = useSelector<RootState, any>((state) => state.auth.email);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
    } = useDisclosure();

    const sideBarDataList = sideBarData(profile.userID);

    const handelLogOut = () => {
        router.push("/");
        dispatch(logout());
        onClose();
        onAlertClose();
        deleteCookies();
    };
    return (
        <>
            <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader></DrawerHeader>

                    <DrawerBody>
                        <div className='mt-7 flex gap-2 border-b pb-2'>
                            <Avatar
                                borderWidth='2px'
                                name={`${profile.firstName} ${profile.lastName}`}
                                size='lg'
                                src={`${IMAGE_URl}/useravatar/pfimg_${profile.userID}.png?lastmod=${profile.modifiedDate}`}
                            />
                            <div className='text-gray-500 text-xs'>
                                <p className='font-bold text-sm text-gray-800'>
                                    {profile.firstName} {profile.lastName}
                                </p>
                                <p className='text-bold'>
                                    {profile.homeBaseCity},{" "}
                                    {profile.homeBaseCountry}
                                </p>
                                <p className='text-bold'>
                                    Radius: {profile.defaultRadius} miles
                                </p>
                                <p className='text-bold'>
                                    {email && email.email}
                                </p>
                            </div>
                        </div>
                        <div>
                            {sideBarDataList.map(
                                ({ name, icon, link, border }, index) => {
                                    return (
                                        <div key={index} onClick={onClose}>
                                            <div
                                                className={`
                       
                     py-[6px] px-4 flex gap-3 items-center `}>
                                                <div className='text-gray-400 text-xl'>
                                                    {React.createElement(icon)}
                                                </div>
                                                {name === "Sign Out" ? (
                                                    <p
                                                        className='text-gray-600 cursor-pointer hover:text-primaryText'
                                                        onClick={onAlertOpen}>
                                                        {name}
                                                    </p>
                                                ) : (
                                                    <Link
                                                        href={`${link}`}
                                                        className='text-gray-700 hover:text-primaryText'>
                                                        {name}
                                                    </Link>
                                                )}
                                            </div>
                                            <div
                                                className={` ${
                                                    border &&
                                                    "border-b h-1 w-full my-1 "
                                                } `}></div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </DrawerBody>
                    <DrawerFooter>Version 3.1.23</DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ReusableAlertDialog
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                title='Logout !'
                message='Are you sure you want to logout?'
                onConfirm={handelLogOut}
            />
        </>
    );
};

export default SideBar;
