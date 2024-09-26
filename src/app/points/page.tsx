import { Points } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Points page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Points",
  description: "Points for Chasing Watts",
};

/**
 * Points page component.
 *
 * This page displays the points system for users within the Chasing Watts platform.
 *
 * @returns {JSX.Element} The rendered Points page.
 */
const page = (): JSX.Element => {
  return (
    <CustomLayout>
      <Points />
    </CustomLayout>
  );
};

export default page;
