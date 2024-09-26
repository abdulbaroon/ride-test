import { AddRidePage } from "@/components/page";
import { IMAGE_URl } from "@/constant/appConfig";
import { Metadata } from "next";
import React from "react";

/**
 * Metadata for the Add Ride page.
 * 
 * This metadata will be used for SEO and social sharing.
 * 
 * @constant {Metadata}
 */
export const metadata: Metadata = {
  title: "Chasing Watts Add",
  description: "ChasingWatts ride add",
  openGraph: {
    title: "Ride Details",
    description: "Details of the ride.",
    images: `${IMAGE_URl}/ridepictures/ridepicture_32497_981.png`, 
  },
};

/**
 * AddRide component for creating a new ride.
 *
 * This component renders the AddRidePage which contains the
 * form and functionalities for adding a new ride.
 *
 * @returns {JSX.Element} The rendered AddRide component.
 */
const AddRide = () => {
  return <AddRidePage />;
};

export default AddRide;
