import { RatingPage, RideLog } from "@/components/page";
import React, { FC } from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

// Define an interface for the props
interface PageProps {
  params: {
    id: number; // The ID of the ride for the log
  };
}

/**
 * Metadata for the Ride Log page.
 *
 * This metadata is used for SEO and social media sharing.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Ride Log",
  description: "Ride Log for Chasing Watts",
};

/**
 * Ride Log page component.
 *
 * This component renders the RideLog for the specified ride ID.
 *
 * @param {PageProps} props - The component props.
 * @param {Object} props.params - The route parameters.
 * @param {number} props.params.id - The ID of the ride to log.
 * 
 * @returns {JSX.Element} The rendered Ride Log page.
 */
const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;
  return (
    <CustomLayout>
      <RideLog id={id} />
    </CustomLayout>
  );
};

export default Page;
