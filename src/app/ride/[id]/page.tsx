
import { RideDetails } from "@/components/page";
import React, { FC } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { api } from "@/shared/api";
import { formatRideData } from "@/shared/util/format.util";
import Head from 'next/head';
interface RideResponse {
  rideName: string;
  rideNotes: string;
  image?: string;
}

interface PageProps {
  params: {
    id: number;
  };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const endpoint = `/activity/${id}`;

  let rideResponse: any | null = null;
  try {
    rideResponse = await api.get(endpoint).then((res) => res.data);
  } catch (error) {
    console.error("Error fetching ride data:", error);
    return {
      title: "Ride Not Found",
      description: "Unable to fetch ride details.",
    };
  }

  const formattedRide = rideResponse ? formatRideData(rideResponse) : null;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: formattedRide?.rideName || "Ride Details",
    description: formattedRide?.rideNotes || "Details of the ride.",
    openGraph: {
      title: formattedRide?.rideName || "Ride Details",
      description: formattedRide?.rideNotes || "Details of the ride.",
      images: [
        formattedRide?.image || "https://dev.chasingwatts.com/ridepictures/ridepicture_32497_981.png" as any,
        ...previousImages,
      ],
    },
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;
  return (
    <>
      <RideDetails id={id} />
    </>
  );
};

export default Page;
