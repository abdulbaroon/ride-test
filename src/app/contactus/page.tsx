import { Contact } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Contact Us page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Contact Us",
  description: "Chasing Watts - Connecting Cyclists",
};

/**
 * Contact Us page component.
 *
 * This page renders the Contact component within a custom layout for users to get in touch.
 *
 * @returns {JSX.Element} The rendered Contact Us page.
 */
const page = (): JSX.Element => {
  return (
    <CustomLayout>
      <Contact />
    </CustomLayout>
  );
};

export default page;
