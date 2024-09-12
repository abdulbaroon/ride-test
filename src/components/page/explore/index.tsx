"use client";
import MapBoxModal from "@/components/module/MapBoxModal";
import { getActivityExplore } from "@/redux/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ExploreMap = () => {
  const userData = useSelector<RootState>((state) => state.auth.user) as User;
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (userData?.id && userData?.userProfile?.defaultRadius) {
      dispatch(
        getActivityExplore({
          id: userData?.id,
          radius: userData?.userProfile?.defaultRadius,
        })
      );
    }
  }, [userData]);
  return (
    <section className="flex items-center h-full p-16 mt-24 text-gray-800">
      <div className="w-full h-[70vh]" >
        <MapBoxModal profile={userData.userProfile} />
      </div>
    </section>
  );
};

export default ExploreMap;
