"use client";
import { profileData } from "@/constant";
import { logout } from "@/redux/slices/authSlice";
import { deleteCookies } from "@/shared/util/auth.util";
import { useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { ReusableAlertDialog } from "../basic/ReusableAlertDialog";

type Props = {
  name?: string;
};

const ProfileSideData: React.FC<Props> = ({ name }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const handelLogOut = () => {
    router.push("/");
    dispatch(logout());
    onAlertClose();
    deleteCookies();
  };
  return (
    <>
      <div className="border border-gray-300 rounded-xl w-full desktop:w-[25%] bg-white shadow-lg overflow-hidden h-fit">
        <div className="bg-gray-300 border-b border-gray-400">
          <h1 className=" font-bold py-3 px-4 text-gray-800">{name}</h1>
        </div>
        {profileData.map(({ name, icon, link }, index) => {
          return (
            <div
              key={index}
              className="border-b border-gray-300  py-3 px-4 flex gap-3 items-center  "
            >
              <div className="text-gray-400 text-xl">
                {React.createElement(icon)}
              </div>
              {name === "Sign Out" ? (
                <p
                  className="text-gray-600 cursor-pointer "
                  onClick={onAlertOpen}
                >
                  {name}
                </p>
              ) : (
                <Link href={`${link}`} className="text-gray-700">
                  {name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <ReusableAlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        title="Disconnect?"
        message="Are you sure you remove this friend?"
        onConfirm={handelLogOut}
      />
    </>
  );
};

export default ProfileSideData;
