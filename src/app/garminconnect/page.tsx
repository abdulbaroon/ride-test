import { Garmin } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
  title: "Chasing Watts | Garmin Connect",
  description: "Garmin Connect for Chasing Watts",
};

const page = () => {
  return (
    <CustomLayout>
      <Garmin />;
    </CustomLayout>
  );
};

export default page;
