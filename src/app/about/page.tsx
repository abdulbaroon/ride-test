import { AboutUs } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the About Us page
 * @type {Metadata}
 * @description Provides the metadata information such as title and description for the About Us page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | About Us",
  description: "Chasing Watts - Connecting Cyclists",
};

/**
 * Main component for the About Us page
 * @function
 * @name Page
 * @description Renders the About Us section within a custom layout.
 * @returns {JSX.Element} JSX to render the About Us page inside the custom layout.
 */
const Page = (): JSX.Element => {
  return (
    <CustomLayout>
      <AboutUs />
    </CustomLayout>
  );
};

export default Page;
