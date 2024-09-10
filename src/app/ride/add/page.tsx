import { AddRidePage } from "@/components/page";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ChasingWatt | Add",
  description: "ChasingWatts ride add ",
  openGraph: {
    title: "Ride Details",
    description: "Details of the ride.",
    images:  "https://dev.chasingwatts.com/ridepictures/ridepicture_32497_981.png" 
  },
};

const AddRide = () => {
  return <AddRidePage />;
};

export default AddRide;
