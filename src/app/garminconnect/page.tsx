import { Garmin } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Garmin Connect page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Garmin Connect",
  description: "Garmin Connect for Chasing Watts",
};

/**
 * Garmin Connect page component.
 *
 * This page renders the Garmin component within a custom layout for users to connect their Garmin account.
 *
 * @returns {JSX.Element} The rendered Garmin Connect page.
 */
const page = (): JSX.Element => {
  return (
    <CustomLayout>
      <Garmin />
    </CustomLayout>
  );
};

export default page;
