"use client";

import { notificationSetting } from "@/constant";
import {
  getUserNotification,
  UpdateUserNotification,
} from "@/redux/slices/notificationSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { Switch, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { HiOutlineHome } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface NotificationFormData {
  connectionRequestFollowEmail: boolean;
  connectionRequestFollowApp: boolean;
  newRideEmail: boolean;
  newRideApp: boolean;
  activityInviteEmail: boolean;
  activityInviteApp: boolean;
  activityUpdateEmail: boolean;
  activityUpdateApp: boolean;
  activityDiscussionEmail: boolean;
  activityDiscussionApp: boolean;
  activityRosterEmail: boolean;
  activityRosterApp: boolean;
  activityReminderEmail: boolean;
  activityReminderApp: boolean;
  adminNoteEmail: boolean;
  adminNoteApp: boolean;
  newsletterEmail: boolean;
  newsletterApp: boolean;
}

export const ManageNotification = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector<RootState>((state) => state.auth.user) as User;
  const userNotification = useSelector<RootState, any>(
    (state) => state.notification.userNotification
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NotificationFormData>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user.id) {
      dispatch(getUserNotification(user.id));
    }
  }, [user.id, dispatch]);

  useEffect(() => {
    if (userNotification) {
      setValue(
        "connectionRequestFollowEmail",
        userNotification.connectionRequestFollowEmail
      );
      setValue(
        "connectionRequestFollowApp",
        userNotification.connectionRequestFollowApp
      );
      setValue("newRideEmail", userNotification.newRideEmail);
      setValue("newRideApp", userNotification.newRideApp);
      setValue("activityInviteEmail", userNotification.activityInviteEmail);
      setValue("activityInviteApp", userNotification.activityInviteApp);
      setValue("activityUpdateEmail", userNotification.activityUpdateEmail);
      setValue("activityUpdateApp", userNotification.activityUpdateApp);
      setValue(
        "activityDiscussionEmail",
        userNotification.activityDiscussionEmail
      );
      setValue("activityDiscussionApp", userNotification.activityDiscussionApp);
      setValue("activityRosterEmail", userNotification.activityRosterEmail);
      setValue("activityRosterApp", userNotification.activityRosterApp);
      setValue("activityReminderEmail", userNotification.activityReminderEmail);
      setValue("activityReminderApp", userNotification.activityReminderApp);
      setValue("adminNoteEmail", userNotification.adminNoteEmail);
      setValue("adminNoteApp", userNotification.adminNoteApp);
      setValue("newsletterEmail", userNotification.newsletterEmail);
      setValue("newsletterApp", userNotification.newsletterApp);
    }
  }, [userNotification, setValue]);

  const renderCheckbox = (field: keyof NotificationFormData) => (
    <Switch
      {...register(field)}
      sx={{
        "& .chakra-switch__track:checked": {
          backgroundColor: "#29a9e1",
        },
      }}
      size="lg"
      isChecked={watch(field)}
    />
  );

  const onSubmit: SubmitHandler<NotificationFormData> = async (data) => {
    const payload = {
      ...data,
      userID: user?.id,
      userNotificationID: userNotification.userNotificationID,
      modifiedDate: new Date().toISOString(),
    };
    setLoading(true);
    const response = await dispatch(UpdateUserNotification(payload));
    setLoading(false);
    if (UpdateUserNotification.fulfilled.match(response)) {
      toast.success("Your notification settings have been updated.");
    } else {
      toast.error("something went wrong");
    }
  };

  return (
    <div className="w-11/12 mx-auto !max-w-[1320px] mt-28">
      <div className="pt-1">
        <h1 className="text-gray-500 flex gap-1 items-center">
          <Link href={"/dashboard"}>
            <HiOutlineHome />
          </Link>
          <IoIosArrowForward />
          <Link href={"/account/profile"}>Profile</Link>
          <IoIosArrowForward />
          <p className="text-primaryText">Notification Settings</p>
        </h1>
      </div>
      <div className="bg-white rounded-lg my-6">
        <p className="text-3xl px-4 py-3 text-gray-700 font-bold border-b">
          Notification Settings
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex border-b">
            <div className="w-1/2"></div>
            <div className="w-1/2 flex py-5 font-semibold text-lg text-gray-700">
              <div className="w-1/2">Email</div>
              <div className="w-1/2">Application</div>
            </div>
          </div>
          {notificationSetting.map((data, index) => (
            <div key={index} className="flex mx-4 py-3 border-b">
              <div className="w-1/2">
                <p>{data.title}</p>
              </div>
              <div className="w-1/2 flex font-semibold text-gray-500">
                <div className="w-1/2 text-lg">
                  {renderCheckbox(data.forEmail as keyof NotificationFormData)}
                </div>
                <div className="w-1/2">
                  {renderCheckbox(data.forApp as keyof NotificationFormData)}
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-start p-4">
            <button
              type="submit"
              className="bg-primaryText text-white rounded-md font-bold py-2 px-4 "
            >
              {loading ? (
                <CgSpinner className="animate-spin w-6 h-6" />
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageNotification;
