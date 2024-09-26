import { RatingPage } from "@/components/page";
import React, { FC } from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Rating page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Ride Rating",
  description: "Rating for Chasing Watts",
};

/**
 * Props for the Page component.
 * @interface PageProps
 * @property {Object} params - Route parameters.
 * @property {number} params.id - The ID of the ride to be rated.
 */
interface PageProps {
  params: {
    id: number;
  };
}

/**
 * Rating page component.
 *
 * This component renders the RatingPage with the given ride ID.
 *
 * @param {PageProps} props - The props for the component.
 * @returns {JSX.Element} The rendered Rating page.
 */
const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;
  return (
    <CustomLayout>
      <RatingPage id={id} />
    </CustomLayout>
  );
};

export default Page;
