import { Strava } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
  title: "Chasing Watts | Strava Connect",
  description: "Strava Connect for Chasing Watts",
};

const page = () => {
  return (
    <CustomLayout>
      <Strava />;
    </CustomLayout>
  );
};

export default page;
