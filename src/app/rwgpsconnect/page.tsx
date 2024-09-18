import { RWGPS } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
  title: "Chasing Watts | Ride w GPS Connect",
  description: "Ride w GPS Connect for Chasing Watts",
};
const page = () => {
  return (
    <CustomLayout>
      <RWGPS />;
    </CustomLayout>
  );
};

export default page;
