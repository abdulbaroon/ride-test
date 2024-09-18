import { Points } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
  title: "Chasing Watts | Points",
  description: "Points for Chasing Watts",
};
const page = () => {
  return (
    <CustomLayout>
      <Points />;
    </CustomLayout>
  );
};

export default page;
