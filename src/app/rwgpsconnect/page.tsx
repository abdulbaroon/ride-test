import { RWGPS } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Ride w GPS Connect page.
 *
 * This metadata is used for SEO and social media sharing.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Ride w GPS Connect",
  description: "Ride w GPS Connect for Chasing Watts",
};

/**
 * Ride w GPS Connect page component.
 *
 * This component renders the RWGPS integration for the Chasing Watts application.
 *
 * @returns {JSX.Element} The rendered Ride w GPS Connect page.
 */
const Page = () => {
  return (
    <CustomLayout>
      <RWGPS />
    </CustomLayout>
  );
};

export default Page;
