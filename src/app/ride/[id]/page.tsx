import { RideDetails } from "@/components/page";
import React, { FC } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { api } from "@/shared/api";
import { formatRideData } from "@/shared/util/format.util";

interface PageProps {
  params: {
    id: number;
  };
}
// const fetchRide= async (id:any)=>{
//   try {
//     const endpoint = `/activity/${id}`;
//     const response = await api.get(endpoint);
//     return response.data as any;
//   } catch (error: any) {
//    console.log("errir")
//   }
// }
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  const endpoint = `/activity/${id}`;
  const rideResponse = await api.get(endpoint).then((res) => res.data);
  const formattedRide = rideResponse ? formatRideData(rideResponse) : null;
  console.log(formattedRide, "end");

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: formattedRide?.rideName,
    description:formattedRide?.rideNotes,
    openGraph: {
      images: [formattedRide?.image as any, ...previousImages],
    },
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;
  return <RideDetails id={id} />;
};

export default Page;
