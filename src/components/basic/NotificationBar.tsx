import { IMAGE_URl } from "@/constant/appConfig";
import { logout } from "@/redux/slices/authSlice";
import {
  markAllNotification,
  markNotification,
} from "@/redux/slices/notificationSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { deleteCookies } from "@/shared/util/auth.util";
import { formatIsoDateString } from "@/shared/util/dateFormat.util";
import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

interface UserProfileModel {
  firstName: string;
}

interface Notification {
  notificationID: number;
  notificationText: string;
  notificationUrl: string;
  isRead: boolean;
  notificationDate: string;
  userProfileModel: UserProfileModel;
}

interface NotificationState {
  AllNotifications: Notification[];
}

interface NotificationBarProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
}

const NotificationBar: FC<NotificationBarProps> = ({
  isOpen,
  onClose,
  onClick,
}) => {
  const AllNotifications = useSelector<RootState, Notification[]>(
    (state) => state.notification.AllNotifications
  );
  const user = useSelector<RootState>((state) => state.auth.user) as User;


  const dispatch = useDispatch<AppDispatch>();

  const handleClick = async (notifId: number) => {
    onClose();
    await dispatch(markNotification(notifId));
    onClick();
  };

  const handleMarkAsRead = async () => {
    if(user.id){
    onClose();
    await dispatch(markAllNotification(user.id));
    onClick();
    }
  };


  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>
          <DrawerBody>
            <div>
              <button
                onClick={handleMarkAsRead}
                className="text-primaryText font-bold"
              >
                Mark all read
              </button>
            </div>
            <div className="flex flex-col mt-4">
              {AllNotifications?.map((data) => (
                <div key={data.notificationID} className="border-y py-2">
                  <Link
                    href={data.notificationUrl}
                    onClick={() => {handleClick(data.notificationID); onClose()}}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        data.isRead ? "text-gray-700" : "text-red-600"
                      }`}
                    >
                      {data.notificationText}
                    </p>
                  </Link>
                  <div className="text-gray-500 text-xs mt-1">
                    <p>
                      {data.userProfileModel.firstName} on{" "}
                      {formatIsoDateString(data.notificationDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link
                href="/notification"
                className="py-2 px-4 text-white font-semibold bg-secondaryButton rounded-md"
              >
                Manage Notifications
              </Link>
            </div>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotificationBar;
