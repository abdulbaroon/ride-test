import { AboutUs } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
  title: "Chasing Watts | About Us",
  description: "Chasing Watts - Connecting Cyclists",
};

const page = () => {
  return (
    <CustomLayout>
      <AboutUs />;
    </CustomLayout>
  );
};

export default page;
