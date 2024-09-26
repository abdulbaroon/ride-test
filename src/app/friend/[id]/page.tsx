import { Friend } from "@/components/page";
import React, { FC } from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Friend page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Friend",
  description: "Friends for Chasing Watts",
};

/**
 * Props for the Page component.
 * @typedef {Object} PageProps
 * @property {Object} params - The route parameters.
 * @property {number} params.id - The ID of the friend.
 */
interface PageProps {
    params: {
        id: number;
    };
}

/**
 * Friend page component.
 *
 * This page renders the Friend component for a specific friend, identified by their ID.
 *
 * @param {PageProps} props - The component props.
 * @returns {JSX.Element} The rendered Friend page.
 */
const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;

  return (
    <CustomLayout>
      <Friend id={id} />
    </CustomLayout>
  );
};

export default Page;
