import { Strava } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Strava Connect page.
 *
 * This metadata is used for SEO and social media sharing.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Strava Connect",
  description: "Strava Connect for Chasing Watts",
};

/**
 * Strava Connect page component.
 *
 * This component renders the Strava connection functionality for the Chasing Watts application.
 *
 * @returns {JSX.Element} The rendered Strava Connect page.
 */
const Page = () => {
  return (
    <CustomLayout>
      <Strava />
    </CustomLayout>
  );
};

export default Page;
